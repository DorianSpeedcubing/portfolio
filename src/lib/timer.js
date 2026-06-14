/**
 * Format milliseconds as a speedcube solve time.
 *   6420  -> "6.42"
 *   72530 -> "1:12.53"
 *   0     -> "0.00"
 * Pure (unit-tested).
 */
export function formatTime(ms) {
  const totalCs = Math.floor(Math.max(0, ms) / 10);
  const cs = totalCs % 100;
  const totalSec = Math.floor(totalCs / 100);
  const sec = totalSec % 60;
  const min = Math.floor(totalSec / 60);
  const cc = String(cs).padStart(2, '0');
  return min > 0 ? `${min}:${String(sec).padStart(2, '0')}.${cc}` : `${sec}.${cc}`;
}

/**
 * Spacebar WCA-style solve timer, scoped to the speedcube section so it never
 * hijacks normal space-to-scroll elsewhere.
 *   hold Space -> "ready" (green) -> release -> running -> Space -> stop.
 */
export function initTimer() {
  const el = document.querySelector('[data-timer]');
  if (!el) return;
  const timeEl = el.querySelector('.sc-timer__time');
  const section = document.getElementById('speedcube');

  let state = 'idle'; // idle | ready | running | stopped
  let startT = 0;
  let raf = 0;
  let active = false;

  if (section) {
    new IntersectionObserver(([e]) => { active = e.isIntersecting; }, { threshold: 0.25 })
      .observe(section);
  }

  const setState = (s) => {
    state = s;
    el.classList.toggle('is-ready', s === 'ready');
    el.classList.toggle('is-running', s === 'running');
  };
  const render = (ms) => { timeEl.textContent = formatTime(ms); };
  const loop = (now) => { render(now - startT); raf = requestAnimationFrame(loop); };
  const typing = () => /^(input|textarea|select)$/i.test(document.activeElement?.tagName || '');

  window.addEventListener('keydown', (e) => {
    if (e.code !== 'Space' || !active || typing()) return;
    e.preventDefault();
    if (e.repeat) return;
    if (state === 'idle' || state === 'stopped') { setState('ready'); render(0); }
    else if (state === 'running') { cancelAnimationFrame(raf); render(performance.now() - startT); setState('stopped'); }
  });

  window.addEventListener('keyup', (e) => {
    if (e.code !== 'Space' || !active || typing()) return;
    if (state === 'ready') { startT = performance.now(); setState('running'); raf = requestAnimationFrame(loop); }
  });
}
