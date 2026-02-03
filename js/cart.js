document.addEventListener('DOMContentLoaded', () => {
  initializeCartPage();
});

function initializeCartPage() {
  updateCartCount();
  updateAuthLink();
  loadCartItems();
  setupCartEventListeners();
  loadRecentlyViewed();
  loadRecommendedProducts();
  setupPromoCode();
}

// FIXED: Show empty cart instead of redirecting
function loadCartItems() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById('cart-items');
  const emptyCartSection = document.getElementById('empty-cart');
  const cartContent = document.querySelector('.cart-content');
  
  if (cart.length === 0) {
    // FIXED: Show empty cart state instead of redirecting
    if (emptyCartSection) emptyCartSection.style.display = 'block';
    if (cartContent) cartContent.style.display = 'none';
    return;
  }
  
  // Hide empty cart and show content
  if (emptyCartSection) emptyCartSection.style.display = 'none';
  if (cartContent) cartContent.style.display = 'flex';
  
  cartItemsContainer.innerHTML = '';
  
  cart.forEach(item => {
    const cartItem = createCartItemElement(item);
    cartItemsContainer.appendChild(cartItem);
  });
  
  updateCartSummary();
}

function createCartItemElement(item) {
  const discount = item.originalPrice ? Math.round(100 - (item.price / item.originalPrice) * 100) : 0;
  const itemTotal = item.price * item.quantity;
  
  const cartItem = document.createElement('div');
  cartItem.className = 'cart-item';
  cartItem.setAttribute('data-id', item.id);
  
  cartItem.innerHTML = `
    <div class="cart-item-image">
      <img src="${item.image}" alt="${item.name}" loading="lazy">
    </div>
    <div class="cart-item-details">
      <h3><a href="product.html?id=${item.id}">${item.name}</a></h3>
      <div class="cart-item-meta">
        <span>Category: ${item.category}</span>
        <span>SKU: ${item.id}</span>
        ${item.color ? `<span>Color: ${item.color}</span>` : ''}
        ${item.size ? `<span>Size: ${item.size}</span>` : ''}
      </div>
      <div class="cart-item-price">
        ${formatCurrency(item.price)}
        ${item.originalPrice ? `<span class="cart-item-old-price">${formatCurrency(item.originalPrice)}</span>` : ''}
        ${discount > 0 ? `<span class="discount-info">${discount}% off</span>` : ''}
      </div>
    </div>
    <div class="cart-item-actions">
      <div class="quantity-controls">
        <button class="quantity-btn decrease-btn" ${item.quantity <= 1 ? 'disabled' : ''} 
                onclick="updateItemQuantity(${item.id}, ${item.quantity - 1})">
          <i class="fas fa-minus"></i>
        </button>
        <input type="number" class="quantity-input" value="${item.quantity}" 
               min="1" max="${item.stock}" 
               onchange="updateItemQuantity(${item.id}, this.value)">
        <button class="quantity-btn increase-btn" ${item.quantity >= item.stock ? 'disabled' : ''} 
                onclick="updateItemQuantity(${item.id}, ${item.quantity + 1})">
          <i class="fas fa-plus"></i>
        </button>
      </div>
      <div class="item-total">${formatCurrency(itemTotal)}</div>
      <button class="remove-item" onclick="removeCartItem(${item.id})">
        <i class="fas fa-trash"></i> Remove
      </button>
    </div>
  `;
  
  return cartItem;
}

function updateItemQuantity(productId, newQuantity) {
  newQuantity = parseInt(newQuantity);
  
  if (newQuantity <= 0) {
    removeCartItem(productId);
    return;
  }
  
  const product = getProductById(productId);
  if (product && newQuantity > product.stock) {
    showNotification(`Only ${product.stock} items available in stock`, 'warning');
    return;
  }
  
  if (updateCartQuantity(productId, newQuantity)) {
    const cartItem = document.querySelector(`[data-id="${productId}"]`);
    if (cartItem) {
      cartItem.classList.add('updated');
      setTimeout(() => cartItem.classList.remove('updated'), 1000);
    }
    
    loadCartItems();
    updateCartCount();
    showNotification('Cart updated', 'success');
  }
}

function removeCartItem(productId) {
  if (confirm('Are you sure you want to remove this item from your cart?')) {
    if (removeFromCart(productId)) {
      loadCartItems();
      updateCartCount();
      showNotification('Item removed from cart', 'info');
    }
  }
}

function setupCartEventListeners() {
  const clearCartBtn = document.getElementById('clear-cart');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear your entire cart?')) {
        clearCart();
        loadCartItems();
        updateCartCount();
        showNotification('Cart cleared', 'info');
      }
    });
  }
  
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckout);
  }
}

function handleCheckout() {
  const cart = getCart();
  const user = getCurrentUser();
  
  if (cart.length === 0) {
    showNotification('Your cart is empty', 'warning');
    return;
  }
  
  if (!user) {
    if (confirm('You need to login to proceed with checkout. Would you like to login now?')) {
      window.location.href = 'login.html';
    }
    return;
  }
  
  // Validate stock availability
  let stockError = false;
  for (const item of cart) {
    const product = getProductById(item.id);
    if (!product || product.stock < item.quantity) {
      showNotification(`${item.name} is out of stock or has insufficient quantity`, 'error');
      stockError = true;
      break;
    }
  }
  
  if (stockError) {
    loadCartItems();
    return;
  }
  
  const order = createOrderFromCart();
  if (order) {
    updateProductStocks(cart);
    clearCart();
    
    showNotification(`Order #${order.id} placed successfully!`, 'success');
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  } else {
    showNotification('Failed to place order. Please try again.', 'error');
  }
}

function createOrderFromCart() {
  const cart = getCart();
  const user = getCurrentUser();
  const orderData = {
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    items: cart.map(item => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity
    })),
    subtotal: calculateSubtotal(),
    shipping: calculateShipping(),
    discount: calculateDiscount(),
    total: calculateTotal(),
    paymentMethod: 'card',
    shippingAddress: 'Default Address',
    orderDate: new Date().toISOString()
  };
  
  return createOrder(orderData);
}

function updateProductStocks(cart) {
  cart.forEach(item => {
    const product = getProductById(item.id);
    if (product) {
      updateProduct(item.id, { stock: product.stock - item.quantity });
    }
  });
}

function updateCartSummary() {
  const cart = getCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = calculateSubtotal();
  const shipping = calculateShipping();
  const discount = calculateDiscount();
  const total = calculateTotal();
  
  updateElement('summary-items', itemCount);
  updateElement('summary-subtotal', formatCurrency(subtotal));
  updateElement('summary-shipping', formatCurrency(shipping));
  updateElement('summary-discount', formatCurrency(discount));
  updateElement('summary-total', formatCurrency(total));
  
  const discountRow = document.getElementById('discount-row');
  if (discountRow) {
    discountRow.style.display = discount > 0 ? 'flex' : 'none';
  }
  
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
  }
}

function calculateSubtotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function calculateShipping() {
  const subtotal = calculateSubtotal();
  
  // FIXED: Respect free-shipping promo codes
  const appliedPromo = getAppliedPromoCode();
  if (appliedPromo && appliedPromo.type === 'shipping') {
    return 0;
  }
  
  if (subtotal >= 100000) {
    return 0;
  }
  
  return 2500;
}

function calculateDiscount() {
  const appliedPromo = getAppliedPromoCode();
  if (!appliedPromo) return 0;
  
  const subtotal = calculateSubtotal();
  
  switch (appliedPromo.type) {
    case 'percentage':
      return Math.min(subtotal * (appliedPromo.value / 100), appliedPromo.maxDiscount || Infinity);
    case 'fixed':
      return Math.min(appliedPromo.value, subtotal);
    case 'shipping':
      // shipping-type promo does not reduce subtotal; handled by calculateShipping
      return 0;
    default:
      return 0;
  }
}

function calculateTotal() {
  const subtotal = calculateSubtotal();
  const shipping = calculateShipping();
  const discount = calculateDiscount();
  
  return Math.max(0, subtotal + shipping - discount);
}

function setupPromoCode() {
  const promoForm = document.getElementById('promo-form');
  if (promoForm) {
    promoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const promoInput = document.getElementById('promo-code');
      const promoCode = promoInput.value.trim().toUpperCase();
      
      if (promoCode) {
        applyPromoCode(promoCode);
      }
    });
  }
}

function applyPromoCode(code) {
  const promoCodes = getPromoCodes();
  const promo = promoCodes.find(p => p.code === code && p.active);
  
  if (!promo) {
    showNotification('Invalid promo code', 'error');
    return;
  }
  
  if (promo.minOrderValue && calculateSubtotal() < promo.minOrderValue) {
    showNotification(`Minimum order value of ${formatCurrency(promo.minOrderValue)} required`, 'warning');
    return;
  }
  
  localStorage.setItem('applied_promo', JSON.stringify(promo));
  
  updateCartSummary();
  showPromoSuccess(promo);
  
  showNotification(`Promo code "${code}" applied successfully!`, 'success');
}

function showPromoSuccess(promo) {
  const promoInput = document.getElementById('promo-code');
  const promoButton = promoInput.nextElementSibling;
  
  promoInput.value = promo.code;
  promoInput.disabled = true;
  promoButton.textContent = 'Applied';
  promoButton.disabled = true;
  promoButton.style.backgroundColor = '#28a745';
  
  const existingSuccess = document.querySelector('.promo-success');
  if (existingSuccess) existingSuccess.remove();
  
  const successMsg = document.createElement('div');
  successMsg.className = 'promo-success';
  successMsg.innerHTML = `<i class="fas fa-check"></i> ${promo.description}`;
  
  promoInput.parentElement.appendChild(successMsg);
}

function getAppliedPromoCode() {
  try {
    const applied = localStorage.getItem('applied_promo');
    return applied ? JSON.parse(applied) : null;
  } catch {
    return null;
  }
}

function getPromoCodes() {
  return [
    {
      code: 'WELCOME10',
      type: 'percentage',
      value: 10,
      description: '10% off your order',
      minOrderValue: 5000,
      maxDiscount: 10000,
      active: true
    },
    {
      code: 'SAVE5000',
      type: 'fixed',
      value: 5000,
      description: '₦5,000 off your order',
      minOrderValue: 25000,
      active: true
    },
    {
      code: 'FREESHIP',
      type: 'shipping',
      value: 0,
      description: 'Free shipping',
      minOrderValue: 0,
      active: true
    }
  ];
}

function loadRecentlyViewed() {
  const recentlyViewedSection = document.getElementById('recently-viewed');
  const recentlyViewedGrid = document.getElementById('recently-viewed-grid');
  
  if (!recentlyViewedGrid) return;
  
  const recentlyViewed = getRecentlyViewed();
  
  if (recentlyViewed.length === 0) {
    if (recentlyViewedSection) recentlyViewedSection.style.display = 'none';
    return;
  }
  
  if (recentlyViewedSection) recentlyViewedSection.style.display = 'block';
  renderProductsInGrid(recentlyViewedGrid, recentlyViewed.slice(0, 6));
}

function loadRecommendedProducts() {
  const recommendedGrid = document.getElementById('recommended-grid');
  if (!recommendedGrid) return;
  
  const cart = getCart();
  const allProducts = getProducts();
  
  const cartCategories = [...new Set(cart.map(item => item.category))];
  
  const cartProductIds = cart.map(item => item.id);
  let recommended = allProducts.filter(product => 
    cartCategories.includes(product.category) && 
    !cartProductIds.includes(product.id)
  );
  
  if (recommended.length < 6) {
    const additional = allProducts
      .filter(product => !cartProductIds.includes(product.id) && !recommended.includes(product))
      .slice(0, 6 - recommended.length);
    
    recommended = [...recommended, ...additional];
  }
  
  renderProductsInGrid(recommendedGrid, recommended.slice(0, 6));
}

function renderProductsInGrid(container, products) {
  container.innerHTML = '';
  
  products.forEach(product => {
    const card = createRecommendedProductCard(product);
    container.appendChild(card);
  });
}

function createRecommendedProductCard(product) {
  const discount = product.originalPrice ? Math.round(100 - (product.price / product.originalPrice) * 100) : 0;
  
  const card = document.createElement('div');
  card.className = 'product-card';
  
  card.innerHTML = `
    <div class="product-image">
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${discount > 0 ? `<div class="discount-badge">-${discount}%</div>` : ''}
      </a>
    </div>
    <div class="product-info">
      <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
      <div class="price">
        ${formatCurrency(product.price)}
        ${product.originalPrice ? `<span class="old-price">${formatCurrency(product.originalPrice)}</span>` : ''}
      </div>
      <button class="add-to-cart btn-primary" onclick="addRecommendedToCart(${product.id})">
        Add to Cart
      </button>
    </div>
  `;
  
  return card;
}

function addRecommendedToCart(productId) {
  const product = getProductById(productId);
  if (!product) return;
  
  if (product.stock === 0) {
    showNotification('This item is out of stock', 'error');
    return;
  }
  
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    if (existingItem.quantity < product.stock) {
      existingItem.quantity++;
      saveCart(cart);
      showNotification(`${product.name} quantity updated in cart`, 'success');
    } else {
      showNotification('Maximum stock limit reached', 'warning');
      return;
    }
  } else {
    cart.push({ ...product, quantity: 1 });
    saveCart(cart);
    showNotification(`${product.name} added to cart`, 'success');
  }
  
  loadCartItems();
  updateCartCount();
}

function updateElement(id, content) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = content;
  }
}

function formatCurrency(amount) {
  return '₦' + amount.toLocaleString();
}

// Expose functions for onclick handlers
window.updateItemQuantity = updateItemQuantity;
window.removeCartItem = removeCartItem;
window.addRecommendedToCart = addRecommendedToCart;