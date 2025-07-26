// init.js - Application initialization

document.addEventListener('DOMContentLoaded', () => {
  initializeApplication();
});

function initializeApplication() {
  console.log('Initializing LUXORA application...');

  // Initialize in proper order
  initializeStorage();
  
  // DEBUG LOG
  console.log('Products in localStorage:', getProducts().length);

  initializeProducts(); // Should now load from localStorage
  initializeAuth();
  initializeUI();
  initializeEventListeners();

  console.log('LUXORA application initialized successfully!');
}

function initializeProducts() {
  // Check if products exist in localStorage
  let storedProducts = getProducts();
  
  // If no products in storage, load from products-data.js
  if (!storedProducts || storedProducts.length === 0) {
    if (typeof products !== 'undefined' && products.length > 0) {
      console.log('Loading products into storage...');
      saveProducts(products);
      storedProducts = products;
    } else {
      console.warn('No products data found');
      return;
    }
  }
  
  // Make products globally available
  window.productsData = storedProducts;
  console.log(`${storedProducts.length} products loaded`);
}

function initializeAuth() {
  // Check if any users exist, if not create default admin
  const users = getUsers();
  if (users.length === 0) {
    const defaultAdmin = {
      id: 1,
      name: 'Admin',
      email: 'admin@luxora.com',
      password: 'admin123', // In real app, this should be hashed
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    
    addUser(defaultAdmin);
    console.log('Default admin user created');
  }
}

function initializeUI() {
  // Update cart count
  if (typeof updateCartCount === 'function') {
    updateCartCount();
  }
  
  // Update auth links
  if (typeof updateAuthLink === 'function') {
    updateAuthLink();
  }
  
  // Setup global error handlers
  setupGlobalErrorHandlers();
}

function initializeEventListeners() {
  // Global click handlers for add to cart buttons
  document.addEventListener('click', (e) => {
    if (e.target.matches('.add-to-cart, .add-to-cart *')) {
      handleAddToCartClick(e);
    }
    
    if (e.target.matches('.wishlist-btn, .wishlist-btn *')) {
      handleWishlistClick(e);
    }
    
    if (e.target.matches('.quick-view-btn, .quick-view-btn *')) {
      handleQuickViewClick(e);
    }
  });
  
  // Global search functionality
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  
  if (searchInput && searchBtn) {
    const debouncedSearch = debounce(performSearch, 300);
    
    searchInput.addEventListener('input', (e) => {
      debouncedSearch(e.target.value);
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

function handleAddToCartClick(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const button = e.target.closest('.add-to-cart');
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
    
    // Check stock
    if (product.stock <= 0) {
      showNotification('Product is out of stock', 'error');
      return;
    }
    
    // Add to cart
    const success = addToCart(product, 1);
    if (success) {
      showNotification(`${product.name} added to cart!`, 'success');
      updateCartCount();
      
      // Update button state temporarily
      const originalText = button.textContent;
      button.textContent = 'Added!';
      button.disabled = true;
      
      setTimeout(() => {
        button.textContent = originalText;
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

function performSearch(query) {
  if (!query || query.trim().length < 2) return;
  
  // Redirect to products page with search query
  const currentPage = window.location.pathname.split('/').pop();
  
  if (currentPage === 'index.html' || currentPage === '') {
    // If on homepage, redirect to products page with search
    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
  } else {
    // If on other pages, perform search on current page
    if (typeof filterProducts === 'function') {
      filterProducts(query);
    }
  }
}

function openQuickViewModal(productId) {
  const product = getProductById(productId);
  if (!product) return;
  
  // Create modal if it doesn't exist
  let modal = document.getElementById('quick-view-modal');
  if (!modal) {
    modal = createQuickViewModal();
    document.body.appendChild(modal);
  }
  
  // Populate modal with product data
  populateQuickViewModal(modal, product);
  
  // Show modal
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
            <button class="btn-primary add-to-cart" id="modal-add-to-cart">
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
  modal.querySelector('#modal-product-rating').innerHTML = `
    <div class="stars">${generateStars(product.rating || 4.5)}</div>
    <span class="rating-count">(${product.reviews || 0} reviews)</span>
  `;
  
  const priceHtml = product.originalPrice ? 
    `<span class="current-price">${formatCurrency(product.price)}</span>
     <span class="old-price">${formatCurrency(product.originalPrice)}</span>` :
    `<span class="current-price">${formatCurrency(product.price)}</span>`;
  
  modal.querySelector('#modal-product-price').innerHTML = priceHtml;
  modal.querySelector('#modal-product-description').textContent = product.description;
  
  // Setup buttons
  const addToCartBtn = modal.querySelector('#modal-add-to-cart');
  const wishlistBtn = modal.querySelector('#modal-wishlist');
  const viewDetailsLink = modal.querySelector('#modal-view-details');
  
  addToCartBtn.setAttribute('data-product-id', product.id);
  wishlistBtn.setAttribute('data-id', product.id);
  viewDetailsLink.href = `product.html?id=${product.id}`;
  
  // Update wishlist button state
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

function setupGlobalErrorHandlers() {
  // Handle unhandled errors
  window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    showNotification('An unexpected error occurred', 'error');
  });
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('An unexpected error occurred', 'error');
  });
}

// Global functions
window.closeQuickViewModal = closeQuickViewModal;
window.openQuickViewModal = openQuickViewModal;