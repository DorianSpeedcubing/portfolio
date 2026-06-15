import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Smooth scroll via Lenis, synced to GSAP's ticker + ScrollTrigger. */
export function initScroll() {
  if (reduced) return null;
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/** Fade/rise reveal for every [data-reveal]. */
export function reveal() {
  if (reduced) return;
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 34,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

/**
 * Word-by-word masked rise for headings/quotes ([data-reveal-lines]).
 * Splits text nodes into masked words; element children (e.g. .serif) rise
 * as a single unit. Skipped under reduced-motion (text left untouched).
 */
export function revealLines() {
  if (reduced) return;
  gsap.utils.toArray('[data-reveal-lines]').forEach((el) => {
    const nodes = Array.from(el.childNodes);
    const targets = [];
    el.textContent = '';
    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (part === '') return;
          if (part.trim() === '') { el.appendChild(document.createTextNode(part)); return; }
          const mask = document.createElement('span'); mask.className = 'word';
          const inner = document.createElement('i'); inner.textContent = part;
          mask.appendChild(inner); el.appendChild(mask); targets.push(inner);
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const mask = document.createElement('span'); mask.className = 'word';
        mask.appendChild(node); el.appendChild(mask); targets.push(node);
      } else {
        el.appendChild(node);
      }
    });
    gsap.from(targets, {
      yPercent: 118,
      opacity: 0,
      duration: 0.95,
      ease: 'power4.out',
      stagger: 0.055,
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
    });
  });
}

/** Clip-path wipe + image push-in for framed media (.media-reveal__frame). */
export function revealMedia() {
  if (reduced) return;
  gsap.utils.toArray('.media-reveal__frame').forEach((frame) => {
    const media = frame.querySelector('img, video');
    const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 88%', once: true } });
    tl.fromTo(frame,
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', duration: 1.05, ease: 'power3.out' });
    if (media) tl.from(media, { scale: 1.28, duration: 1.25, ease: 'power3.out' }, 0);
  });
}

/** Animated count-up for [data-count] numbers. */
export function counters() {
  if (reduced) return;
  gsap.utils.toArray('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count) || 0;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: end, duration: 1.5, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => { el.textContent = Math.round(obj.v); },
    });
  });
}

/** One-shot hero entrance: masked wordmark rise. */
export function heroIntro() {
  if (reduced) return;
  const lines = gsap.utils.toArray('.hero__l1, .hero__l2');
  if (!lines.length) return;
  gsap.set(lines, { yPercent: 112 });
  gsap.to(lines, { yPercent: 0, duration: 1.15, ease: 'power4.out', stagger: 0.12, delay: 0.1 });
}

/**
 * Scroll-driven vertical reveal for full-bleed divider portraits ([data-parallax]).
 * The cover crop pans top→bottom as the divider passes through the viewport, so
 * the whole subject is revealed across the scroll instead of only the sky.
 * Drives the `--oy` object-position var (cheap, GPU-friendly).
 */
export function parallax() {
  if (reduced) return;
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const wrap = el.closest('[data-parallax-wrap]') || el.parentElement;
    gsap.fromTo(
      el,
      { '--oy': '16%' },
      {
        '--oy': '86%',
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });
}

/**
 * "Solve Run" timeline: the spectrum spine fills top→bottom as the parcours
 * section scrolls through the viewport, like a running solve timer. The fill
 * defaults to full in CSS, so reduced-motion/still mode shows a completed run.
 */
export function runFill() {
  if (reduced) return;
  gsap.utils.toArray('[data-run]').forEach((run) => {
    const fill = run.querySelector('[data-run-fill]');
    if (!fill) return;
    gsap.fromTo(fill,
      { scaleY: 0 },
      {
        scaleY: 1, ease: 'none', transformOrigin: 'top',
        scrollTrigger: { trigger: run, start: 'top 72%', end: 'bottom 78%', scrub: 0.6 },
      });
  });
}

/**
 * "Solving stack": sticky project cards that scale down and dim as the next
 * card rises from below and locks over them — depth on both scroll directions.
 * The last card stays at full size. Skipped under reduced-motion (cards just
 * sticky-stack flat).
 */
export function stackCards() {
  if (reduced) return;
  const cards = gsap.utils.toArray('[data-stack-card]');
  cards.forEach((card, i) => {
    const inner = card.querySelector('[data-stack-inner]');
    const next = cards[i + 1];
    if (!inner || !next) return;
    const targetScale = 1 - (cards.length - 1 - i) * 0.035;
    gsap.fromTo(inner,
      { scale: 1, filter: 'brightness(1)' },
      {
        scale: targetScale, filter: 'brightness(0.72)', ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top+=120', scrub: true },
      });
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

  const setActive = (id) => links.forEach((l) => l.classList.toggle('is-active', l === byId.get(id)));
  const sections = links
    .map((l) => document.getElementById(l.getAttribute('href').slice(1)))
    .filter(Boolean);
  const io = new IntersectionObserver(
    (entries) => { entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); }); },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
  );
  sections.forEach((s) => io.observe(s));

  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (bar) {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

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
  // Dismiss the compact dropdown when tapping anywhere outside it
  document.addEventListener('click', (e) => {
    if (!document.documentElement.classList.contains('menu-open')) return;
    if (e.target.closest('.header__nav') || e.target.closest('[data-menu-toggle]')) return;
    closeMenu();
  });
}
