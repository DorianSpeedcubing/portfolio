const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&/<>';

/**
 * One frame of a scramble→solve text effect. Characters before `progress`
 * are revealed (target), the rest are random glyphs; spaces are preserved.
 * Pure (unit-tested) — `rand` is injectable for determinism.
 */
export function scrambleFrame(target, progress, rand = Math.random) {
  const reveal = Math.floor(Math.max(0, Math.min(1, progress)) * target.length);
  let out = '';
  for (let i = 0; i < target.length; i++) {
    const ch = target[i];
    if (i < reveal || ch === ' ') out += ch;
    else out += GLYPHS[Math.floor(rand() * GLYPHS.length)];
  }
  return out;
}

/**
 * Apply the scramble→solve effect to [data-scramble] + .eyebrow labels when
 * they scroll into view (once each). Reduced-motion: leave final text as-is.
 */
export function initScramble() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = document.querySelectorAll('[data-scramble], .eyebrow');

  const run = (el) => {
    const target = el.dataset.text || el.textContent;
    el.dataset.text = target;
    const dur = Math.min(900, 320 + target.length * 34);
    const start = performance.now();
    const tick = (now) => {
      const p = (now - start) / dur;
      if (p >= 1) { el.textContent = target; return; }
      el.textContent = scrambleFrame(target, p);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((e) => { if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  els.forEach((el) => io.observe(el));
}
