/** Expandable STAR project case-study cards. */
export function initProjects() {
  document.querySelectorAll('.project__head').forEach((btn) => {
    btn.addEventListener('click', () => {
      const li = btn.closest('.project');
      const open = li.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });
}
