/** Custom dual-element cursor: instant dot + lagging ring. Fine pointers only. */
export function initCursor() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine) return;

  const dot = document.createElement('div'); dot.className = 'cursor-dot';
  const ring = document.createElement('div'); ring.className = 'cursor-ring';
  document.body.append(dot, ring);
  document.body.classList.add('cursor-ready');

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  const place = (el, x, y) => { el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`; };
  place(dot, mx, my); place(ring, rx, ry);

  window.addEventListener('pointermove', (e) => {
    mx = e.clientX; my = e.clientY;
    place(dot, mx, my);
    if (!document.body.classList.contains('cursor-ready')) document.body.classList.add('cursor-ready');
  }, { passive: true });

  const tick = () => {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    place(ring, rx, ry);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  const HOVER = 'a, button, [data-magnetic], .interest, .pb, .skill-face li, .project__head, kbd';
  document.addEventListener('pointerover', (e) => {
    document.body.classList.toggle('cursor-hover', !!(e.target.closest && e.target.closest(HOVER)));
  });
  document.addEventListener('pointerdown', () => document.body.classList.add('cursor-down'));
  document.addEventListener('pointerup', () => document.body.classList.remove('cursor-down'));
  document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-ready'));
  document.addEventListener('mouseenter', () => document.body.classList.add('cursor-ready'));
}
