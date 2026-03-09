document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser?.();
  if (!user) {
    window.location.href = '../login.html';
    return;
  }

  const form = document.getElementById('payment-form');
  const cardsEl = document.getElementById('payment-cards');
  const cancelBtn = document.getElementById('card-cancel');

  const fields = {
    id: document.getElementById('payment-id'),
    name: document.getElementById('card-name'),
    number: document.getElementById('card-number'),
    exp: document.getElementById('card-exp'),
    cvv: document.getElementById('card-cvv'),
    def: document.getElementById('card-default')
  };

  const resetForm = () => {
    Object.values(fields).forEach(f => {
      if (!f) return;
      if (f.type === 'checkbox') f.checked = false;
      else f.value = '';
    });
  };

  const detectBrand = (num) => {
    const n = String(num).replace(/\D/g, '');
    if (/^4/.test(n)) return 'Visa';
    if (/^5[1-5]/.test(n)) return 'Mastercard';
    if (/^3[47]/.test(n)) return 'Amex';
    return 'Card';
  };

  const render = () => {
    const list = getUserPayments(user);
    if (!cardsEl) return;
    if (list.length === 0) {
      cardsEl.innerHTML = '<div class="coming-soon">No cards saved yet.</div>';
      return;
    }
    cardsEl.innerHTML = list.map(c => `
      <div class="payment-card" data-id="${c.id}">
        <div><strong>${c.brand}</strong> · **** ${c.last4}</div>
        <div>Cardholder: ${c.name}</div>
        <div>Expiry: ${c.expMonth}/${c.expYear}</div>
        <div>${c.isDefault ? '<span class="badge primary">Default</span>' : ''}</div>
        <div class="card-actions">
          <button class="btn-outline" data-action="delete">Remove</button>
          <button class="btn-outline" data-action="default">Set Default</button>
        </div>
      </div>
    `).join('');
  };

  const saveCard = () => {
    const number = fields.number.value.trim().replace(/\s+/g, '');
    const exp = fields.exp.value.trim();
    const [mm, yy] = exp.split('/');
    if (!fields.name.value.trim() || !number || !mm || !yy || !fields.cvv.value.trim()) {
      showNotification?.('Please fill all card fields', 'error');
      return;
    }
    if (number.replace(/\D/g, '').length < 12) {
      showNotification?.('Enter a valid card number', 'error');
      return;
    }

    const list = getUserPayments(user);
    const id = fields.id.value ? parseInt(fields.id.value, 10) : Date.now();
    const card = {
      id,
      name: fields.name.value.trim(),
      brand: detectBrand(number),
      last4: number.slice(-4),
      expMonth: mm,
      expYear: yy,
      isDefault: fields.def.checked
    };

    let updated = list.filter(c => c.id !== id);
    if (card.isDefault) {
      updated = updated.map(c => ({ ...c, isDefault: false }));
    }
    updated.unshift(card);
    saveUserPayments(user, updated);
    resetForm();
    render();
    showNotification?.('Card saved', 'success');
  };

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveCard();
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', resetForm);
  }

  if (cardsEl) {
    cardsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      const cardEl = e.target.closest('.payment-card');
      if (!btn || !cardEl) return;
      const id = parseInt(cardEl.dataset.id, 10);
      let list = getUserPayments(user);
      if (btn.dataset.action === 'delete') {
        if (!confirm('Remove this card?')) return;
        list = list.filter(c => c.id !== id);
        saveUserPayments(user, list);
        render();
      }
      if (btn.dataset.action === 'default') {
        list = list.map(c => ({ ...c, isDefault: c.id === id }));
        saveUserPayments(user, list);
        render();
      }
    });
  }

  render();
});
