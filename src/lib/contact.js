/**
 * Click-to-copy for the contact email. The giant address stays a real mailto
 * link; the adjacent button copies the address to the clipboard and confirms.
 */
export function initContact() {
  const btn = document.querySelector('[data-copy]');
  if (!btn) return;

  const label = btn.querySelector('.mailto__copy-label');
  const original = label ? label.textContent : '';
  let timer;

  btn.addEventListener('click', async () => {
    const text = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard unavailable (insecure context / denied). The mailto link still
      // works, so we just skip the confirmation rather than fail loudly.
      return;
    }
    btn.classList.add('is-copied');
    if (label) label.textContent = 'copié';
    clearTimeout(timer);
    timer = setTimeout(() => {
      btn.classList.remove('is-copied');
      if (label) label.textContent = original;
    }, 1800);
  });
}
