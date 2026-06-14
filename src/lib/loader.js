/**
 * Intro loader — a speedcube "solve" that opens onto the site.
 *
 * Timeline (~3s): a 3D cube tumbles with scrambled stickers while a speedcube
 * timer counts up; at the solve moment the stickers snap to their solved faces
 * and the timer locks green; then two panels split apart (the "opening") to
 * reveal the page behind. Runs once per session; skipped under reduced-motion,
 * `?still` capture mode, or when JS is unavailable.
 */

const FACES = [
  ['front', 'var(--c-r)'],
  ['back', 'var(--c-o)'],
  ['right', 'var(--c-b)'],
  ['left', 'var(--c-g)'],
  ['top', 'var(--c-w)'],
  ['bottom', 'var(--c-y)'],
];
const PALETTE = ['var(--c-r)', 'var(--c-o)', 'var(--c-y)', 'var(--c-g)', 'var(--c-b)', 'var(--c-w)'];

export function initLoader(lenis) {
  const el = document.getElementById('loader');
  if (!el) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const still = document.documentElement.classList.contains('still');
  let seen = false;
  try { seen = sessionStorage.getItem('dweez-intro') === '1'; } catch (_) { /* private mode */ }

  if (reduced || still || seen) { el.remove(); return; }

  document.documentElement.classList.add('loading');
  if (lenis) lenis.stop();

  // Build the cube: 6 faces × 9 stickers, each sticker starting on a random
  // (scrambled) colour. Keep refs so we can snap them to solved later.
  const cubeEl = el.querySelector('[data-loader-cube]');
  const built = FACES.map(([name, color]) => {
    const face = document.createElement('div');
    face.className = `cube3d__face cube3d__face--${name}`;
    const stickers = [];
    for (let i = 0; i < 9; i += 1) {
      const s = document.createElement('i');
      s.style.background = PALETTE[(Math.random() * PALETTE.length) | 0];
      s.style.transitionDelay = `${i * 0.03}s`;
      face.appendChild(s);
      stickers.push(s);
    }
    cubeEl.appendChild(face);
    return { color, stickers };
  });

  // Speedcube timer counting up to a believable solve time.
  const timerEl = el.querySelector('[data-loader-timer]');
  const capEl = el.querySelector('[data-loader-cap]');
  timerEl.textContent = '0.00';
  if (capEl) capEl.textContent = 'résolution';
  const target = 6 + Math.random() * 3; // 6–9 s
  const countDur = 1500;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  let raf;
  const t0 = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - t0) / countDur);
    timerEl.textContent = (target * easeOut(p)).toFixed(2);
    if (p < 1) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  const timers = [];
  const after = (ms, fn) => timers.push(setTimeout(fn, ms));

  // Solve: snap stickers to their face colours + lock the timer green.
  after(1500, () => {
    cancelAnimationFrame(raf);
    timerEl.textContent = target.toFixed(2);
    built.forEach((f) => f.stickers.forEach((s) => { s.style.background = f.color; }));
    el.classList.add('is-solved');
    if (capEl) capEl.textContent = 'résolu';
  });

  // Open: split the panels apart, then tear the loader down.
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    cancelAnimationFrame(raf);
    el.classList.add('is-open');
    setTimeout(() => {
      el.remove();
      document.documentElement.classList.remove('loading');
      if (lenis) lenis.start();
      try { sessionStorage.setItem('dweez-intro', '1'); } catch (_) { /* ignore */ }
    }, 850);
  };
  after(2300, finish);

  // Safety net: never trap the user if a timer is throttled (background tab).
  after(4500, finish);
}
