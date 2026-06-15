import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Pure: should the decorative backdrop run its scroll parallax? */
export function shouldAnimateBackdrop({ reduced, still }) {
  return !reduced && !still;
}

/**
 * Scroll-driven parallax drift for every `[data-ink]` layer. The permanent
 * "breathing" lives in CSS on `.ink__art`; parallax translates the outer
 * `.ink` wrapper, so the two transforms never fight. No-op under reduced-motion
 * or `?still` (CSS renders the static final state in those cases).
 */
export function initBackdrop() {
  const still = document.documentElement.classList.contains('still');
  if (!shouldAnimateBackdrop({ reduced, still })) return;

  gsap.utils.toArray('[data-ink]').forEach((el) => {
    const depth = parseFloat(el.dataset.inkDepth || '0.3');
    const section = el.closest('section') || el;
    gsap.fromTo(el,
      { y: -depth * 70 },
      {
        y: depth * 70,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
      });
  });
}
