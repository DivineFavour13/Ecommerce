document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('admin.html')) {
    initializeAdminPanel();
  }
});

function initializeAdminPanel() {
  const adminContainer = document.querySelector('.admin-container');
  if (!adminContainer) {
    return;
  }

  const user = getCurrentUser();
  
  // FIXED: Require proper authentication - no auto-login
  if (!user) {
    showNotification('Please log in to access the admin panel.', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
    return;
  }
  
  if (user.role !== 'admin') {
    showNotification('Access denied. Admin privileges required.', 'error');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
    return;
  }

  updateCurrentDate();
  setupNavigation();
  setupLogout();
  loadDashboardData();
  setupProductManagement();
  setupUserManagement();
  setupOrderManagement();
  setupAnalytics();
  setupSettings();
  setupUserModal();
  setupOrderModal();
  ensureOrderDetailsModal();
}

function updateCurrentDate() {
  const dateElement = document.getElementById('current-date');
  if (dateElement) {
    dateElement.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}

function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.admin-section');
  
  if (navItems.length === 0) return;

  navItems.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      const targetSection = item.getAttribute('data-section');
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      sections.forEach(sec => sec.classList.remove('active'));
      const sectionEl = document.getElementById(`${targetSection}-section`);
      if (sectionEl) sectionEl.classList.add('active');
      loadSectionData(targetSection);
    });
  });

  document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', () => handleQuickAction(btn.getAttribute('data-action')));
  });
}

function loadSectionData(targetSection) {
  switch(targetSection) {
    case 'dashboard':
      loadDashboardData();
      break;
    case 'products':
      loadProductsSection();
      break;
    case 'orders':
      loadOrdersSection();
      break;
    case 'users':
      loadUsersSection();
      break;
    case 'analytics':
      loadAnalyticsSection();
      break;
    case 'settings':
      loadSettingsSection();
      break;
  }
}

function handleQuickAction(action) {
  switch(action) {
    case 'add-product':
      showAddProductModal();
      break;
    case 'view-orders':
      document.querySelector('[data-section="orders"]')?.click();
      break;
    case 'analytics':
      document.querySelector('[data-section="analytics"]')?.click();
      break;
    default:
      showNotification(`Action "${action}" not implemented yet`, 'info');
  }
}

function setupLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      handleLogout();
    });
  }
}

function handleLogout() {
  logout();
  showNotification('Logged out successfully', 'success');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1000);
}

function loadDashboardData() {
  loadDashboardStats();
  loadRecentOrders();
  loadRecentUsers();
  loadQuickStats();
}

function loadDashboardStats() {
  const products = getProducts();
  const orders = getOrders();
  const users = getUsers();
  
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  
  updateStatCard('revenue', formatCurrency(totalRevenue));
  updateStatCard('orders', orders.length);
  updateStatCard('users', users.length);
  updateStatCard('products', products.length);
}

function updateStatCard(type, value) {
  const statCards = document.querySelectorAll('.stat-card');
  
  statCards.forEach(card => {
    const statInfo = card.querySelector('.stat-info h3');
    if (!statInfo) return;
    
    const label = statInfo.textContent.toLowerCase();
    
    if ((type === 'revenue' && label.includes('revenue')) ||
        (type === 'orders' && label.includes('orders')) ||
        (type === 'users' && label.includes('users')) ||
        (type === 'products' && label.includes('products'))) {
      const statValue = card.querySelector('.stat-value');
      if (statValue) {
        statValue.textContent = value;
      }
    }
  });
}

function loadRecentOrders() {
  // Try to find the orders list used in the dashboard first,
  // fall back to nothing if not available.
  const container = document.querySelector('.orders-list') || document.querySelector('.recent-orders-list');
  if (!container) return;

  const orders = getOrders().slice(0, 5);

  if (orders.length === 0) {
    container.innerHTML = '<p>No recent orders</p>';
    return;
  }

  container.innerHTML = orders.map(order => `
    <div class="order-item">
      <div class="order-info">
        <strong>#${order.id}</strong>
        <span class="order-date">${new Date(order.createdAt).toLocaleDateString()}</span>
      </div>
      <div class="order-total">${formatCurrency(order.total)}</div>
      <div class="order-status status-${order.status}">${order.status}</div>
    </div>
  `).join('');
}

function loadRecentUsers() {
  // Dashboard may not have a dedicated recent-users container.
  // Prefer a dashboard container if present, otherwise gracefully exit.
  const containerDiv = document.querySelector('.recent-users-list');
  const usersTableBody = document.getElementById('users-table-body');

  const users = getUsers().slice(0, 5);

  if (!containerDiv && !usersTableBody) return;

  if (containerDiv) {
    if (users.length === 0) {
      containerDiv.innerHTML = '<p>No users found</p>';
      return;
    }

    containerDiv.innerHTML = users.map(user => `
      <div class="user-item">
        <div class="user-info">
          <strong>${user.name}</strong>
          <span class="user-email">${user.email}</span>
        </div>
        <div class="user-role role-${user.role}">${user.role}</div>
      </div>
    `).join('');
  }

  // If a users table body exists (users section), populate rows (useful for consistency)
  if (usersTableBody) {
    usersTableBody.innerHTML = users.map(user => `
      <tr>
        <td><strong>${user.name}</strong></td>
        <td>${user.email}</td>
        <td>
          <span class="role-badge role-${user.role}">${user.role}</span>
        </td>
        <td>${new Date(user.createdAt).toLocaleDateString()}</td>
        <td>
          <span class="status active">Active</span>
        </td>
        <td>
          <button class="btn-sm btn-primary" onclick="editUser(${user.id})">Edit</button>
          ${user.role !== 'admin' ? `<button class="btn-sm btn-danger" onclick="deleteUserConfirm(${user.id})">Delete</button>` : ''}
        </td>
      </tr>
    `).join('');
  }
}

function loadQuickStats() {
  const products = getProducts();
  const orders = getOrders();
  
  const lowStockProducts = products.filter(p => p.stock < 10);
  const lowStockElement = document.getElementById('low-stock-count');
  if (lowStockElement) {
    lowStockElement.textContent = lowStockProducts.length;
  }
  
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const pendingOrdersElement = document.getElementById('pending-orders-count');
  if (pendingOrdersElement) {
    pendingOrdersElement.textContent = pendingOrders.length;
  }
}

function loadProductsSection() {
  // Use the unified renderer so search/filters and modal-based actions work consistently
  renderProductsTable(getProducts());
}

function setupProductManagement() {
  ensureProductModal();

  // Add Product button opens modal in create mode
  const addProductBtn = document.getElementById('add-product-btn');
  if (addProductBtn) {
    addProductBtn.addEventListener('click', () => openProductModal());
  }

  // Search and filters
  const searchInput = document.getElementById('product-search');
  const categoryFilter = document.getElementById('category-filter-admin');
  const statusFilter = document.getElementById('status-filter');

  const applyFilters = () => {
    const q = (searchInput?.value || '').trim().toLowerCase();
    const cat = (categoryFilter?.value || '').toLowerCase();
    const status = (statusFilter?.value || '').toLowerCase();

    const all = getProducts();
    const filtered = all.filter(p => {
      // search by name/brand/category
      const textMatch = !q || (
        (p.name || '').toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      );
      // category
      const catMatch = !cat || (p.category || '').toLowerCase() === cat;
      // status
      const stock = typeof p.stock === 'number' ? p.stock : (p.inStock ? 1 : 0);
      const isActive = stock > 0;
      const statusMatch = !status || (
        (status === 'active' && isActive) ||
        (status === 'inactive' && !isActive) ||
        (status === 'out-of-stock' && !isActive)
      );
      return textMatch && catMatch && statusMatch;
    });

    renderProductsTable(filtered);
  };

  searchInput?.addEventListener('input', applyFilters);
  categoryFilter?.addEventListener('change', applyFilters);
  statusFilter?.addEventListener('change', applyFilters);

  // Initial population
  renderProductsTable(getProducts());
}

function renderProductsTable(list) {
  const container = document.getElementById('products-table-body');
  if (!container) return;

  if (!list || list.length === 0) {
    container.innerHTML = '<tr><td colspan="7">No products found</td></tr>';
    return;
  }

  container.innerHTML = list.map(product => `
    <tr>
      <td>
        <img src="${product.image}" alt="${product.name}" class="product-thumb" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2250%22 height=%2250%22%3E%3Crect fill=%22%23f0f0f0%22 width=%2250%22 height=%2250%22/%3E%3C/svg%3E'">
      </td>
      <td>
        <strong>${product.name}</strong>
        <br><small>${product.brand || 'N/A'}</small>
      </td>
      <td>${product.category || 'N/A'}</td>
      <td>${formatCurrency(product.price || 0)}</td>
      <td>
        <span class="stock-badge ${product.stock > 0 ? 'in-stock' : 'low-stock'}">
          ${typeof product.stock === 'number' ? product.stock : (product.inStock ? 'In' : '0')}
        </span>
      </td>
      <td>
        <span class="status ${product.stock > 0 ? 'active' : 'out-of-stock'}">
          ${product.stock > 0 ? 'Active' : 'Out of Stock'}
        </span>
      </td>
      <td>
        <button class="btn-sm btn-primary" data-action="edit" data-id="${product.id}">Edit</button>
        <button class="btn-sm btn-danger" data-action="delete" data-id="${product.id}">Delete</button>
      </td>
    </tr>
  `).join('');

  // Wire row buttons via delegation
  container.querySelectorAll('button[data-action]')?.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(btn.getAttribute('data-id'));
      const action = btn.getAttribute('data-action');
      if (action === 'edit') openProductModal(id);
      if (action === 'delete') deleteProductConfirm(id);
    });
  });
}

function ensureProductModal() {
  if (document.getElementById('product-crud-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'product-crud-modal';
  modal.className = 'payment-modal';
  modal.style.display = 'none';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 700px; width: 95%; border-radius: 12px;">
      <div class="modal-header">
        <h3 id="product-modal-title" style="margin:0; display:flex; align-items:center; gap:8px;"><i class="fas fa-box"></i> Product</h3>
        <button type="button" id="product-modal-close" class="modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="modal-body" style="padding:1rem 1.5rem;">
        <form id="product-form" class="form-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div class="form-group" style="grid-column: span 2;">
            <label>Name</label>
            <input type="text" id="pf-name" required>
          </div>
          <div class="form-group">
            <label>Brand</label>
            <input type="text" id="pf-brand">
          </div>
          <div class="form-group">
            <label>Category</label>
            <select id="pf-category" required>
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home & Living</option>
              <option value="beauty">Beauty</option>
              <option value="phones">Phones</option>
              <option value="computing">Computing</option>
              <option value="gaming">Gaming</option>
            </select>
          </div>
          <div class="form-group">
            <label>Price (₦)</label>
            <input type="number" id="pf-price" min="0" required>
          </div>
          <div class="form-group">
            <label>Old Price (₦)</label>
            <input type="number" id="pf-old-price" min="0">
          </div>
          <div class="form-group">
            <label>Stock</label>
            <input type="number" id="pf-stock" min="0" required>
          </div>
          <div class="form-group" style="grid-column: span 2;">
            <label>Image URL</label>
            <input type="url" id="pf-image" required>
          </div>
          <div class="form-group" style="grid-column: span 2;">
            <label>Description</label>
            <textarea id="pf-description" rows="3"></textarea>
          </div>
          <input type="hidden" id="pf-id">
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" id="product-cancel" class="btn-cancel">Cancel</button>
        <button type="button" id="product-save" class="btn-confirm">Save</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const hide = () => { modal.style.display = 'none'; modal.classList.remove('show'); };
  modal.addEventListener('click', (e) => { if (e.target === modal) hide(); });
  modal.querySelector('#product-modal-close')?.addEventListener('click', hide);
  modal.querySelector('#product-cancel')?.addEventListener('click', hide);

  // Save handler
  modal.querySelector('#product-save')?.addEventListener('click', () => {
    const idVal = document.getElementById('pf-id').value;
    const name = document.getElementById('pf-name').value.trim();
    const brand = document.getElementById('pf-brand').value.trim();
    const category = document.getElementById('pf-category').value;
    const price = parseFloat(document.getElementById('pf-price').value);
    const oldPriceVal = document.getElementById('pf-old-price').value;
    const originalPrice = oldPriceVal ? parseFloat(oldPriceVal) : undefined;
    const stock = parseInt(document.getElementById('pf-stock').value);
    const image = document.getElementById('pf-image').value.trim();
    const description = document.getElementById('pf-description').value.trim();

    if (!name || !category || !isFinite(price) || !isFinite(stock) || !image) {
      showNotification('Please fill all required fields correctly.', 'error');
      return;
    }

    const all = getProducts();

    if (idVal) {
      // Update
      const id = parseInt(idVal);
      const idx = all.findIndex(p => p.id === id);
      if (idx === -1) { showNotification('Product not found', 'error'); return; }
      all[idx] = {
        ...all[idx],
        name, brand, category,
        price, originalPrice,
        stock, inStock: stock > 0,
        image, description
      };
      if (saveProducts(all)) {
        showNotification('Product updated', 'success');
        hide();
        renderProductsTable(getProducts());
      } else {
        showNotification('Failed to update product', 'error');
      }
    } else {
      // Create
      const newProduct = {
        id: Date.now(),
        name, brand, category,
        price, originalPrice,
        stock, inStock: stock > 0,
        image,
        images: [image],
        description,
        rating: 0,
        reviews: 0
      };
      const updated = [...all, newProduct];
      if (saveProducts(updated)) {
        showNotification('Product added', 'success');
        hide();
        renderProductsTable(getProducts());
      } else {
        showNotification('Failed to add product', 'error');
      }
    }
  });
}

function openProductModal(productId) {
  ensureProductModal();
  const modal = document.getElementById('product-crud-modal');
  const title = document.getElementById('product-modal-title');

  // Clear form
  document.getElementById('pf-id').value = '';
  document.getElementById('pf-name').value = '';
  document.getElementById('pf-brand').value = '';
  document.getElementById('pf-category').value = '';
  document.getElementById('pf-price').value = '';
  document.getElementById('pf-old-price').value = '';
  document.getElementById('pf-stock').value = '';
  document.getElementById('pf-image').value = '';
  document.getElementById('pf-description').value = '';

  if (productId) {
    // Edit mode
    const p = getProductById(productId);
    if (!p) { showNotification('Product not found', 'error'); return; }
    title.innerHTML = '<i class="fas fa-pen"></i> Edit Product';
    document.getElementById('pf-id').value = p.id;
    document.getElementById('pf-name').value = p.name || '';
    document.getElementById('pf-brand').value = p.brand || '';
    document.getElementById('pf-category').value = p.category || '';
    document.getElementById('pf-price').value = p.price || '';
    document.getElementById('pf-old-price').value = p.originalPrice || '';
    document.getElementById('pf-stock').value = (typeof p.stock === 'number' ? p.stock : (p.inStock ? 1 : 0));
    document.getElementById('pf-image').value = p.image || '';
    document.getElementById('pf-description').value = p.description || '';
  } else {
    // Create mode
    title.innerHTML = '<i class="fas fa-plus"></i> Add Product';
  }

  modal.style.display = 'flex';
  modal.classList.add('show');
}

function showAddProductModal() {
  openProductModal();
}

function editProduct(productId) {
  openProductModal(productId);
}

function deleteProductConfirm(productId) {
  const product = getProductById(productId);
  if (product && confirm(`Are you sure you want to delete "${product.name}"?`)) {
    const success = deleteProduct(productId);
    if (success) {
      showNotification('Product deleted successfully', 'success');
      renderProductsTable(getProducts());
      loadDashboardStats();
    } else {
      showNotification('Failed to delete product', 'error');
    }
  }
}

function loadOrdersSection() {
  const orders = getOrders();
  const container = document.getElementById('orders-table-body');
  
  if (!container) return;
  
  if (orders.length === 0) {
    container.innerHTML = '<tr><td colspan="6">No orders found</td></tr>';
    return;
  }
  
  container.innerHTML = orders.map(order => `
    <tr>
      <td><strong>#${order.id}</strong></td>
      <td>${order.userName || 'Guest'}</td>
      <td>${new Date(order.createdAt).toLocaleDateString()}</td>
      <td>${formatCurrency(order.total)}</td>
      <td>
        <select class="status-select" onchange="updateOrderStatusHandler('${order.id}', this.value)">
          <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
          <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
          <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
          <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td>
        <button class="btn-sm btn-primary" onclick="viewOrderDetails('${order.id}')">View</button>
      </td>
    </tr>
  `).join('');
}

function setupOrderManagement() {
  // Order management setup
}

function updateOrderStatusHandler(orderId, newStatus) {
  const success = updateOrderStatus(orderId, newStatus);
  if (success) {
    showNotification(`Order ${orderId} status updated to ${newStatus}`, 'success');
    loadDashboardStats();
  } else {
    showNotification('Failed to update order status', 'error');
  }
}

function viewOrderDetails(orderId) {
  const orders = getOrders();
  const products = getProducts();
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    showNotification('Order not found', 'error');
    return;
  }

  const productById = new Map(products.map(p => [parseInt(p.id), p]));
  const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();
  const items = Array.isArray(order.items) ? order.items : [];

  // Compute items with resolved names/prices
  const resolvedItems = items.map(it => {
    const pid = parseInt(it.id);
    const p = productById.get(pid);
    const price = it.price != null ? it.price : (p?.price || 0);
    const name = it.name || p?.name || `#${pid}`;
    const quantity = it.quantity || 1;
    const lineTotal = price * quantity;
    return { id: pid, name, price, quantity, lineTotal };
  });

  const computedSubtotal = resolvedItems.reduce((s, x) => s + x.lineTotal, 0);
  const total = order.total != null ? order.total : computedSubtotal;

  // Fill modal
  const modal = document.getElementById('order-details-modal');
  const titleEl = document.getElementById('order-modal-title');
  const bodyEl = document.getElementById('order-modal-body');
  if (!modal || !titleEl || !bodyEl) return;

  const statusBadge = `<span class="status ${order.status || 'pending'}" style="margin-left:8px; text-transform:capitalize;">${order.status || 'pending'}</span>`;
  titleEl.innerHTML = `<i class="fas fa-receipt"></i> Order ${order.id} ${statusBadge}`;

  const customerName = order.userName || order.customerName || 'Guest';
  const customerEmail = order.userEmail || order.customerEmail || '';

  bodyEl.innerHTML = `
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-bottom:16px; padding:12px; border:1px solid var(--border-color); border-radius:8px;">
      <div>
        <div style="font-size:12px;color:var(--text-secondary);">Order ID</div>
        <div style="font-weight:600;color:var(--text-primary);">#${order.id}</div>
      </div>
      <div>
        <div style="font-size:12px;color:var(--text-secondary);">Date</div>
        <div style="font-weight:600;color:var(--text-primary);">${createdAt.toLocaleString()}</div>
      </div>
      <div>
        <div style="font-size:12px;color:var(--text-secondary);">Customer</div>
        <div style="font-weight:600;color:var(--text-primary);">${customerName}</div>
      </div>
      <div>
        <div style="font-size:12px;color:var(--text-secondary);">Email</div>
        <div style="font-weight:600;color:var(--text-primary);">${customerEmail || '-'}</div>
      </div>
    </div>

    <div style="overflow:auto; max-height:360px; border:1px solid var(--border-color); border-radius:8px;">
      <table style="width:100%; border-collapse:collapse; font-size:14px; color:var(--text-primary);">
        <thead>
          <tr style="background: rgba(0,0,0,0.06);">
            <th style="text-align:left; padding:10px 12px;">Product</th>
            <th style="text-align:right; padding:10px 12px;">Price</th>
            <th style="text-align:right; padding:10px 12px;">Qty</th>
            <th style="text-align:right; padding:10px 12px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${resolvedItems.map(it => `
            <tr>
              <td style="padding:10px 12px; border-top:1px solid var(--border-color);">${it.name}</td>
              <td style="padding:10px 12px; border-top:1px solid var(--border-color); text-align:right;">${formatCurrency(it.price)}</td>
              <td style="padding:10px 12px; border-top:1px solid var(--border-color); text-align:right;">${it.quantity}</td>
              <td style="padding:10px 12px; border-top:1px solid var(--border-color); text-align:right;">${formatCurrency(it.lineTotal)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div style="display:flex; justify-content:flex-end; margin-top:16px;">
      <div style="min-width:260px; background:var(--bg-primary); border:1px solid var(--border-color); border-radius:8px; padding:12px 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <div style="display:flex; justify-content:space-between; gap:12px; padding:4px 0;">
          <span style="color:var(--text-secondary);">Subtotal</span>
          <strong style="color:var(--text-primary);">${formatCurrency(computedSubtotal)}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; gap:12px; padding:8px 0; border-top:1px dashed var(--border-color); margin-top:8px;">
          <span style="color:var(--text-primary);">Total</span>
          <strong style="color:var(--text-primary);">${formatCurrency(total)}</strong>
        </div>
      </div>
    </div>
  `;

  // Show modal
  modal.classList.add('show');
  modal.style.display = 'flex';
}

function loadUsersSection() {
  const users = getUsers();
  const container = document.getElementById('users-table-body');
  
  if (!container) return;
  
  if (users.length === 0) {
    container.innerHTML = '<tr><td colspan="6">No users found</td></tr>';
    return;
  }
  
  container.innerHTML = users.map(user => `
    <tr>
      <td><strong>${user.name}</strong></td>
      <td>${user.email}</td>
      <td>
        <span class="role-badge role-${user.role}">${user.role}</span>
      </td>
      <td>${new Date(user.createdAt).toLocaleDateString()}</td>
      <td>
        <span class="status active">Active</span>
      </td>
      <td>
        <button class="btn-sm btn-primary" onclick="editUser(${user.id})">Edit</button>
        ${user.role !== 'admin' ? `<button class="btn-sm btn-danger" onclick="deleteUserConfirm(${user.id})">Delete</button>` : ''}
      </td>
    </tr>
  `).join('');
}

function setupUserManagement() {
  // User management setup
}

function editUser(userId) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (user) {
    showNotification(`Edit user: ${user.name} - coming soon!`, 'info');
  }
}

function deleteUserConfirm(userId) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (user && confirm(`Are you sure you want to delete user "${user.name}"?`)) {
    const filteredUsers = users.filter(u => u.id !== userId);
    const success = saveUsers(filteredUsers);
    if (success) {
      showNotification('User deleted successfully', 'success');
      loadUsersSection();
      loadDashboardStats();
    } else {
      showNotification('Failed to delete user', 'error');
    }
  }
}

function loadAnalyticsSection() {
  const section = document.getElementById('analytics-section');
  if (!section) return;
  const grid = section.querySelector('.analytics-grid');
  if (!grid) return;

  const periodSelect = document.getElementById('analytics-period');
  const days = parseInt(periodSelect?.value || '7', 10);

  const orders = getOrders();
  const products = getProducts();
  const users = getUsers();

  // Helpers
  const startOfDay = (d) => { const x = new Date(d); x.setHours(0,0,0,0); return x; };
  const dateKey = (d) => startOfDay(d).toISOString().slice(0,10);
  const now = new Date();
  const daysBack = Array.from({ length: days }).map((_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (days - 1 - i));
    return startOfDay(d);
  });

  // Revenue trend per day
  const revenueByDay = new Map(daysBack.map(d => [dateKey(d), 0]));
  orders.forEach(o => {
    const k = dateKey(o.createdAt || now);
    if (revenueByDay.has(k)) {
      revenueByDay.set(k, (revenueByDay.get(k) || 0) + (o.total || 0));
    }
  });
  const revenueSeries = daysBack.map(d => ({ date: d, value: revenueByDay.get(dateKey(d)) || 0 }));
  const totalRevenuePeriod = revenueSeries.reduce((s, p) => s + p.value, 0);

  // Orders count
  const ordersByDay = new Map(daysBack.map(d => [dateKey(d), 0]));
  orders.forEach(o => {
    const k = dateKey(o.createdAt || now);
    if (ordersByDay.has(k)) {
      ordersByDay.set(k, (ordersByDay.get(k) || 0) + 1);
    }
  });
  const ordersSeries = daysBack.map(d => ({ date: d, value: ordersByDay.get(dateKey(d)) || 0 }));

  // Average order value
  const totalOrdersPeriod = ordersSeries.reduce((s, p) => s + p.value, 0);
  const avgOrderValue = totalOrdersPeriod > 0 ? totalRevenuePeriod / totalOrdersPeriod : 0;

  // User growth per day (use createdAt or joinedDate fallback)
  const userJoinedAt = (u) => new Date(u.createdAt || u.joinedDate || u.created_at || now);
  const usersByDay = new Map(daysBack.map(d => [dateKey(d), 0]));
  users.forEach(u => {
    const k = dateKey(userJoinedAt(u));
    if (usersByDay.has(k)) {
      usersByDay.set(k, (usersByDay.get(k) || 0) + 1);
    }
  });
  const userSeries = daysBack.map(d => ({ date: d, value: usersByDay.get(dateKey(d)) || 0 }));

  // Top categories by quantity in orders
  const productById = new Map(products.map(p => [p.id, p]));
  const categoryCounts = {};
  orders.forEach(o => {
    (o.items || []).forEach(it => {
      const prod = productById.get(parseInt(it.id));
      const cat = prod?.category || 'Unknown';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + (it.quantity || 0);
    });
  });
  const topCategories = Object.entries(categoryCounts)
    .sort((a,b) => b[1]-a[1])
    .slice(0,5);

  // Simple bar chart generator
  const renderBars = (series, valueFormatter = v => v) => {
    const max = Math.max(1, ...series.map(s => s.value));
    return `
      <div style="display:flex; align-items:flex-end; gap:8px; height:160px; padding:8px 0;">
        ${series.map(s => {
          const h = Math.round((s.value / max) * 140) + 10; // min height
          const label = s.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          return `
            <div style="display:flex; flex-direction:column; align-items:center; width:28px;">
              <div title="${label}: ${valueFormatter(s.value)}" style="width:100%; height:${h}px; background: var(--primary-color, #ff6a00); border-radius: 4px;"></div>
              <div style="margin-top:6px; font-size:10px; color:#888;">${label.replace(/\s/g,'\u00A0')}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  };

  // Build UI
  grid.innerHTML = `
    <div class="analytics-card">
      <h3>Sales Overview</h3>
      <div style="display:flex; gap:16px; flex-wrap:wrap;">
        <div><div style="font-size:12px; color:#888;">Revenue (${days}d)</div><div style="font-size:20px; font-weight:700;">${formatCurrency(totalRevenuePeriod)}</div></div>
        <div><div style="font-size:12px; color:#888;">Orders (${days}d)</div><div style="font-size:20px; font-weight:700;">${totalOrdersPeriod}</div></div>
        <div><div style="font-size:12px; color:#888;">Avg. Order Value</div><div style="font-size:20px; font-weight:700;">${formatCurrency(avgOrderValue)}</div></div>
      </div>
      <div style="margin-top:12px;">
        ${renderBars(revenueSeries, v => formatCurrency(v))}
      </div>
    </div>

    <div class="analytics-card">
      <h3>Top Categories</h3>
      ${topCategories.length === 0 ? '<p>No sales data for selected period.</p>' : `
        <div>
          ${topCategories.map(([cat, qty]) => `
            <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px dashed #3333;">
              <span>${cat}</span>
              <span>${qty} sold</span>
            </div>
          `).join('')}
        </div>
      `}
    </div>

    <div class="analytics-card">
      <h3>User Growth</h3>
      ${renderBars(userSeries, v => `${v} users`)}
    </div>

    <div class="analytics-card">
      <h3>Revenue Trends</h3>
      ${renderBars(revenueSeries, v => formatCurrency(v))}
    </div>
  `;
}

function getTopSellingProducts(orders, products) {
  const productSales = {};
  
  orders.forEach(order => {
    if (order.items) {
      order.items.forEach(item => {
        productSales[item.id] = (productSales[item.id] || 0) + item.quantity;
      });
    }
  });
  
  return Object.entries(productSales)
    .map(([productId, sales]) => {
      const product = products.find(p => p.id === parseInt(productId));
      return {
        name: product ? product.name : 'Unknown Product',
        sales: sales
      };
    })
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);
}

function setupAnalytics() {
  // Analytics setup
}

function loadSettingsSection() {
  const settings = getSettings();
  const container = document.getElementById('settings-container');
  
  if (!container) return;
  
  container.innerHTML = `
    <div class="settings-form">
      <h3>Site Settings</h3>
      <div class="form-group">
        <label>Site Name</label>
        <input type="text" id="site-name" value="${settings.siteName}" class="form-control">
      </div>
      <div class="form-group">
        <label>Site Description</label>
        <textarea id="site-description" class="form-control">${settings.siteDescription}</textarea>
      </div>
      <div class="form-group">
        <label>Contact Email</label>
        <input type="email" id="contact-email" value="${settings.contactEmail}" class="form-control">
      </div>
      <div class="form-group">
        <label>Currency</label>
        <select id="currency" class="form-control">
          <option value="NGN" ${settings.currency === 'NGN' ? 'selected' : ''}>Nigerian Naira (NGN)</option>
          <option value="USD" ${settings.currency === 'USD' ? 'selected' : ''}>US Dollar (USD)</option>
          <option value="EUR" ${settings.currency === 'EUR' ? 'selected' : ''}>Euro (EUR)</option>
        </select>
      </div>
      <div class="form-group">
        <label>
          <input type="checkbox" id="email-notifications" ${settings.emailNotifications ? 'checked' : ''}>
          Enable Email Notifications
        </label>
      </div>
      <button class="btn-primary" onclick="saveSettingsData()">Save Settings</button>
    </div>
  `;
}

function setupSettings() {
  // Settings setup
}

function saveSettingsData() {
  const newSettings = {
    siteName: document.getElementById('site-name')?.value || 'LUXORA',
    siteDescription: document.getElementById('site-description')?.value || '',
    contactEmail: document.getElementById('contact-email')?.value || '',
    currency: document.getElementById('currency')?.value || 'NGN',
    emailNotifications: document.getElementById('email-notifications')?.checked || false
  };
  
  const success = saveSettings(newSettings);
  if (success) {
    showNotification('Settings saved successfully', 'success');
  } else {
    showNotification('Failed to save settings', 'error');
  }
}

function setupUserModal() {
  // User modal setup
}

function setupOrderModal() {
  // Order modal setup
}

function ensureOrderDetailsModal() {
  if (document.getElementById('order-details-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'order-details-modal';
  modal.className = 'payment-modal order-details-modal';
  modal.style.display = 'none';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 820px; width: 95%; border-radius: 12px;">
      <div class="modal-header">
        <h3 id="order-modal-title" style="margin:0; display:flex; align-items:center; gap:8px;"><i class="fas fa-receipt"></i> Order Details</h3>
        <button type="button" id="order-modal-close" class="modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="modal-body" id="order-modal-body" style="padding:1rem 1.5rem;"></div>
      <div class="modal-footer">
        <button type="button" id="order-modal-close2" class="btn-cancel">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const hide = () => {
    modal.classList.remove('show');
    modal.style.display = 'none';
  };
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hide();
  });
  modal.querySelector('#order-modal-close')?.addEventListener('click', hide);
  modal.querySelector('#order-modal-close2')?.addEventListener('click', hide);
}

// Format currency helper
function formatCurrency(amount) {
  return '₦' + amount.toLocaleString();
}

// Make functions global for onclick handlers
window.editProduct = editProduct;
window.deleteProductConfirm = deleteProductConfirm;
window.updateOrderStatusHandler = updateOrderStatusHandler;
window.viewOrderDetails = viewOrderDetails;
window.editUser = editUser;
window.deleteUserConfirm = deleteUserConfirm;
window.saveSettingsData = saveSettingsData;