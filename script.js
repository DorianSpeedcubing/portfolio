// ── Stars ───────────────────────────────────────────
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.1 + 0.2,
    a: Math.random(),
    speed: Math.random() * 0.003 + 0.001,
    phase: Math.random() * Math.PI * 2,
  }));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const t = Date.now() * 0.001;
  for (const s of stars) {
    const alpha = s.a * (0.4 + 0.6 * Math.sin(t * s.speed * 60 + s.phase));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180,210,255,${alpha})`;
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
resize();
window.addEventListener('resize', resize, { passive: true });
draw();

// ── Nav ─────────────────────────────────────────────
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger?.addEventListener('click', () => navLinks?.classList.toggle('open'));
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

window.addEventListener('scroll', () => {
  document.getElementById('nav')?.classList.toggle('scrolled', scrollY > 40);
}, { passive: true });

// ── Scroll reveal ────────────────────────────────────
document.querySelectorAll(
  '.proj-card, .tl-item, .gi-card, .gal-item, .lang-row, .chip, .cc, .interest-item, .star-row'
).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 6) * 0.045}s`;
});

new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); } });
}, { threshold: 0.07 }).observe || (() => {})();

const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); } });
}, { threshold: 0.07 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── Console ──────────────────────────────────────────
console.log('%c Dorian Bellet · Portfolio 2026 ', 'background:#63b3ed;color:#0d1117;font-family:monospace;font-size:13px;font-weight:bold;padding:5px 12px;border-radius:4px;');
console.log('%c BUT Informatique · IUT Orsay · Stage 20 avr → 10 juil ', 'color:#48bb78;font-family:monospace;font-size:11px;');
