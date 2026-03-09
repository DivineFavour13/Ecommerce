import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AccountNav from '../../components/AccountNav.jsx';
import { getCurrentUser, getOrders } from '../../utils/storage.js';
import { formatCurrency } from '../../utils/format.js';

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    const all = getOrders() || [];
    const filtered = all.filter(o => (o.userEmail || o.customerEmail || '').toLowerCase() === (user.email || '').toLowerCase());
    setOrders(filtered);
  }, [navigate]);

  return (
    <main>
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <i className="fas fa-chevron-right"></i>
          <Link to="/account">Account Settings</Link>
          <i className="fas fa-chevron-right"></i>
          <span>Orders</span>
        </div>

        <div className="account-header">
          <h1><i className="fas fa-box"></i> Orders</h1>
          <p className="account-subtitle">Track recent orders and order status.</p>
        </div>

        <div className="account-grid">
          <AccountNav />

          <section className="account-content">
            <div className="card">
              <div className="card-header">
                <h3>Order History</h3>
                <span className="card-hint">Recent orders</span>
              </div>
              <div id="orders-list" className="orders-list">
                {orders.length === 0 ? (
                  <div className="coming-soon">No orders yet.</div>
                ) : orders.map(o => {
                  const createdAt = o.createdAt ? new Date(o.createdAt).toLocaleString() : 'Unknown date';
                  const itemCount = (o.items || []).reduce((s, it) => s + (it.quantity || 1), 0);
                  const total = o.total != null ? o.total : 0;
                  return (
                    <div className="order-card" key={o.id}>
                      <div className="order-meta">
                        <div><strong>#{o.id}</strong></div>
                        <div>{createdAt}</div>
                        <div>Status: {o.status || 'pending'}</div>
                      </div>
                      <div className="order-meta" style={{ marginTop: '0.5rem' }}>
                        <div>Items: {itemCount}</div>
                        <div>Total: {formatCurrency(total)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
