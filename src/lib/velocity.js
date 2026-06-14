import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Scroll-velocity-linked marquees (à la motion.dev "scroll velocity linked offset").
 *
 * Each [data-velocity] root holds a [data-velocity-track] with its content
 * duplicated twice for a seamless wrap. The track drifts at a constant base
 * speed; the current scroll velocity is added on top — faster scrolling
 * accelerates it and scroll direction flips its travel. A small velocity-linked
 * skew adds inertia.
 *
 * `data-velocity` = base drift speed (px/frame); `data-velocity-dir="rev"`
 * flips idle direction. Honours prefers-reduced-motion (stays static).
 */
export function initVelocity() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const tracks = Array.from(document.querySelectorAll('[data-velocity]'))
    .map((root) => {
      const track = root.querySelector('[data-velocity-track]');
      if (!track) return null;
      return {
        track,
        base: parseFloat(root.dataset.velocity) || 0.55,           // px/frame idle drift
        dir: root.dataset.velocityDir === 'rev' ? 1 : -1,          // idle travel sign
        half: track.scrollWidth / 2,
        x: 0,
        skew: 0,
        xSet: gsap.quickSetter(track, 'x', 'px'),
        skewSet: gsap.quickSetter(track, 'skewX', 'deg'),
      };
    })
    .filter(Boolean);

  if (!tracks.length) return;
  tracks.forEach((t) => t.xSet(0));
  if (reduced) return; // leave parked in resting state

  // One shared scroll velocity, updated on scroll and decayed once per frame.
  let velocity = 0;
  ScrollTrigger.create({ onUpdate: (self) => { velocity = self.getVelocity(); } });

  window.addEventListener('resize', () => {
    tracks.forEach((t) => { t.half = t.track.scrollWidth / 2; });
  }, { passive: true });

  const lerp = (a, b, t) => a + (b - a) * t;

  gsap.ticker.add((time, delta) => {
    const dt = delta / 16.667;                                     // ~1 at 60fps
    // velocity-linked offset, clamped so a flick can't fling it off-screen
    const boost = gsap.utils.clamp(-30, 30, velocity * 0.012);
    const skewTarget = gsap.utils.clamp(-9, 9, velocity * 0.0045);

    tracks.forEach((t) => {
      const move = (t.base * t.dir + boost) * dt;
      t.x = gsap.utils.wrap(-t.half, 0, t.x + move);
      t.xSet(t.x);
      t.skew = lerp(t.skew, skewTarget, 0.08);
      t.skewSet(t.skew);
    });

    velocity *= 0.9;                                               // single decay between scroll events
  });
}
