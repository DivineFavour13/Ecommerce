// cart.js - Shopping cart functionality

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

// Load and render cart items
function loadCartItems() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById('cart-items');
  const emptyCartSection = document.getElementById('empty-cart');
  const cartContent = document.querySelector('.cart-content');
  
  if (cart.length === 0) {
    showNotification('Your cart is empty', 'warning');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
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

// Show empty cart
function showEmptyCart() {
  const emptyCartSection = document.getElementById('empty-cart');
  const cartContent = document.querySelector('.cart-content');
  
  if (emptyCartSection) emptyCartSection.style.display = 'block';
  if (cartContent) cartContent.style.display = 'none';
}

// Create cart item element
function createCartItemElement(item) {
  const discount = item.oldPrice ? Math.round(100 - (item.price / item.oldPrice) * 100) : 0;
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
        ${item.oldPrice ? `<span class="cart-item-old-price">${formatCurrency(item.oldPrice)}</span>` : ''}
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

// Update item quantity
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
    // Add update animation
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

// Remove cart item
function removeCartItem(productId) {
  if (confirm('Are you sure you want to remove this item from your cart?')) {
    if (removeFromCart(productId)) {
      loadCartItems();
      updateCartCount();
      showNotification('Item removed from cart', 'info');
    }
  }
}

// Setup cart event listeners
function setupCartEventListeners() {
  // Clear cart button
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
  
  // Checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckout);
  }
}

// Handle checkout
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
    loadCartItems(); // Refresh cart to show current stock
    return;
  }
  
  // Create order
  const order = createOrderFromCart();
  if (order) {
    // Update product stocks
    updateProductStocks(cart);
    
    // Clear cart
    clearCart();
    
    showNotification(`Order #${order.id} placed successfully!`, 'success');
    
    // Redirect to order confirmation or home
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  } else {
    showNotification('Failed to place order. Please try again.', 'error');
  }
}

// Create order from cart
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
    paymentMethod: 'card', // Default payment method
    shippingAddress: 'Default Address', // In real app, this would be from user profile
    orderDate: new Date().toISOString()
  };
  
  return createOrder(orderData);
}

// Update product stocks after order
function updateProductStocks(cart) {
  cart.forEach(item => {
    const product = getProductById(item.id);
    if (product) {
      updateProduct(item.id, { stock: product.stock - item.quantity });
    }
  });
}

// Update cart summary
function updateCartSummary() {
  const cart = getCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = calculateSubtotal();
  const shipping = calculateShipping();
  const discount = calculateDiscount();
  const total = calculateTotal();
  
  // Update summary elements
  updateElement('summary-items', itemCount);
  updateElement('summary-subtotal', formatCurrency(subtotal));
  updateElement('summary-shipping', formatCurrency(shipping));
  updateElement('summary-discount', formatCurrency(discount));
  updateElement('summary-total', formatCurrency(total));
  
  // Show/hide discount row
  const discountRow = document.getElementById('discount-row');
  if (discountRow) {
    discountRow.style.display = discount > 0 ? 'flex' : 'none';
  }
  
  // Enable/disable checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
  }
}

// Calculate subtotal
function calculateSubtotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Calculate shipping
function calculateShipping() {
  const subtotal = calculateSubtotal();
  
  // Free shipping over 100,000
  if (subtotal >= 100000) {
    return 0;
  }
  
  // Standard shipping
  return 2500;
}

// Calculate discount
function calculateDiscount() {
  const appliedPromo = getAppliedPromoCode();
  if (!appliedPromo) return 0;
  
  const subtotal = calculateSubtotal();
  
  switch (appliedPromo.type) {
    case 'percentage':
      return Math.min(subtotal * (appliedPromo.value / 100), appliedPromo.maxDiscount || Infinity);
    case 'fixed':
      return Math.min(appliedPromo.value, subtotal);
    default:
      return 0;
  }
}

// Calculate total
function calculateTotal() {
  const subtotal = calculateSubtotal();
  const shipping = calculateShipping();
  const discount = calculateDiscount();
  
  return Math.max(0, subtotal + shipping - discount);
}

// Setup promo code functionality
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

// Apply promo code
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
  
  // Apply promo code
  localStorage.setItem('applied_promo', JSON.stringify(promo));
  
  // Update UI
  updateCartSummary();
  showPromoSuccess(promo);
  
  showNotification(`Promo code "${code}" applied successfully!`, 'success');
}

// Show promo success
function showPromoSuccess(promo) {
  const promoInput = document.getElementById('promo-code');
  const promoButton = promoInput.nextElementSibling;
  
  promoInput.value = promo.code;
  promoInput.disabled = true;
  promoButton.textContent = 'Applied';
  promoButton.disabled = true;
  promoButton.style.backgroundColor = '#28a745';
  
  // Add success message
  const existingSuccess = document.querySelector('.promo-success');
  if (existingSuccess) existingSuccess.remove();
  
  const successMsg = document.createElement('div');
  successMsg.className = 'promo-success';
  successMsg.innerHTML = `<i class="fas fa-check"></i> ${promo.description}`;
  
  promoInput.parentElement.appendChild(successMsg);
}

// Get applied promo code
function getAppliedPromoCode() {
  try {
    const applied = localStorage.getItem('applied_promo');
    return applied ? JSON.parse(applied) : null;
  } catch {
    return null;
  }
}

// Get available promo codes (demo data)
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

// Load recently viewed products
function loadRecentlyViewed() {
  const recentlyViewedSection = document.getElementById('recently-viewed');
  const recentlyViewedGrid = document.getElementById('recently-viewed-grid');
  
  if (!recentlyViewedGrid) return;
  
  const recentlyViewed = getRecentlyViewed();
  
  if (recentlyViewed.length === 0) {
    recentlyViewedSection.style.display = 'none';
    return;
  }
  
  recentlyViewedSection.style.display = 'block';
  renderProductsInGrid(recentlyViewedGrid, recentlyViewed.slice(0, 6));
}

// Load recommended products
function loadRecommendedProducts() {
  const recommendedGrid = document.getElementById('recommended-grid');
  if (!recommendedGrid) return;
  
  const cart = getCart();
  const allProducts = getProducts();
  
  // Get categories from cart items
  const cartCategories = [...new Set(cart.map(item => item.category))];
  
  // Filter products by cart categories (excluding items already in cart)
  const cartProductIds = cart.map(item => item.id);
  let recommended = allProducts.filter(product => 
    cartCategories.includes(product.category) && 
    !cartProductIds.includes(product.id)
  );
  
  // If not enough, add random products
  if (recommended.length < 6) {
    const additional = allProducts
      .filter(product => !cartProductIds.includes(product.id) && !recommended.includes(product))
      .slice(0, 6 - recommended.length);
    
    recommended = [...recommended, ...additional];
  }
  
  renderProductsInGrid(recommendedGrid, recommended.slice(0, 6));
}

// Render products in grid
function renderProductsInGrid(container, products) {
  container.innerHTML = '';
  
  products.forEach(product => {
    const card = createRecommendedProductCard(product);
    container.appendChild(card);
  });
}

// Create recommended product card
function createRecommendedProductCard(product) {
  const discount = product.oldPrice ? Math.round(100 - (product.price / product.oldPrice) * 100) : 0;
  
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
        ${product.oldPrice ? `<span class="old-price">${formatCurrency(product.oldPrice)}</span>` : ''}
      </div>
      <button class="add-to-cart btn-primary" onclick="addRecommendedToCart(${product.id})">
        Add to Cart
      </button>
    </div>
  `;
  
  return card;
}

// Add recommended product to cart
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

// Utility function to update element text content
function updateElement(id, content) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = content;
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCartPage);
} else {
  initializeCartPage();
}

// Expose functions for onclick handlers
window.updateItemQuantity = updateItemQuantity;
window.removeCartItem = removeCartItem;
window.addRecommendedToCart = addRecommendedToCart;