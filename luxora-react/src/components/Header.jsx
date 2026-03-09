import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCartItemCount, getCurrentUser, getProducts, logout } from '../utils/storage.js';
import { showNotification } from '../utils/notifications.js';
import { findBrandByQuery, slugifyBrand } from '../utils/brands.js';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [user, setUser] = useState(() => getCurrentUser());
  const [cartCount, setCartCount] = useState(() => getCartItemCount());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onUser = () => setUser(getCurrentUser());
    const onCart = () => setCartCount(getCartItemCount());
    window.addEventListener('userUpdated', onUser);
    window.addEventListener('cartUpdated', onCart);
    return () => {
      window.removeEventListener('userUpdated', onUser);
      window.removeEventListener('cartUpdated', onCart);
    };
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      const dropdown = document.getElementById('user-dropdown');
      if (dropdown && !dropdown.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    if (!confirm('Are you sure you want to logout?')) return;
    logout();
    showNotification('Logged out successfully', 'info');
    setOpen(false);
    navigate('/');
  };

  const handleSearch = () => {
    const query = String(searchValue || '').trim();
    if (!query) return;

    const products = getProducts();
    const matchedBrand = findBrandByQuery(products, query);

    if (matchedBrand) {
      navigate(`/brand/${slugifyBrand(matchedBrand)}`);
      setSearchValue('');
      return;
    }

    navigate(`/?q=${encodeURIComponent(query)}`);
    showNotification(`No brand store found for "${query}". Showing regular search.`, 'info');
  };

  return (
    <header id="main-header">
      <div className="header-container">
        <div className="logo">
          <h2><Link to="/">LUXORA</Link></h2>
        </div>

        <div className="search-bar">
          <input
            type="text"
            id="search-input"
            placeholder="Search products, brands and categories..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          <button id="search-btn" onClick={handleSearch}><i className="fas fa-search"></i></button>
        </div>

        <nav className="header-nav">
          <Link to="/cart" id="cart-link" className={`cart-link ${cartCount > 0 ? 'has-items' : ''}`}>
            <i className="fas fa-shopping-cart"></i>
            Cart (<span id="cart-count">{cartCount}</span>)
          </Link>

          <div className={`user-dropdown ${open ? 'active' : ''}`} id="user-dropdown">
            <button className="user-dropdown-btn" id="user-dropdown-btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open); }}>
              <i className="fas fa-user"></i>
              <span id="user-name">{user ? (user.name || 'Account') : 'Account'}</span>
              <span className="admin-badge" id="admin-badge" style={{ display: user?.role === 'admin' ? 'inline-block' : 'none' }}>Admin</span>
              <i className="fas fa-chevron-down dropdown-arrow"></i>
            </button>

            <div className="dropdown-menu" id="dropdown-menu">
              {user?.role === 'admin' ? (
                location.pathname === '/admin' ? (
                  <Link to="/" className="dropdown-item" id="admin-link">
                    <i className="fas fa-home"></i>
                    Home
                  </Link>
                ) : (
                  <Link to="/admin" className="dropdown-item" id="admin-link">
                    <i className="fas fa-tachometer-alt"></i>
                    Admin Panel
                  </Link>
                )
              ) : null}
              <Link to="/wishlist" className="dropdown-item" id="wishlist-link" onClick={() => setOpen(false)}>
                <i className="fas fa-heart"></i>
                Wishlist
              </Link>
              <Link to={user ? '/account' : '/login'} className="dropdown-item" id="account-link" onClick={() => setOpen(false)}>
                <i className="fas fa-user-cog"></i>
                Account Settings
              </Link>
              <div className="dropdown-divider"></div>
              <Link to="/login" className="dropdown-item" id="login-link" style={{ display: user ? 'none' : 'flex' }} onClick={() => setOpen(false)}>
                <i className="fas fa-sign-in-alt"></i>
                Login
              </Link>
              <a href="#" className="dropdown-item" id="logout-link" onClick={handleLogout} style={{ display: user ? 'flex' : 'none' }}>
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
