import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';

import { initScroll, reveal, parallax, initNav } from './lib/scroll.js';
import { initProjects } from './lib/projects.js';
import { initSpeedcube } from './lib/speedcube.js';
import { initScramble } from './lib/scramble.js';
import { initTimer } from './lib/timer.js';
import { initLightbox } from './lib/lightbox.js';
import { initMagnetic } from './lib/magnetic.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function boot() {
  document.documentElement.classList.add('js');

  // 3D cube + cursor reactivity — lazy-loaded so Three.js doesn't block first paint.
  const canvas = document.getElementById('cube');
  if (canvas) {
    import('./lib/cube.js').then(({ initCube }) => {
      const cube = initCube(canvas);
      window.addEventListener('pointermove', (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = (e.clientY / window.innerHeight) * 2 - 1;
        cube.setPointer(x, -y);
      }, { passive: true });
    });
  }

  // Smooth scroll + scroll-driven motion + nav
  const lenis = initScroll();
  reveal();
  parallax();
  initNav(lenis);
  initProjects();
  initSpeedcube();
  initTimer();
  initLightbox();
  initScramble();
  initMagnetic();

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
