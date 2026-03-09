document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser?.();
  if (!user) {
    window.location.href = '../login.html';
    return;
  }

  const form = document.getElementById('profile-form');
  const nameEl = document.getElementById('profile-name');
  const emailEl = document.getElementById('profile-email');
  const codeEl = document.getElementById('profile-country-code');
  const phoneEl = document.getElementById('profile-phone');
  const dobEl = document.getElementById('profile-dob');
  const photoInput = document.getElementById('profile-photo');
  const photoPreview = document.getElementById('profile-photo-preview');

  if (!form || !nameEl || !emailEl || !codeEl || !phoneEl || !dobEl || !photoInput || !photoPreview) return;

  const profile = getUserProfile(user);
  nameEl.value = profile.name || '';
  emailEl.value = profile.email || '';
  codeEl.value = profile.countryCode || '+234';
  phoneEl.value = profile.phone || '';
  dobEl.value = profile.dob || '';

  const defaultAvatar = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2272%22 height=%2272%22%3E%3Crect fill=%22%23f0f0f0%22 width=%2272%22 height=%2272%22 rx=%2236%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.35em%22 font-family=%22Arial%22 font-size=%2214%22 fill=%22%23999%22%3EUser%3C/text%3E%3C/svg%3E';
  photoPreview.src = profile.photo || defaultAvatar;

  photoInput.addEventListener('change', () => {
    const file = photoInput.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      photoPreview.src = reader.result;
      photoPreview.dataset.photo = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const payload = {
      name: nameEl.value.trim(),
      email: emailEl.value.trim().toLowerCase(),
      countryCode: codeEl.value,
      phone: phoneEl.value.trim(),
      dob: dobEl.value,
      photo: photoPreview.dataset.photo || profile.photo || ''
    };
    const ok = saveUserProfile(user, payload);
    if (ok) {
      showNotification?.('Profile updated', 'success');
    } else {
      showNotification?.('Failed to save profile', 'error');
    }
  });
});
