import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';

import { initCube } from './lib/cube.js';
import { initScroll, reveal, parallax, initNav } from './lib/scroll.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
  const lenis = initScroll();
  reveal();
  parallax();
  initNav(lenis);

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
