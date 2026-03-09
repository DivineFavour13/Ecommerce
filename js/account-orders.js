document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser?.();
  if (!user) {
    window.location.href = '../login.html';
    return;
  }

  const listEl = document.getElementById('orders-list');
  if (!listEl) return;

  const orders = getOrders() || [];
  const filtered = orders.filter(o => {
    const email = (o.userEmail || o.customerEmail || '').toLowerCase();
    return email && email === (user.email || '').toLowerCase();
  });

  if (filtered.length === 0) {
    listEl.innerHTML = '<div class="coming-soon">No orders yet.</div>';
    return;
  }

  listEl.innerHTML = filtered.map(o => {
    const createdAt = o.createdAt ? new Date(o.createdAt).toLocaleString() : 'Unknown date';
    const itemCount = (o.items || []).reduce((s, it) => s + (it.quantity || 1), 0);
    const total = o.total != null ? o.total : 0;
    return `
      <div class="order-card">
        <div class="order-meta">
          <div><strong>#${o.id}</strong></div>
          <div>${createdAt}</div>
          <div>Status: ${o.status || 'pending'}</div>
        </div>
        <div class="order-meta" style="margin-top: 0.5rem;">
          <div>Items: ${itemCount}</div>
          <div>Total: ${formatCurrency ? formatCurrency(total) : total}</div>
        </div>
      </div>
    `;
  }).join('');
});
