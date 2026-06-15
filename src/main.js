import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';
import './styles/ink.css';

import { initScroll, reveal, revealLines, revealMedia, counters, heroIntro, parallax, runPath, stackCards, initNav } from './lib/scroll.js';
import { initSpeedcube } from './lib/speedcube.js';
import { initScramble } from './lib/scramble.js';
import { initTimer } from './lib/timer.js';
import { initLightbox } from './lib/lightbox.js';
import { initVelocity } from './lib/velocity.js';
import { initLoader } from './lib/loader.js';
import { initBackdrop } from './lib/backdrop.js';
import { initContact } from './lib/contact.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// `?still` = screenshot/QA mode: render every section in its final, visible
// state (no scroll-triggered hiding), so full-page captures aren't blank below
// the fold. Harmless in production.
const STILL = new URLSearchParams(location.search).has('still');

function boot() {
  document.documentElement.classList.add('js');
  if (STILL) document.documentElement.classList.add('still');

  // 3D cube — lazy-loaded so Three.js doesn't block first paint.
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
  initLoader(lenis);
  if (!STILL) {
    heroIntro();
    reveal();
    revealLines();
    revealMedia();
    counters();
    parallax();
    stackCards();
    initScramble();
  }
  runPath();   // self-gates: draws the curve in still/reduced mode, animates otherwise
  initNav(lenis);
  initVelocity();
  initBackdrop();

  // Interactions
  initSpeedcube();
  initTimer();
  initLightbox();
  initContact();

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
