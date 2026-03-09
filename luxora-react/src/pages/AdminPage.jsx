import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentUser,
  getProducts,
  saveProducts,
  getUsers,
  getOrders,
  updateOrderStatus,
  getSettings,
  saveSettings
} from '../utils/storage.js';
import { formatCurrency } from '../utils/format.js';
import { showNotification } from '../utils/notifications.js';

function getProductStatus(product) {
  const stock = Number(product.stock || 0);
  if (stock <= 0) return 'out-of-stock';
  if (product.inStock === false) return 'inactive';
  return 'active';
}

function formatDate(dateValue) {
  if (!dateValue) return '-';
  try {
    return new Date(dateValue).toLocaleDateString();
  } catch {
    return '-';
  }
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [section, setSection] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState(() => getSettings());
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    category: '',
    price: '',
    oldPrice: '',
    stock: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'admin') {
      showNotification('Access denied. Admin privileges required.', 'error');
      navigate('/');
      return;
    }
    setProducts(getProducts());
    setUsers(getUsers());
    setOrders(getOrders());
    setSettings(getSettings());
  }, [navigate]);

  const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + Number(order.total || 0), 0), [orders]);
  const pendingOrders = useMemo(() => orders.filter((order) => (order.status || 'pending') === 'pending').length, [orders]);
  const processingOrders = useMemo(() => orders.filter((order) => order.status === 'processing').length, [orders]);
  const deliveredOrders = useMemo(() => orders.filter((order) => order.status === 'delivered').length, [orders]);
  const categories = useMemo(
    () => [...new Set(products.map((product) => String(product.category || '').trim()).filter(Boolean))],
    [products]
  );
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const bySearch =
          !productSearch.trim() ||
          String(product.name || '').toLowerCase().includes(productSearch.toLowerCase()) ||
          String(product.category || '').toLowerCase().includes(productSearch.toLowerCase());
        const byCategory = !categoryFilter || String(product.category || '').toLowerCase() === categoryFilter.toLowerCase();
        const byStatus = !statusFilter || getProductStatus(product) === statusFilter;
        return bySearch && byCategory && byStatus;
      }),
    [products, productSearch, categoryFilter, statusFilter]
  );

  const recentOrders = useMemo(() => [...orders].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 3), [orders]);

  const resetProductForm = () => {
    setProductForm({
      id: '',
      name: '',
      category: '',
      price: '',
      oldPrice: '',
      stock: '',
      description: '',
      image: ''
    });
    setShowProductForm(false);
  };

  const startCreateProduct = () => {
    resetProductForm();
    setShowProductForm(true);
  };

  const startEditProduct = (product) => {
    setProductForm({
      id: product.id,
      name: product.name || '',
      category: product.category || '',
      price: product.price || '',
      oldPrice: product.originalPrice || '',
      stock: Number(product.stock || 0),
      description: product.description || '',
      image: product.image || ''
    });
    setShowProductForm(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.category || !productForm.price || productForm.stock === '' || !productForm.description || !productForm.image) {
      showNotification('Please fill all required product fields', 'error');
      return;
    }
    const id = productForm.id ? Number(productForm.id) : Date.now();
    const nextStock = Number(productForm.stock || 0);
    const updatedProduct = {
      ...products.find((product) => product.id === id),
      id,
      name: productForm.name.trim(),
      category: productForm.category.trim().toLowerCase(),
      price: Number(productForm.price),
      originalPrice: productForm.oldPrice ? Number(productForm.oldPrice) : undefined,
      stock: nextStock,
      inStock: nextStock > 0,
      description: productForm.description.trim(),
      image: productForm.image.trim()
    };
    const nextProducts = [updatedProduct, ...products.filter((product) => product.id !== id)];
    if (!saveProducts(nextProducts)) {
      showNotification('Failed to save product', 'error');
      return;
    }
    setProducts(nextProducts);
    resetProductForm();
    showNotification(productForm.id ? 'Product updated successfully' : 'Product added successfully', 'success');
  };

  const handleDeleteProduct = (productId) => {
    if (!window.confirm('Delete this product?')) return;
    const nextProducts = products.filter((product) => product.id !== productId);
    if (!saveProducts(nextProducts)) {
      showNotification('Failed to delete product', 'error');
      return;
    }
    setProducts(nextProducts);
    showNotification('Product deleted', 'success');
  };

  const handleOrderStatusChange = (orderId, status) => {
    if (!updateOrderStatus(orderId, status)) {
      showNotification('Failed to update order status', 'error');
      return;
    }
    setOrders(getOrders());
    showNotification('Order status updated', 'success');
  };

  const handleSaveSiteSettings = (e) => {
    e.preventDefault();
    if (!saveSettings(settings)) {
      showNotification('Failed to save settings', 'error');
      return;
    }
    showNotification('Settings saved', 'success');
  };

  return (
    <main>
      <div className="admin-container">
        <aside className="admin-sidebar">
          <nav className="admin-nav">
            <button className={`nav-item ${section === 'dashboard' ? 'active' : ''}`} onClick={() => setSection('dashboard')}>
              <i className="fas fa-tachometer-alt"></i> Dashboard
            </button>
            <button className={`nav-item ${section === 'products' ? 'active' : ''}`} onClick={() => setSection('products')}>
              <i className="fas fa-box"></i> Products
            </button>
            <button className={`nav-item ${section === 'orders' ? 'active' : ''}`} onClick={() => setSection('orders')}>
              <i className="fas fa-shopping-cart"></i> Orders
            </button>
            <button className={`nav-item ${section === 'users' ? 'active' : ''}`} onClick={() => setSection('users')}>
              <i className="fas fa-users"></i> Users
            </button>
            <button className={`nav-item ${section === 'analytics' ? 'active' : ''}`} onClick={() => setSection('analytics')}>
              <i className="fas fa-chart-bar"></i> Analytics
            </button>
            <button className={`nav-item ${section === 'settings' ? 'active' : ''}`} onClick={() => setSection('settings')}>
              <i className="fas fa-cog"></i> Settings
            </button>
          </nav>
        </aside>

        <div className="admin-content">
          <section className={`admin-section ${section === 'dashboard' ? 'active' : ''}`}>
            <div className="section-header">
              <h1>Dashboard</h1>
              <div className="date-range">
                <i className="fas fa-calendar"></i>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-dollar-sign"></i></div>
                <div className="stat-info">
                  <h3>Total Revenue</h3>
                  <p className="stat-value">{formatCurrency(totalRevenue)}</p>
                  <span className="stat-change positive">Live</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-shopping-cart"></i></div>
                <div className="stat-info">
                  <h3>Total Orders</h3>
                  <p className="stat-value">{orders.length}</p>
                  <span className="stat-change positive">Live</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-users"></i></div>
                <div className="stat-info">
                  <h3>Total Users</h3>
                  <p className="stat-value">{users.length}</p>
                  <span className="stat-change positive">Registered</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><i className="fas fa-box"></i></div>
                <div className="stat-info">
                  <h3>Total Products</h3>
                  <p className="stat-value">{products.length}</p>
                  <span className="stat-change neutral">Managed</span>
                </div>
              </div>
            </div>

            <div className="dashboard-charts">
              <div className="chart-card">
                <h3>Recent Orders</h3>
                <div className="orders-list">
                  {recentOrders.length ? recentOrders.map((order) => (
                    <div className="order-item" key={order.id}>
                      <div className="order-info">
                        <strong>#{order.id}</strong>
                        <span>{order.userName || order.userEmail || 'Guest'}</span>
                      </div>
                      <div className="order-status">
                        <span className={`status ${order.status || 'pending'}`}>{order.status || 'pending'}</span>
                        <span className="amount">{formatCurrency(order.total || 0)}</span>
                      </div>
                    </div>
                  )) : <div className="order-item"><div className="order-info"><strong>No orders yet</strong></div></div>}
                </div>
              </div>
              <div className="chart-card">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <button className="action-btn" onClick={() => { setSection('products'); startCreateProduct(); }}>
                    <i className="fas fa-plus"></i>
                    Add Product
                  </button>
                  <button className="action-btn" onClick={() => setSection('orders')}>
                    <i className="fas fa-list"></i>
                    View Orders
                  </button>
                  <button className="action-btn" onClick={() => setSection('users')}>
                    <i className="fas fa-user-cog"></i>
                    Manage Users
                  </button>
                  <button className="action-btn" onClick={() => setSection('settings')}>
                    <i className="fas fa-cog"></i>
                    Settings
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className={`admin-section ${section === 'products' ? 'active' : ''}`}>
            <div className="section-header">
              <h1>Products Management</h1>
              <button className="btn-primary" onClick={startCreateProduct}>
                <i className="fas fa-plus"></i> Add Product
              </button>
            </div>

            {showProductForm ? (
              <div className="settings-card" style={{ marginBottom: '1.5rem' }}>
                <h3>{productForm.id ? 'Edit Product' : 'Add Product'}</h3>
                <form onSubmit={handleSaveProduct}>
                  <div className="form-group">
                    <label>Product Name</label>
                    <input value={productForm.name} onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input value={productForm.category} onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Price (N)</label>
                    <input type="number" min="0" value={productForm.price} onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Old Price (N)</label>
                    <input type="number" min="0" value={productForm.oldPrice} onChange={(e) => setProductForm((prev) => ({ ...prev, oldPrice: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Stock Quantity</label>
                    <input type="number" min="0" value={productForm.stock} onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea rows="3" value={productForm.description} onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}></textarea>
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input value={productForm.image} onChange={(e) => setProductForm((prev) => ({ ...prev, image: e.target.value }))} />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={resetProductForm}>Cancel</button>
                    <button type="submit" className="btn-primary">Save Product</button>
                  </div>
                </form>
              </div>
            ) : null}

            <div className="products-controls">
              <div className="search-bar">
                <input type="text" placeholder="Search products..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} />
                <button type="button"><i className="fas fa-search"></i></button>
              </div>
              <div className="filter-controls">
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="products-table">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length ? filteredProducts.map((product) => {
                    const status = getProductStatus(product);
                    return (
                      <tr key={product.id}>
                        <td>
                          <div className="product-image-cell">
                            <img src={product.image} alt={product.name} />
                          </div>
                        </td>
                        <td className="product-name">{product.name}</td>
                        <td><span className="product-category">{product.category}</span></td>
                        <td className="product-price">{formatCurrency(product.price || 0)}</td>
                        <td className={`product-stock ${Number(product.stock || 0) < 5 ? 'low' : Number(product.stock || 0) < 15 ? 'medium' : 'high'}`}>
                          {Number(product.stock || 0)}
                        </td>
                        <td><span className={`product-status ${status}`}>{status}</span></td>
                        <td>
                          <div className="table-actions">
                            <button className="btn-sm btn-outline" onClick={() => startEditProduct(product)}>Edit</button>
                            <button className="btn-sm" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="7">No products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className={`admin-section ${section === 'orders' ? 'active' : ''}`}>
            <div className="section-header">
              <h1>Orders Management</h1>
              <div className="order-stats">
                <span className="stat pending">Pending: {pendingOrders}</span>
                <span className="stat processing">Processing: {processingOrders}</span>
                <span className="stat delivered">Delivered: {deliveredOrders}</span>
              </div>
            </div>

            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length ? orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.userName || order.userEmail || 'Guest'}</td>
                      <td>{formatDate(order.createdAt || order.orderDate)}</td>
                      <td>{formatCurrency(order.total || 0)}</td>
                      <td><span className={`status ${order.status || 'pending'}`}>{order.status || 'pending'}</span></td>
                      <td>
                        <div className="table-actions">
                          <button className="btn-sm" onClick={() => showNotification(`Order ${order.id}: ${order.items?.length || 0} item(s)`, 'info')}>View</button>
                          <select value={order.status || 'pending'} onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6">No orders available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className={`admin-section ${section === 'users' ? 'active' : ''}`}>
            <div className="section-header">
              <h1>Users Management</h1>
            </div>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Join Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length ? users.map((user) => (
                    <tr key={user.id || user.email}>
                      <td>{user.name || '-'}</td>
                      <td>{user.email || '-'}</td>
                      <td>{user.role || 'user'}</td>
                      <td>{formatDate(user.createdAt || user.joinedDate)}</td>
                      <td><span className="status delivered">Active</span></td>
                      <td><button className="btn-sm" onClick={() => showNotification('User management actions can be expanded here.', 'info')}>View</button></td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className={`admin-section ${section === 'analytics' ? 'active' : ''}`}>
            <div className="section-header">
              <h1>Analytics</h1>
              <div className="date-filter">
                <select defaultValue="30">
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 3 months</option>
                  <option value="365">Last year</option>
                </select>
              </div>
            </div>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Sales Overview</h3>
                <div className="chart-placeholder">
                  <i className="fas fa-chart-line"></i>
                  <p>Sales chart would be displayed here</p>
                </div>
              </div>
              <div className="analytics-card">
                <h3>Top Categories</h3>
                <div className="chart-placeholder">
                  <i className="fas fa-chart-pie"></i>
                  <p>Category breakdown chart</p>
                </div>
              </div>
              <div className="analytics-card">
                <h3>User Growth</h3>
                <div className="chart-placeholder">
                  <i className="fas fa-chart-bar"></i>
                  <p>User growth chart</p>
                </div>
              </div>
              <div className="analytics-card">
                <h3>Revenue Trends</h3>
                <div className="chart-placeholder">
                  <i className="fas fa-chart-area"></i>
                  <p>Revenue trends chart</p>
                </div>
              </div>
            </div>
          </section>

          <section className={`admin-section ${section === 'settings' ? 'active' : ''}`}>
            <div className="section-header">
              <h1>Settings</h1>
            </div>
            <div className="settings-grid">
              <div className="settings-card">
                <h3>Site Settings</h3>
                <form onSubmit={handleSaveSiteSettings}>
                  <div className="form-group">
                    <label>Site Name</label>
                    <input value={settings.siteName || ''} onChange={(e) => setSettings((prev) => ({ ...prev, siteName: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label>Site Description</label>
                    <textarea value={settings.siteDescription || ''} onChange={(e) => setSettings((prev) => ({ ...prev, siteDescription: e.target.value }))}></textarea>
                  </div>
                  <div className="form-group">
                    <label>Contact Email</label>
                    <input type="email" value={settings.contactEmail || ''} onChange={(e) => setSettings((prev) => ({ ...prev, contactEmail: e.target.value }))} />
                  </div>
                  <button type="submit" className="btn-primary">Save Changes</button>
                </form>
              </div>
              <div className="settings-card">
                <h3>Notification Settings</h3>
                <form onSubmit={handleSaveSiteSettings}>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={!!settings.emailNotifications}
                        onChange={(e) => setSettings((prev) => ({ ...prev, emailNotifications: e.target.checked }))}
                      />
                      Email notifications for new orders
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={!!settings.smsNotifications}
                        onChange={(e) => setSettings((prev) => ({ ...prev, smsNotifications: e.target.checked }))}
                      />
                      SMS notifications for urgent issues
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={!!settings.dailyReports}
                        onChange={(e) => setSettings((prev) => ({ ...prev, dailyReports: e.target.checked }))}
                      />
                      Daily sales reports
                    </label>
                  </div>
                  <button type="submit" className="btn-primary">Save Settings</button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
