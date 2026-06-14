/** Click-to-zoom photo lightbox with keyboard nav + focus management. */
export function initLightbox() {
  const imgs = Array.from(document.querySelectorAll('[data-lightbox]'));
  if (!imgs.length) return;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Photo');
  overlay.innerHTML = `
    <button class="lightbox__btn lightbox__close" aria-label="Fermer">&times;</button>
    <button class="lightbox__btn lightbox__prev" aria-label="Précédent">&lsaquo;</button>
    <figure class="lightbox__fig"><img class="lightbox__img" alt="" /></figure>
    <button class="lightbox__btn lightbox__next" aria-label="Suivant">&rsaquo;</button>`;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector('.lightbox__img');
  const closeBtn = overlay.querySelector('.lightbox__close');
  let idx = 0;
  let lastFocus = null;

  const show = (i) => {
    idx = (i + imgs.length) % imgs.length;
    imgEl.src = imgs[idx].currentSrc || imgs[idx].src;
    imgEl.alt = imgs[idx].alt || '';
  };
  const open = (i) => {
    lastFocus = document.activeElement;
    show(i);
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
  };
  const close = () => {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    if (lastFocus) lastFocus.focus();
  };

  imgs.forEach((el, i) => { el.addEventListener('click', () => open(i)); });
  closeBtn.addEventListener('click', close);
  overlay.querySelector('.lightbox__prev').addEventListener('click', () => show(idx - 1));
  overlay.querySelector('.lightbox__next').addEventListener('click', () => show(idx + 1));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
    else if (e.key === 'Tab') { e.preventDefault(); closeBtn.focus(); }
  });
}
