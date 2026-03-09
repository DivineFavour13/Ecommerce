document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser?.();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const form = document.getElementById('preferences-form');
  const currencyEl = document.getElementById('pref-currency');
  const emailEl = document.getElementById('pref-email');
  const smsEl = document.getElementById('pref-sms');
  const newsletterEl = document.getElementById('pref-newsletter');

  if (!form || !currencyEl || !emailEl || !smsEl || !newsletterEl) return;

  const prefs = getUserPreferences(user);
  currencyEl.value = prefs.currency || 'NGN';
  emailEl.checked = !!prefs.emailNotifications;
  smsEl.checked = !!prefs.smsUpdates;
  newsletterEl.checked = !!prefs.newsletter;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPrefs = {
      currency: currencyEl.value,
      emailNotifications: emailEl.checked,
      smsUpdates: smsEl.checked,
      newsletter: newsletterEl.checked
    };
    const ok = saveUserPreferences(user, newPrefs);
    if (ok) {
      showNotification?.('Preferences saved', 'success');
    } else {
      showNotification?.('Failed to save preferences', 'error');
    }
  });
});
