document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser?.();
  if (!user) {
    const isInSubdir = window.location.pathname.includes('/account-settings/');
    window.location.href = isInSubdir ? '../login.html' : 'login.html';
    return;
  }

  const section = document.body.getAttribute('data-section');
  if (!section) return;

  document.querySelectorAll('.account-nav .nav-item').forEach(item => {
    if (item.dataset.section === section) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
});
