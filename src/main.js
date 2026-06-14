import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';

// Boot. Modules are wired in progressively (cube, scroll, nav, effects).
function boot() {
  document.documentElement.classList.add('js');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
