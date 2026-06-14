import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Scroll-velocity-linked marquees (à la motion.dev "scroll velocity linked offset").
 *
 * Each [data-velocity] root holds a [data-velocity-track] whose children are the
 * repeating unit(s). The track drifts at a constant base speed; the current
 * scroll velocity is added on top — faster scrolling accelerates it and scroll
 * direction flips its travel. A small velocity-linked skew adds inertia.
 *
 * To stay seamless, units are cloned until the track always covers the viewport
 * (total width >= container + one unit), then x wraps by exactly one unit period
 * — so no blank gap is ever exposed at the trailing edge.
 *
 * `data-velocity` = base drift speed (px/frame); `data-velocity-dir="rev"`
 * flips idle direction. Honours prefers-reduced-motion (stays static).
 */
export function initVelocity() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const tracks = Array.from(document.querySelectorAll('[data-velocity]'))
    .map((root) => {
      const track = root.querySelector('[data-velocity-track]');
      if (!track || !track.children.length) return null;
      return {
        root,
        track,
        originals: Array.from(track.children),                     // the repeating unit(s)
        base: parseFloat(root.dataset.velocity) || 0.55,           // px/frame idle drift
        dir: root.dataset.velocityDir === 'rev' ? 1 : -1,          // idle travel sign
        unit: 0,                                                   // measured unit period
        x: 0,
        skew: 0,
        xSet: gsap.quickSetter(track, 'x', 'px'),
        skewSet: gsap.quickSetter(track, 'skewX', 'deg'),
      };
    })
    .filter(Boolean);

  if (!tracks.length) return;

  // Period of one repeating unit — offsetLeft delta captures trailing margins,
  // which offsetWidth would miss.
  const measureUnit = (t) => {
    const c = t.originals;
    return (c.length > 1 ? c[1].offsetLeft - c[0].offsetLeft : c[0].offsetWidth) || 0;
  };

  // Clone units until the track covers container + one unit, so wrapping never
  // reveals empty space. Cheap to re-run; only ever appends what's missing.
  const ensureCoverage = (t) => {
    t.unit = measureUnit(t) || t.track.scrollWidth / 2;
    const need = t.root.offsetWidth + t.unit + 80;
    let i = 0;
    while (t.unit > 0 && t.track.scrollWidth < need && i < 60) {
      t.track.appendChild(t.originals[i % t.originals.length].cloneNode(true));
      i += 1;
    }
  };

  const layout = () => tracks.forEach(ensureCoverage);
  layout();
  tracks.forEach((t) => t.xSet(0));
  // Webfonts change glyph widths after first paint — remeasure once they settle.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);

  if (reduced) return; // leave parked in resting state

  let velocity = 0;
  ScrollTrigger.create({ onUpdate: (self) => { velocity = self.getVelocity(); } });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 150);
  }, { passive: true });

  const lerp = (a, b, t) => a + (b - a) * t;

  gsap.ticker.add((time, delta) => {
    const dt = delta / 16.667;                                     // ~1 at 60fps
    // velocity-linked offset, clamped so a flick can't fling it off-screen
    const boost = gsap.utils.clamp(-30, 30, velocity * 0.012);
    const skewTarget = gsap.utils.clamp(-9, 9, velocity * 0.0045);

    tracks.forEach((t) => {
      if (!t.unit) return;
      const move = (t.base * t.dir + boost) * dt;
      t.x = gsap.utils.wrap(-t.unit, 0, t.x + move);
      t.xSet(t.x);
      t.skew = lerp(t.skew, skewTarget, 0.08);
      t.skewSet(t.skew);
    });

    velocity *= 0.9;                                               // single decay between scroll events
  });
}
