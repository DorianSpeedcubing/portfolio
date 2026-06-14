import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Smooth scroll via Lenis, synced to GSAP's ticker + ScrollTrigger. */
export function initScroll() {
  if (reduced) return null;
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/** Fade/rise reveal for every [data-reveal]; staggers siblings sharing a parent. */
export function reveal() {
  if (reduced) return;
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 26,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
    });
  });
}

/** Vertical parallax for full-bleed divider media ([data-parallax]). */
export function parallax() {
  if (reduced) return;
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const wrap = el.closest('[data-parallax-wrap]') || el.parentElement;
    gsap.fromTo(
      el,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });
}

/**
 * Sticky-nav behaviour: anchor smooth-scroll, active-section tracking,
 * scroll-progress bar, and a compact mobile menu toggle.
 */
export function initNav(lenis) {
  const header = document.querySelector('[data-header]');
  const links = Array.from(document.querySelectorAll('[data-nav-link]'));
  const bar = document.querySelector('[data-progress]');
  const menuBtn = document.querySelector('[data-menu-toggle]');

  const byId = new Map(links.map((l) => [l.getAttribute('href').slice(1), l]));

  const headerH = () => (header ? header.offsetHeight : 0);

  // Smooth-scroll anchor clicks (works with or without Lenis).
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      if (lenis) lenis.scrollTo(target, { offset: -headerH() + 2 });
      else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  });

  // Active-section tracking.
  const setActive = (id) => links.forEach((l) => l.classList.toggle('is-active', l === byId.get(id)));
  const sections = links
    .map((l) => document.getElementById(l.getAttribute('href').slice(1)))
    .filter(Boolean);
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
  );
  sections.forEach((s) => io.observe(s));

  // Shrink header after leaving the hero.
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Scroll-progress bar.
  if (bar) {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  // Mobile menu.
  function closeMenu() {
    document.documentElement.classList.remove('menu-open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const open = document.documentElement.classList.toggle('menu-open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
}
