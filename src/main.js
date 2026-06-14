import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';

import { initCube } from './lib/cube.js';
import { initScroll, reveal, parallax, initNav } from './lib/scroll.js';
import { initProjects } from './lib/projects.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Dev-only "still" mode (?still): disables Lenis + scroll reveals so any
// section can be screenshotted in place. Compiled out of production builds.
const STILL = import.meta.env.DEV && new URLSearchParams(location.search).has('still');
if (STILL) document.documentElement.classList.add('is-still');

function boot() {
  document.documentElement.classList.add('js');

  // 3D cube + cursor reactivity
  const canvas = document.getElementById('cube');
  const cube = canvas ? initCube(canvas) : null;
  if (cube) {
    window.addEventListener('pointermove', (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      cube.setPointer(x, -y);
    }, { passive: true });
  }

  // Smooth scroll + scroll-driven motion + nav
  const lenis = STILL ? null : initScroll();
  if (!STILL) { reveal(); parallax(); }
  initNav(lenis);
  initProjects();

  if (STILL && location.hash) {
    const t = document.querySelector(location.hash);
    if (t) requestAnimationFrame(() => requestAnimationFrame(() => t.scrollIntoView()));
  }

  // Recompute trigger positions once webfonts/images settle.
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
