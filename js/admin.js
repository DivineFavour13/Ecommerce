// admin.js - Complete admin dashboard functionality

document.addEventListener('DOMContentLoaded', () => {
  // Only initialize admin panel if we're actually on the admin page
  if (window.location.pathname.includes('admin.html')) {
    initializeAdminPanel();
  }
});

function initializeAdminPanel() {
  // Check if we're actually on admin page first
  const adminContainer = document.querySelector('.admin-container');
  if (!adminContainer) {
    console.log('Not on admin page, skipping admin initialization');
    return;
  }

  const user = getCurrentUser();
  
  // More lenient check - allow if no user (for testing) or if user is admin
  if (user && user.role !== 'admin') {
    showNotification('Access denied. Admin privileges required.', 'error');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
    return;
  }

  // If no user is logged in, show a different message but don't redirect immediately
  if (!user) {
    showNotification('Please log in as admin to access this page.', 'warning');
    // Auto-login for testing purposes
    autoLoginAdmin();
  }

  console.log('Initializing admin panel...');
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
}

// Auto-login function for testing
function autoLoginAdmin() {
  const users = getUsers();
  const adminUser = users.find(u => u.role === 'admin');
  
  if (adminUser) {
    setCurrentUser({
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role
    });
    console.log('Auto-logged in as admin for testing');
    showNotification('Auto-logged in as admin', 'info');
  }
}

// --- DATE ---
function updateCurrentDate() {
  const dateElement = document.getElementById('current-date');
  if (dateElement) {
    dateElement.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}

// --- NAVIGATION ---
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.admin-section');
  
  if (navItems.length === 0) {
    console.log('No nav items found');
    return;
  }

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
  console.log(`Loading data for section: ${targetSection}`);
  
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
    default:
      console.log(`No handler for section: ${targetSection}`);
  }
}

function handleQuickAction(action) {
  console.log(`Quick action: ${action}`);
  
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

// --- LOGOUT ---
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

// --- DASHBOARD ---
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
  
  // Calculate revenue
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
  const container = document.querySelector('.recent-orders-list');
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
  const container = document.querySelector('.recent-users-list');
  if (!container) return;
  
  const users = getUsers().slice(0, 5);
  
  if (users.length === 0) {
    container.innerHTML = '<p>No users found</p>';
    return;
  }
  
  container.innerHTML = users.map(user => `
    <div class="user-item">
      <div class="user-info">
        <strong>${user.name}</strong>
        <span class="user-email">${user.email}</span>
      </div>
      <div class="user-role role-${user.role}">${user.role}</div>
    </div>
  `).join('');
}

function loadQuickStats() {
  const products = getProducts();
  const orders = getOrders();
  
  // Low stock products
  const lowStockProducts = products.filter(p => p.stock < 10);
  const lowStockElement = document.getElementById('low-stock-count');
  if (lowStockElement) {
    lowStockElement.textContent = lowStockProducts.length;
  }
  
  // Pending orders
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const pendingOrdersElement = document.getElementById('pending-orders-count');
  if (pendingOrdersElement) {
    pendingOrdersElement.textContent = pendingOrders.length;
  }
}

// --- PRODUCTS SECTION ---
function loadProductsSection() {
  const products = getProducts();
  const container = document.getElementById('products-table-body');
  
  if (!container) return;
  
  if (products.length === 0) {
    container.innerHTML = '<tr><td colspan="6">No products found</td></tr>';
    return;
  }
  
  container.innerHTML = products.map(product => `
    <tr>
      <td>
        <img src="${product.image}" alt="${product.name}" class="product-thumb">
      </td>
      <td>
        <strong>${product.name}</strong>
        <br><small>${product.brand}</small>
      </td>
      <td>${product.category}</td>
      <td>${formatCurrency(product.price)}</td>
      <td>
        <span class="stock-badge ${product.stock < 10 ? 'low-stock' : 'in-stock'}">
          ${product.stock}
        </span>
      </td>
      <td>
        <button class="btn-sm btn-primary" onclick="editProduct(${product.id})">Edit</button>
        <button class="btn-sm btn-danger" onclick="deleteProductConfirm(${product.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

function setupProductManagement() {
  // Add product button
  const addProductBtn = document.getElementById('add-product-btn');
  if (addProductBtn) {
    addProductBtn.addEventListener('click', showAddProductModal);
  }
}

function showAddProductModal() {
  showNotification('Add product modal - coming soon!', 'info');
}

function editProduct(productId) {
  const product = getProductById(productId);
  if (product) {
    showNotification(`Edit product: ${product.name} - coming soon!`, 'info');
  }
}

function deleteProductConfirm(productId) {
  const product = getProductById(productId);
  if (product && confirm(`Are you sure you want to delete "${product.name}"?`)) {
    const success = deleteProduct(productId);
    if (success) {
      showNotification('Product deleted successfully', 'success');
      loadProductsSection();
      loadDashboardStats();
    } else {
      showNotification('Failed to delete product', 'error');
    }
  }
}

// --- ORDERS SECTION ---
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
      <td>${new Date(order.createdAt).toLocaleDateString()}</td>
      <td>${order.items ? order.items.length : 0} items</td>
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
  console.log('Order management setup complete');
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
  const order = orders.find(o => o.id === orderId);
  if (order) {
    showNotification(`View order details for ${orderId} - coming soon!`, 'info');
  }
}

// --- USERS SECTION ---
function loadUsersSection() {
  const users = getUsers();
  const container = document.getElementById('users-table-body');
  
  if (!container) return;
  
  if (users.length === 0) {
    container.innerHTML = '<tr><td colspan="5">No users found</td></tr>';
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
        <button class="btn-sm btn-primary" onclick="editUser(${user.id})">Edit</button>
        ${user.role !== 'admin' ? `<button class="btn-sm btn-danger" onclick="deleteUserConfirm(${user.id})">Delete</button>` : ''}
      </td>
    </tr>
  `).join('');
}

function setupUserManagement() {
  // User management setup
  console.log('User management setup complete');
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

// --- ANALYTICS SECTION ---
function loadAnalyticsSection() {
  const container = document.getElementById('analytics-container');
  if (!container) return;
  
  const orders = getOrders();
  const products = getProducts();
  const users = getUsers();
  
  // Calculate analytics
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const topSellingProducts = getTopSellingProducts(orders, products);
  
  container.innerHTML = `
    <div class="analytics-grid">
      <div class="analytics-card">
        <h3>Total Revenue</h3>
        <div class="analytics-value">${formatCurrency(totalRevenue)}</div>
      </div>
      <div class="analytics-card">
        <h3>Average Order Value</h3>
        <div class="analytics-value">${formatCurrency(avgOrderValue)}</div>
      </div>
      <div class="analytics-card">
        <h3>Total Orders</h3>
        <div class="analytics-value">${orders.length}</div>
      </div>
      <div class="analytics-card">
        <h3>Total Users</h3>
        <div class="analytics-value">${users.length}</div>
      </div>
    </div>
    <div class="top-products">
      <h3>Top Selling Products</h3>
      <div class="top-products-list">
        ${topSellingProducts.map(item => `
          <div class="top-product-item">
            <span>${item.name}</span>
            <span>${item.sales} sales</span>
          </div>
        `).join('')}
      </div>
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
  console.log('Analytics setup complete');
}

// --- SETTINGS SECTION ---
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
      <button class="btn-primary" onclick="saveSettings()">Save Settings</button>
    </div>
  `;
}

function setupSettings() {
  console.log('Settings setup complete');
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

// --- MODAL SETUP ---
function setupUserModal() {
  console.log('User modal setup complete');
}

function setupOrderModal() {
  console.log('Order modal setup complete');
}

// Make functions global for onclick handlers
window.editProduct = editProduct;
window.deleteProductConfirm = deleteProductConfirm;
window.updateOrderStatusHandler = updateOrderStatusHandler;
window.viewOrderDetails = viewOrderDetails;
window.editUser = editUser;
window.deleteUserConfirm = deleteUserConfirm;
window.saveSettingsData = saveSettingsData;