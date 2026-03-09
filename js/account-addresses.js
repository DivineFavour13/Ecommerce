document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser?.();
  if (!user) {
    window.location.href = '../login.html';
    return;
  }

  const form = document.getElementById('address-form');
  const cardsEl = document.getElementById('address-cards');
  const cancelBtn = document.getElementById('address-cancel');

  const fields = {
    id: document.getElementById('address-id'),
    name: document.getElementById('address-name'),
    phone: document.getElementById('address-phone'),
    line1: document.getElementById('address-line1'),
    line2: document.getElementById('address-line2'),
    city: document.getElementById('address-city'),
    state: document.getElementById('address-state'),
    country: document.getElementById('address-country'),
    postal: document.getElementById('address-postal'),
    defShip: document.getElementById('address-default-shipping'),
    defBill: document.getElementById('address-default-billing')
  };

  const resetForm = () => {
    Object.values(fields).forEach(f => {
      if (!f) return;
      if (f.type === 'checkbox') f.checked = false;
      else f.value = '';
    });
  };

  const render = () => {
    const list = getUserAddresses(user);
    if (!cardsEl) return;
    if (list.length === 0) {
      cardsEl.innerHTML = '<div class="coming-soon">No addresses saved yet.</div>';
      return;
    }
    cardsEl.innerHTML = list.map(a => `
      <div class="address-card" data-id="${a.id}">
        <div>
          <strong>${a.name}</strong> · ${a.phone}
        </div>
        <div>${a.line1}${a.line2 ? `, ${a.line2}` : ''}</div>
        <div>${a.city}, ${a.state}, ${a.country} ${a.postal}</div>
        <div>
          ${a.isDefaultShipping ? '<span class="badge primary">Default Shipping</span>' : ''}
          ${a.isDefaultBilling ? '<span class="badge primary">Default Billing</span>' : ''}
        </div>
        <div class="card-actions">
          <button class="btn-outline" data-action="edit">Edit</button>
          <button class="btn-outline" data-action="delete">Delete</button>
          <button class="btn-outline" data-action="ship">Set Default Shipping</button>
          <button class="btn-outline" data-action="bill">Set Default Billing</button>
        </div>
      </div>
    `).join('');
  };

  const saveAddress = () => {
    const list = getUserAddresses(user);
    const payload = {
      id: fields.id.value ? parseInt(fields.id.value, 10) : Date.now(),
      name: fields.name.value.trim(),
      phone: fields.phone.value.trim(),
      line1: fields.line1.value.trim(),
      line2: fields.line2.value.trim(),
      city: fields.city.value.trim(),
      state: fields.state.value.trim(),
      country: fields.country.value.trim(),
      postal: fields.postal.value.trim(),
      isDefaultShipping: fields.defShip.checked,
      isDefaultBilling: fields.defBill.checked
    };

    if (!payload.name || !payload.phone || !payload.line1 || !payload.city || !payload.state || !payload.country || !payload.postal) {
      showNotification?.('Please fill all required fields', 'error');
      return;
    }

    let updated = list.filter(a => a.id !== payload.id);
    if (payload.isDefaultShipping) {
      updated = updated.map(a => ({ ...a, isDefaultShipping: false }));
    }
    if (payload.isDefaultBilling) {
      updated = updated.map(a => ({ ...a, isDefaultBilling: false }));
    }
    updated.unshift(payload);

    saveUserAddresses(user, updated);
    resetForm();
    render();
    showNotification?.('Address saved', 'success');
  };

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveAddress();
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', resetForm);
  }

  if (cardsEl) {
    cardsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      const card = e.target.closest('.address-card');
      if (!btn || !card) return;
      const id = parseInt(card.dataset.id, 10);
      let list = getUserAddresses(user);
      const address = list.find(a => a.id === id);
      if (!address) return;

      const action = btn.dataset.action;
      if (action === 'edit') {
        fields.id.value = address.id;
        fields.name.value = address.name || '';
        fields.phone.value = address.phone || '';
        fields.line1.value = address.line1 || '';
        fields.line2.value = address.line2 || '';
        fields.city.value = address.city || '';
        fields.state.value = address.state || '';
        fields.country.value = address.country || '';
        fields.postal.value = address.postal || '';
        fields.defShip.checked = !!address.isDefaultShipping;
        fields.defBill.checked = !!address.isDefaultBilling;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      if (action === 'delete') {
        if (!confirm('Delete this address?')) return;
        list = list.filter(a => a.id !== id);
        saveUserAddresses(user, list);
        render();
      }

      if (action === 'ship') {
        list = list.map(a => ({ ...a, isDefaultShipping: a.id === id }));
        saveUserAddresses(user, list);
        render();
      }

      if (action === 'bill') {
        list = list.map(a => ({ ...a, isDefaultBilling: a.id === id }));
        saveUserAddresses(user, list);
        render();
      }
    });
  }

  render();
});
