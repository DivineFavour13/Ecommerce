import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getCart,
  saveCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  getCartItemCount,
  getRecentlyViewed,
  getProducts,
  getCurrentUser,
  getProductById,
  createOrder,
  saveProducts
} from '../utils/storage.js';
import { formatCurrency } from '../utils/format.js';
import { showNotification } from '../utils/notifications.js';

const PROMO_CODES = [
  { code: 'WELCOME10', type: 'percentage', value: 10, description: '10% off your order', minOrderValue: 5000, maxDiscount: 10000, active: true },
  { code: 'SAVE5000', type: 'fixed', value: 5000, description: 'N5,000 off your order', minOrderValue: 25000, active: true },
  { code: 'FREESHIP', type: 'shipping', value: 0, description: 'Free shipping', minOrderValue: 0, active: true }
];

export default function CartPage() {
  const [cart, setCart] = useState(() => (getCart() || []).filter((item) => typeof item.price === 'number' && !Number.isNaN(item.price)));
  const [promoInput, setPromoInput] = useState('');
  const [updatedItemId, setUpdatedItemId] = useState(null);
  const [appliedPromo, setAppliedPromo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('applied_promo') || 'null');
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  useEffect(() => {
    const onCart = () => setCart((getCart() || []).filter((item) => typeof item.price === 'number' && !Number.isNaN(item.price)));
    window.addEventListener('cartUpdated', onCart);
    return () => window.removeEventListener('cartUpdated', onCart);
  }, []);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);
  const shipping = useMemo(() => {
    if (appliedPromo?.type === 'shipping') return 0;
    return subtotal >= 100000 ? 0 : 2500;
  }, [appliedPromo, subtotal]);
  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.type === 'percentage') {
      return Math.min(subtotal * (appliedPromo.value / 100), appliedPromo.maxDiscount || Infinity);
    }
    if (appliedPromo.type === 'fixed') {
      return Math.min(appliedPromo.value, subtotal);
    }
    return 0;
  }, [appliedPromo, subtotal]);
  const total = Math.max(0, subtotal + shipping - discount);

  const recentlyViewed = getRecentlyViewed().slice(0, 6);
  const cartProductIds = cart.map((item) => item.id);
  const cartCategories = [...new Set(cart.map((item) => item.category))];
  let recommended = (getProducts() || []).filter((p) => cartCategories.includes(p.category) && !cartProductIds.includes(p.id));
  if (recommended.length < 6) {
    const additional = (getProducts() || [])
      .filter((p) => !cartProductIds.includes(p.id) && !recommended.find((r) => r.id === p.id))
      .slice(0, 6 - recommended.length);
    recommended = [...recommended, ...additional];
  }
  recommended = recommended.slice(0, 6);

  const refreshCart = () => setCart((getCart() || []).filter((item) => typeof item.price === 'number' && !Number.isNaN(item.price)));

  const handleQty = (id, qty) => {
    const q = parseInt(qty, 10);
    if (!Number.isFinite(q)) return;
    if (q <= 0) return handleRemove(id);
    const product = getProductById(id);
    if (product && q > product.stock) {
      showNotification(`Only ${product.stock} items available in stock`, 'warning');
      return;
    }
    if (updateCartQuantity(id, q)) {
      setUpdatedItemId(id);
      setTimeout(() => setUpdatedItemId(null), 1000);
      refreshCart();
      showNotification('Cart updated', 'success');
    }
  };

  const handleRemove = (id) => {
    if (!confirm('Are you sure you want to remove this item from your cart?')) return;
    removeFromCart(id);
    refreshCart();
    showNotification('Item removed from cart', 'info');
  };

  const handleClear = () => {
    if (!confirm('Are you sure you want to clear your entire cart?')) return;
    clearCart();
    setCart([]);
    localStorage.removeItem('applied_promo');
    setAppliedPromo(null);
    showNotification('Cart cleared', 'info');
  };

  const applyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    const promo = PROMO_CODES.find((p) => p.code === code && p.active);
    if (!promo) {
      showNotification('Invalid promo code', 'error');
      return;
    }
    if (promo.minOrderValue && subtotal < promo.minOrderValue) {
      showNotification(`Minimum order value of ${formatCurrency(promo.minOrderValue)} required`, 'warning');
      return;
    }
    localStorage.setItem('applied_promo', JSON.stringify(promo));
    setAppliedPromo(promo);
    showNotification(`Promo code "${code}" applied successfully!`, 'success');
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showNotification('Your cart is empty', 'warning');
      return;
    }
    const user = getCurrentUser();
    if (!user) {
      if (confirm('You need to login to proceed with checkout. Would you like to login now?')) {
        navigate('/login');
      }
      return;
    }
    for (const item of cart) {
      const p = getProductById(item.id);
      if (!p || p.stock < item.quantity) {
        showNotification(`${item.name} is out of stock or has insufficient quantity`, 'error');
        refreshCart();
        return;
      }
    }
    const order = createOrder({
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      items: cart.map((item) => ({
        id: item.id,
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      })),
      subtotal,
      shipping,
      discount,
      total,
      paymentMethod: 'card',
      shippingAddress: 'Default Address',
      orderDate: new Date().toISOString()
    });
    if (!order) {
      showNotification('Failed to place order. Please try again.', 'error');
      return;
    }
    const reducedStockProducts = getProducts().map((product) => {
      const cartItem = cart.find((item) => item.id === product.id);
      if (!cartItem) return product;
      const nextStock = Math.max(0, Number(product.stock || 0) - Number(cartItem.quantity || 0));
      return { ...product, stock: nextStock, inStock: nextStock > 0 };
    });
    saveProducts(reducedStockProducts);
    clearCart();
    localStorage.removeItem('applied_promo');
    setAppliedPromo(null);
    setCart([]);
    showNotification(`Order #${order.id} placed successfully!`, 'success');
    setTimeout(() => navigate('/'), 1200);
  };

  const addRecommendedToCart = (productId) => {
    const product = getProductById(productId);
    if (!product) return;
    if (product.stock === 0) {
      showNotification('This item is out of stock', 'error');
      return;
    }
    const current = getCart();
    const existing = current.find((item) => item.id === product.id);
    if (existing) {
      if (existing.quantity < product.stock) {
        existing.quantity += 1;
        saveCart(current);
      } else {
        showNotification('Maximum stock limit reached', 'warning');
        return;
      }
    } else {
      current.push({ ...product, quantity: 1 });
      saveCart(current);
    }
    refreshCart();
    showNotification(`${product.name} added to cart`, 'success');
  };

  return (
    <main>
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <i className="fas fa-chevron-right"></i>
          <span>Shopping Cart</span>
        </div>

        <div className="cart-header">
          <h1><i className="fas fa-shopping-cart"></i> Shopping Cart</h1>
          <div className="cart-actions">
            <button id="clear-cart" className="btn-secondary" onClick={handleClear}>
              <i className="fas fa-trash"></i> Clear Cart
            </button>
            <Link to="/" className="btn-outline">
              <i className="fas fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart" id="empty-cart">
            <div className="empty-cart-content">
              <i className="fas fa-shopping-cart"></i>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any items to your cart yet.</p>
              <Link to="/" className="btn-primary">
                <i className="fas fa-arrow-left"></i> Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items" id="cart-items">
              {cart.map((item) => {
                const pDiscount = item.originalPrice ? Math.round(100 - (item.price / item.originalPrice) * 100) : 0;
                return (
                  <div className={`cart-item ${updatedItemId === item.id ? 'updated' : ''}`} key={item.id} data-id={item.id}>
                    <div className="cart-item-image">
                      <img src={item.image} alt={item.name} loading="lazy" />
                    </div>
                    <div className="cart-item-details">
                      <h3><Link to={`/product?id=${item.id}`}>{item.name}</Link></h3>
                      <div className="cart-item-meta">
                        <span>Category: {item.category}</span>
                        <span>SKU: {item.id}</span>
                        {item.color ? <span>Color: {item.color}</span> : null}
                        {item.size ? <span>Size: {item.size}</span> : null}
                      </div>
                      <div className="cart-item-price">
                        {formatCurrency(item.price)}
                        {item.originalPrice ? <span className="cart-item-old-price">{formatCurrency(item.originalPrice)}</span> : null}
                        {pDiscount > 0 ? <span className="discount-info">{pDiscount}% off</span> : null}
                      </div>
                    </div>
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button className="quantity-btn decrease-btn" disabled={item.quantity <= 1} onClick={() => handleQty(item.id, item.quantity - 1)}>
                          <i className="fas fa-minus"></i>
                        </button>
                        <input
                          type="number"
                          className="quantity-input"
                          value={item.quantity}
                          min="1"
                          max={item.stock}
                          onChange={(e) => handleQty(item.id, e.target.value)}
                        />
                        <button className="quantity-btn increase-btn" disabled={item.quantity >= (item.stock || 1)} onClick={() => handleQty(item.id, item.quantity + 1)}>
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                      <div className="item-total">{formatCurrency(item.price * item.quantity)}</div>
                      <button className="remove-item" onClick={() => handleRemove(item.id)}>
                        <i className="fas fa-trash"></i> Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary">
              <div className="summary-card">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Subtotal (<span id="summary-items">{getCartItemCount()}</span> items)</span>
                  <span id="summary-subtotal">{formatCurrency(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span id="summary-shipping">{formatCurrency(shipping)}</span>
                </div>
                <div className="summary-row discount-row" id="discount-row" style={{ display: discount > 0 ? 'flex' : 'none' }}>
                  <span>Discount</span>
                  <span id="summary-discount">-{formatCurrency(discount)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span id="summary-total">{formatCurrency(total)}</span>
                </div>

                <div className="promo-code">
                  <h4>Promo Code</h4>
                  <form id="promo-form" onSubmit={applyPromo}>
                    <div className="promo-input">
                      <input
                        type="text"
                        id="promo-code"
                        placeholder="Enter promo code"
                        disabled={!!appliedPromo}
                        value={appliedPromo ? appliedPromo.code : promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                      />
                      <button type="submit" disabled={!!appliedPromo}>{appliedPromo ? 'Applied' : 'Apply'}</button>
                    </div>
                  </form>
                  {appliedPromo ? (
                    <div className="promo-success">
                      <i className="fas fa-check"></i> {appliedPromo.description}
                    </div>
                  ) : null}
                </div>

                <button id="checkout-btn" className="btn-primary btn-full" onClick={handleCheckout} disabled={cart.length === 0}>
                  <i className="fas fa-lock"></i> Proceed to Checkout
                </button>

                <div className="payment-methods">
                  <h4>We Accept</h4>
                  <div className="payment-icons">
                    <i className="fab fa-cc-visa"></i>
                    <i className="fab fa-cc-mastercard"></i>
                    <i className="fab fa-cc-paypal"></i>
                    <i className="fas fa-university"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {recentlyViewed.length > 0 ? (
          <section className="recently-viewed" id="recently-viewed">
            <h2>Recently Viewed</h2>
            <div className="product-grid" id="recently-viewed-grid">
              {recentlyViewed.map((p) => (
                <div className="product-card" key={p.id}>
                  <div className="product-image">
                    <Link to={`/product?id=${p.id}`}>
                      <img src={p.image} alt={p.name} loading="lazy" />
                    </Link>
                  </div>
                  <div className="product-info">
                    <h3><Link to={`/product?id=${p.id}`}>{p.name}</Link></h3>
                    <div className="price">{formatCurrency(p.price)}</div>
                    <button className="add-to-cart btn-primary" onClick={() => addRecommendedToCart(p.id)}>Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="recommended-products">
          <h2>You Might Also Like</h2>
          <div className="product-grid" id="recommended-grid">
            {recommended.map((p) => {
              const pDiscount = p.originalPrice ? Math.round(100 - (p.price / p.originalPrice) * 100) : 0;
              return (
                <div className="product-card" key={p.id}>
                  <div className="product-image">
                    <Link to={`/product?id=${p.id}`}>
                      <img src={p.image} alt={p.name} loading="lazy" />
                      {pDiscount > 0 ? <div className="discount-badge">-{pDiscount}%</div> : null}
                    </Link>
                  </div>
                  <div className="product-info">
                    <h3><Link to={`/product?id=${p.id}`}>{p.name}</Link></h3>
                    <div className="price">
                      {formatCurrency(p.price)}
                      {p.originalPrice ? <span className="old-price">{formatCurrency(p.originalPrice)}</span> : null}
                    </div>
                    <button className="add-to-cart btn-primary" onClick={() => addRecommendedToCart(p.id)}>Add to Cart</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
