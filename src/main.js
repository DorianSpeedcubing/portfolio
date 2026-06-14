import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';

import { initCube } from './lib/cube.js';

// Boot. Modules are wired in progressively (cube, scroll, nav, effects).
function boot() {
  document.documentElement.classList.add('js');

  const canvas = document.getElementById('cube');
  const cube = canvas ? initCube(canvas) : null;

  // Feed global pointer to the cube (cursor-reactive tilt).
  if (cube) {
    window.addEventListener('pointermove', (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      cube.setPointer(x, -y);
    }, { passive: true });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
