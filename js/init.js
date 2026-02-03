// init.js - FIXED without race conditions and hardcoded passwords

document.addEventListener('DOMContentLoaded', () => {
  initializeApplication();
});

function initializeApplication() {
  // Check if storage is available
  if (!isStorageAvailable()) {
    console.error('LocalStorage is not available');
    showNotification('Storage not available. Some features may not work.', 'error');
    return;
  }

  // FIXED: Direct initialization without setTimeout
  initializeStorage();
  initializeProducts();
  initializeAuth();
  initializeUI();
  initializeEventListeners();
}

function initializeProducts() {
  // Check if products exist globally (from products-data.js)
  if (typeof products !== 'undefined' && products.length > 0) {
    window.productsData = products;
    
    const storedProducts = getProducts();
    
    if (!storedProducts || storedProducts.length === 0) {
      saveProducts(products);
    }
  } else {
    const storedProducts = getProducts();
    if (storedProducts && storedProducts.length > 0) {
      window.productsData = storedProducts;
    } else {
      console.error('No products available!');
      showNotification('Products could not be loaded', 'error');
    }
  }
}

function initializeAuth() {
  const users = getUsers();
  
  // FIXED: Default users are created in storage.js initialization
  // No need to duplicate here
  
  const currentUser = getCurrentUser();
  if (currentUser) {
    // User is already logged in
  }
}

function initializeUI() {
  if (typeof updateCartCount === 'function') {
    updateCartCount();
  }
  
  if (typeof updateAuthLink === 'function') {
    updateAuthLink();
  }
  
  if (typeof updateUserDropdown === 'function') {
    updateUserDropdown();
  }
  
  setupGlobalErrorHandlers();
}

function initializeEventListeners() {
  // Global click handlers for add to cart buttons
  document.addEventListener('click', (e) => {
    if (e.target.matches('.add-to-cart-btn, .add-to-cart-btn *')) {
      handleAddToCartClick(e);
    }
    
    if (e.target.matches('.wishlist-btn, .wishlist-btn *')) {
      handleWishlistClick(e);
    }
    
    if (e.target.matches('.quick-view-btn, .quick-view-btn *')) {
      handleQuickViewClick(e);
    }
  });
  
  window.addEventListener('cartUpdated', () => {
    if (typeof updateCartCount === 'function') {
      updateCartCount();
    }
  });
  
  window.addEventListener('userUpdated', () => {
    if (typeof updateAuthLink === 'function') {
      updateAuthLink();
    }
    if (typeof updateUserDropdown === 'function') {
      updateUserDropdown();
    }
  });
  
  setupGlobalSearch();
}

function setupGlobalSearch() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  
  if (searchInput && searchBtn) {
    const debouncedSearch = debounce(performSearch, 300);
    
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (query.length >= 2) {
        debouncedSearch(query);
      }
    });
    
    searchBtn.addEventListener('click', () => {
      performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch(searchInput.value);
      }
    });
  }
}

function performSearch(query) {
  if (!query || query.trim().length < 2) return;
  
  const currentPage = window.location.pathname.split('/').pop();
  
  if (currentPage === 'index.html' || currentPage === '') {
    window.location.href = `index.html?search=${encodeURIComponent(query)}`;
  } else {
    if (typeof filterProducts === 'function') {
      filterProducts(query);
    }
  }
}

function handleAddToCartClick(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const button = e.target.closest('.add-to-cart-btn');
  if (!button) return;
  
  try {
    const productData = button.getAttribute('data-product');
    const productId = button.getAttribute('data-product-id');
    
    let product;
    if (productData) {
      product = JSON.parse(productData);
    } else if (productId) {
      product = getProductById(parseInt(productId));
    }
    
    if (!product) {
      showNotification('Product not found', 'error');
      return;
    }
    
    if (product.stock <= 0) {
      showNotification('Product is out of stock', 'error');
      return;
    }
    
    const success = addToCart(product, 1);
    if (success) {
      showNotification(`${product.name} added to cart!`, 'success');
      
      const originalText = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i> Added!';
      button.disabled = true;
      
      setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
      }, 1500);
    } else {
      showNotification('Failed to add product to cart', 'error');
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    showNotification('Error adding product to cart', 'error');
  }
}

function handleWishlistClick(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const button = e.target.closest('.wishlist-btn');
  if (!button) return;
  
  const productId = parseInt(button.getAttribute('data-id'));
  const product = getProductById(productId);
  
  if (!product) {
    showNotification('Product not found', 'error');
    return;
  }
  
  const isInWishlistNow = isInWishlist(productId);
  
  if (isInWishlistNow) {
    removeFromWishlist(productId);
    button.classList.remove('active');
    button.querySelector('i').className = 'far fa-heart';
    showNotification(`${product.name} removed from wishlist`, 'info');
  } else {
    addToWishlist(product);
    button.classList.add('active');
    button.querySelector('i').className = 'fas fa-heart';
    showNotification(`${product.name} added to wishlist!`, 'success');
  }
}

function handleQuickViewClick(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const button = e.target.closest('.quick-view-btn');
  if (!button) return;
  
  const productId = parseInt(button.getAttribute('data-product-id') || 
                            button.closest('[data-product-id]')?.getAttribute('data-product-id'));
  
  if (productId) {
    openQuickViewModal(productId);
  }
}

function openQuickViewModal(productId) {
  const product = getProductById(productId);
  if (!product) return;
  
  let modal = document.getElementById('quick-view-modal');
  if (!modal) {
    modal = createQuickViewModal();
    document.body.appendChild(modal);
  }
  
  populateQuickViewModal(modal, product);
  
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function createQuickViewModal() {
  const modal = document.createElement('div');
  modal.id = 'quick-view-modal';
  modal.className = 'quick-view-modal';
  
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeQuickViewModal()"></div>
    <div class="modal-content">
      <button class="modal-close" onclick="closeQuickViewModal()">
        <i class="fas fa-times"></i>
      </button>
      <div class="modal-body">
        <div class="product-image">
          <img id="modal-product-image" src="" alt="">
        </div>
        <div class="product-details">
          <h2 id="modal-product-name"></h2>
          <div class="product-rating" id="modal-product-rating"></div>
          <div class="product-price" id="modal-product-price"></div>
          <div class="product-description" id="modal-product-description"></div>
          <div class="product-actions">
            <button class="btn-primary add-to-cart-btn" id="modal-add-to-cart">
              <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
            <button class="btn-outline wishlist-btn" id="modal-wishlist">
              <i class="far fa-heart"></i>
            </button>
            <a class="btn-secondary" id="modal-view-details">View Details</a>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return modal;
}

function populateQuickViewModal(modal, product) {
  modal.querySelector('#modal-product-image').src = product.image;
  modal.querySelector('#modal-product-image').alt = product.name;
  modal.querySelector('#modal-product-name').textContent = product.name;
  
  const rating = product.rating || 4.5;
  modal.querySelector('#modal-product-rating').innerHTML = `
    <div class="stars">${generateStars(rating)}</div>
    <span class="rating-count">(${product.reviews || 0} reviews)</span>
  `;
  
  const priceHtml = product.originalPrice ? 
    `<span class="current-price">₦${formatPrice(product.price)}</span>
     <span class="old-price">₦${formatPrice(product.originalPrice)}</span>` :
    `<span class="current-price">₦${formatPrice(product.price)}</span>`;
  
  modal.querySelector('#modal-product-price').innerHTML = priceHtml;
  modal.querySelector('#modal-product-description').textContent = product.description;
  
  const addToCartBtn = modal.querySelector('#modal-add-to-cart');
  const wishlistBtn = modal.querySelector('#modal-wishlist');
  const viewDetailsLink = modal.querySelector('#modal-view-details');
  
  addToCartBtn.setAttribute('data-product-id', product.id);
  wishlistBtn.setAttribute('data-id', product.id);
  viewDetailsLink.href = `product.html?id=${product.id}`;
  
  if (isInWishlist(product.id)) {
    wishlistBtn.classList.add('active');
    wishlistBtn.querySelector('i').className = 'fas fa-heart';
  } else {
    wishlistBtn.classList.remove('active');
    wishlistBtn.querySelector('i').className = 'far fa-heart';
  }
}

function closeQuickViewModal() {
  const modal = document.getElementById('quick-view-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let html = '';
  for (let i = 0; i < fullStars; i++) {
    html += '<i class="fas fa-star"></i>';
  }
  if (hasHalfStar) {
    html += '<i class="fas fa-star-half-alt"></i>';
  }
  for (let i = 0; i < emptyStars; i++) {
    html += '<i class="far fa-star"></i>';
  }
  return html;
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-NG').format(price);
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function setupGlobalErrorHandlers() {
  window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
  });
  
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
  });
}

// Make functions global for onclick handlers
window.closeQuickViewModal = closeQuickViewModal;
window.openQuickViewModal = openQuickViewModal;