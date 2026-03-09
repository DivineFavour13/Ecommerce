document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser?.();
  if (!user) {
    window.location.href = '../login.html';
    return;
  }

  const passwordForm = document.getElementById('password-form');
  const oldPass = document.getElementById('old-password');
  const newPass = document.getElementById('new-password');
  const confirmPass = document.getElementById('confirm-password');
  const twoFactor = document.getElementById('two-factor-toggle');
  const historyEl = document.getElementById('login-history');
  const logoutAllBtn = document.getElementById('logout-all');

  if (twoFactor) {
    const sec = getUserSecuritySettings(user);
    twoFactor.checked = !!sec.twoFactor;
    twoFactor.addEventListener('change', () => {
      saveUserSecuritySettings(user, { twoFactor: twoFactor.checked });
      showNotification?.('Security settings updated', 'success');
    });
  }

  if (historyEl) {
    const history = getUserLoginHistory(user);
    if (history.length === 0) {
      historyEl.innerHTML = '<div class="login-item">No login activity yet.</div>';
    } else {
      historyEl.innerHTML = history.map(h => {
        const when = new Date(h.at || Date.now()).toLocaleString();
        const device = h.device || 'Unknown device';
        return `<div class="login-item"><strong>${when}</strong> · ${device}</div>`;
      }).join('');
    }
  }

  if (passwordForm) {
    passwordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!oldPass.value || !newPass.value || !confirmPass.value) {
        showNotification?.('Please fill all password fields', 'error');
        return;
      }
      if (newPass.value.length < 6) {
        showNotification?.('Password must be at least 6 characters', 'error');
        return;
      }
      if (newPass.value !== confirmPass.value) {
        showNotification?.('Passwords do not match', 'error');
        return;
      }
      const ok = changeUserPassword(user, oldPass.value, newPass.value);
      if (ok) {
        oldPass.value = '';
        newPass.value = '';
        confirmPass.value = '';
        showNotification?.('Password updated', 'success');
      } else {
        showNotification?.('Current password is incorrect', 'error');
      }
    });
  }

  if (logoutAllBtn) {
    logoutAllBtn.addEventListener('click', () => {
      if (!confirm('Logout from all devices?')) return;
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('savedEmail');
      logout?.();
      showNotification?.('Logged out from all devices', 'success');
      setTimeout(() => {
        window.location.href = '../login.html';
      }, 600);
    });
  }
});
