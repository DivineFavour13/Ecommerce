document.addEventListener('DOMContentLoaded', () => {
  renderWishlist();
  renderRecommendations();
  setupClearWishlist();

  window.addEventListener('wishlistUpdated', renderWishlist);
  window.addEventListener('userUpdated', () => {
    renderWishlist();
    renderRecommendations();
  });
});

function setupClearWishlist() {
  const clearBtn = document.getElementById('clear-wishlist');
  if (!clearBtn) return;

  clearBtn.addEventListener('click', () => {
    if (confirm('Clear all items from your wishlist?')) {
      saveWishlist([]);
      showNotification?.('Wishlist cleared', 'info');
      renderWishlist();
    }
  });
}

function renderWishlist() {
  const grid = document.getElementById('wishlist-grid');
  const emptyState = document.getElementById('empty-wishlist');
  const countEl = document.getElementById('wishlist-count');

  if (!grid || !emptyState || !countEl) return;

  const wishlist = getWishlist() || [];
  countEl.textContent = wishlist.length;

  if (wishlist.length === 0) {
    grid.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  grid.style.display = 'grid';

  grid.innerHTML = wishlist.map(item => {
    const product = getProductById(item.id) || item;
    const original = product.originalPrice && product.originalPrice > product.price
      ? `<span class="original-price">â‚¦${formatPrice(product.originalPrice)}</span>`
      : '';

    return `
      <div class="wishlist-card product-card" data-id="${product.id}">
        <div class="product-image">
          <img src="${product.image}" alt="${escapeHtml(product.name)}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2212%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'">
          <div class="product-actions">
            <button type="button" data-action="view" title="View Product">
              <i class="fas fa-eye"></i>
            </button>
            <button type="button" data-action="remove" title="Remove">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        <div class="product-info">
          <div class="product-category">${formatCategory(product.category)}</div>
          <h4>${escapeHtml(product.name)}</h4>
          <div class="product-price">
            <span class="current-price">â‚¦${formatPrice(product.price)}</span>
            ${original}
          </div>
          <div class="wishlist-card-actions">
            <button class="btn-primary" data-action="add-to-cart">
              <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
            <button class="btn-outline" data-action="remove">
              <i class="fas fa-heart-broken"></i> Remove
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (!grid.dataset.bound) {
    grid.addEventListener('click', handleWishlistGridClick);
    grid.dataset.bound = 'true';
  }
}

function handleWishlistGridClick(e) {
  const button = e.target.closest('button[data-action]');
  if (!button) return;

  const card = e.target.closest('.wishlist-card');
  const id = parseInt(card?.getAttribute('data-id'), 10);
  if (!id) return;

  const action = button.getAttribute('data-action');
  const product = getProductById(id) || (getWishlist() || []).find(p => p.id === id);
  if (!product) return;

  if (action === 'view') {
    window.location.href = `product.html?id=${id}`;
    return;
  }

  if (action === 'remove') {
    removeFromWishlist(id);
    showNotification?.(`${product.name} removed from wishlist`, 'info');
    renderWishlist();
    return;
  }

  if (action === 'add-to-cart') {
    addToCart(product, 1);
    showNotification?.(`${product.name} added to cart`, 'success');
    if (typeof updateCartCount === 'function') updateCartCount();
  }
}

function renderRecommendations() {
  const grid = document.getElementById('wishlist-recommended-grid');
  const section = document.getElementById('wishlist-recommendations');
  if (!grid || !section) return;

  const wishlistIds = new Set((getWishlist() || []).map(p => p.id));
  const products = (getProducts?.() || []).filter(p => !wishlistIds.has(p.id));
  const picks = products.slice(0, 6);

  if (picks.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  grid.innerHTML = picks.map(product => `
    <div class="wishlist-card product-card" data-id="${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${escapeHtml(product.name)}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2212%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'">
      </div>
      <div class="product-info">
        <div class="product-category">${formatCategory(product.category)}</div>
        <h4>${escapeHtml(product.name)}</h4>
        <div class="product-price">
          <span class="current-price">â‚¦${formatPrice(product.price)}</span>
        </div>
        <div class="wishlist-card-actions">
          <button class="btn-primary" data-action="add-to-cart" data-id="${product.id}">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
          <button class="btn-outline" data-action="view" data-id="${product.id}">
            <i class="fas fa-eye"></i> View
          </button>
        </div>
      </div>
    </div>
  `).join('');

  if (!grid.dataset.bound) {
    grid.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const id = parseInt(btn.getAttribute('data-id'), 10);
      const action = btn.getAttribute('data-action');
      const product = getProductById(id);
      if (!product) return;

      if (action === 'view') {
        window.location.href = `product.html?id=${id}`;
        return;
      }
      if (action === 'add-to-cart') {
        addToCart(product, 1);
        showNotification?.(`${product.name} added to cart`, 'success');
        if (typeof updateCartCount === 'function') updateCartCount();
      }
    });
    grid.dataset.bound = 'true';
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-NG').format(price || 0);
}

function formatCategory(category) {
  if (!category) return 'General';
  return category.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
