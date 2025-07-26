// home.js - Fixed version

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing home page...');
  
  // Wait a bit for products to load
  setTimeout(() => {
    initializeHomePage();
  }, 100);
});

function initializeHomePage() {
  console.log('Initializing home page...');
  
  // Check if products are available
  if (typeof products === 'undefined' || !products) {
    console.error('Products not found!');
    return;
  }
  
  console.log('Products available:', products.length);
  
  updateCurrentDate();
  loadFlashSalesProducts();
  loadTopSellersProducts();
  loadNewArrivalsProducts();
  setupHeroSlider();
  setupCategoryNavigation();
  setupNewsletterForm();
  startFlashSaleCountdown();
}

// Update current date
function updateCurrentDate() {
  const currentDateEl = document.getElementById('current-date');
  if (currentDateEl) {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    currentDateEl.textContent = now.toLocaleDateString('en-US', options);
  }
}

// Load flash sales products
function loadFlashSalesProducts() {
  console.log('Loading flash sales...');
  const flashSalesContainer = document.getElementById('flash-sales-home');
  
  if (!flashSalesContainer) {
    console.error('Flash sales container not found');
    return;
  }

  const flashProducts = products.filter(product => product.isFlashSale).slice(0, 6);
  console.log('Flash products found:', flashProducts.length);
  
  if (flashProducts.length === 0) {
    flashSalesContainer.innerHTML = '<p class="no-products">No flash sales available</p>';
    return;
  }

  // Updated flash sales HTML in loadFlashSalesProducts function
flashSalesContainer.innerHTML = flashProducts.map(product => `
  <div class="flash-sale-item" data-product-id="${product.id}">
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/200x180/f0f0f0/666?text=No+Image'">
      <div class="discount-badge">
        -${Math.round(((product.originalPrice - product.flashPrice) / product.originalPrice) * 100)}%
      </div>
      <div class="product-actions">
        <button class="wishlist-btn" onclick="toggleWishlist(${product.id})" title="Add to Wishlist">
          <i class="far fa-heart"></i>
        </button>
        <button class="quick-view-btn" onclick="quickViewProduct(${product.id})" title="Quick View">
          <i class="fas fa-eye"></i>
        </button>
      </div>
    </div>
    <div class="product-info">
      <h4>${product.name}</h4>
      <div class="product-rating">
        ${generateStarRating(product.rating)}
        <span class="review-count">(${product.reviews})</span>
      </div>
      <div class="product-prices">
        <span class="flash-price">₦${formatPrice(product.flashPrice)}</span>
        <span class="original-price">₦${formatPrice(product.originalPrice)}</span>
      </div>
      <div class="flash-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${Math.random() * 60 + 30}%"></div>
        </div>
        <span class="items-left">${product.stock} items left</span>
      </div>
      <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
        <i class="fas fa-shopping-cart"></i> Add to Cart
      </button>
    </div>
  </div>
`).join('');

  console.log('Flash sales loaded successfully');
}

// Load top sellers products
function loadTopSellersProducts() {
  console.log('Loading top sellers...');
  const topSellersContainer = document.getElementById('top-sellers-grid');
  
  if (!topSellersContainer) {
    console.error('Top sellers container not found');
    return;
  }

  const topSellerProducts = products.filter(product => product.isTopSeller).slice(0, 8);
  console.log('Top seller products found:', topSellerProducts.length);
  
  if (topSellerProducts.length === 0) {
    topSellersContainer.innerHTML = '<p class="no-products">No top sellers available</p>';
    return;
  }

  topSellersContainer.innerHTML = topSellerProducts.map(product => `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x300/f0f0f0/666?text=No+Image'">
        <div class="product-badge">Best Seller</div>
        <div class="product-actions">
          <button class="wishlist-btn" onclick="toggleWishlist(${product.id})">
            <i class="far fa-heart"></i>
          </button>
          <button class="quick-view-btn" onclick="quickViewProduct(${product.id})">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${formatCategory(product.category)}</div>
        <h4>${product.name}</h4>
        <div class="product-rating">
          ${generateStarRating(product.rating)}
          <span class="review-count">(${product.reviews})</span>
        </div>
        <div class="product-price">
          <span class="current-price">₦${formatPrice(product.price)}</span>
          ${product.originalPrice ? `<span class="original-price">₦${formatPrice(product.originalPrice)}</span>` : ''}
        </div>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
          <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
      </div>
    </div>
  `).join('');

  console.log('Top sellers loaded successfully');
}

// Load new arrivals products
function loadNewArrivalsProducts() {
  console.log('Loading new arrivals...');
  const newArrivalsContainer = document.getElementById('new-arrivals-grid');
  
  if (!newArrivalsContainer) {
    console.error('New arrivals container not found');
    return;
  }

  const newArrivalProducts = products.filter(product => product.isNewArrival).slice(0, 8);
  console.log('New arrival products found:', newArrivalProducts.length);
  
  if (newArrivalProducts.length === 0) {
    newArrivalsContainer.innerHTML = '<p class="no-products">No new arrivals available</p>';
    return;
  }

  newArrivalsContainer.innerHTML = newArrivalProducts.map(product => `
    <div class="product-card" data-product-id="${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x300/f0f0f0/666?text=No+Image'">
        <div class="product-badge new">New</div>
        <div class="product-actions">
          <button class="wishlist-btn" onclick="toggleWishlist(${product.id})">
            <i class="far fa-heart"></i>
          </button>
          <button class="quick-view-btn" onclick="quickViewProduct(${product.id})">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${formatCategory(product.category)}</div>
        <h4>${product.name}</h4>
        <div class="product-rating">
          ${generateStarRating(product.rating)}
          <span class="review-count">(${product.reviews})</span>
        </div>
        <div class="product-price">
          <span class="current-price">₦${formatPrice(product.price)}</span>
          ${product.originalPrice ? `<span class="original-price">₦${formatPrice(product.originalPrice)}</span>` : ''}
        </div>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
          <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
      </div>
    </div>
  `).join('');

  console.log('New arrivals loaded successfully');
}

// Flash sale countdown - FIXED
function startFlashSaleCountdown() {
  console.log('Starting countdown...');
  const countdownElement = document.getElementById('home-countdown');
  
  if (!countdownElement) {
    console.error('Countdown element not found');
    return;
  }

  // Set countdown to 12 hours from now (as shown in your image)
  const endTime = new Date().getTime() + (12 * 60 * 60 * 1000);

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = endTime - now;

    if (distance < 0) {
      countdownElement.innerHTML = "SALE ENDED";
      return;
    }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElement.innerHTML = `${hours.toString().padStart(2, '0')}h : ${minutes.toString().padStart(2, '0')}m : ${seconds.toString().padStart(2, '0')}s`;
  }

  // Update immediately
  updateCountdown();
  
  // Update every second
  const timer = setInterval(updateCountdown, 1000);
  
  console.log('Countdown started successfully');
}

// Hero slider functionality
function setupHeroSlider() {
  const slider = document.getElementById('hero-slider');
  const indicators = document.querySelectorAll('.indicator');
  
  if (!slider || indicators.length === 0) return;

  let currentSlide = 0;
  const slides = slider.querySelectorAll('.slide');
  const totalSlides = slides.length;

  if (totalSlides === 0) return;

  // Auto slide functionality
  setInterval(() => {
    showSlide((currentSlide + 1) % totalSlides);
  }, 5000);

  // Indicator click handlers
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      showSlide(index);
    });
  });

  function showSlide(index) {
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');
    
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
  }
}

// Category navigation
function setupCategoryNavigation() {
  const categoryCards = document.querySelectorAll('.category-card');
  const categoryLinks = document.querySelectorAll('.hero-categories a');

  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      if (category) {
        window.location.href = `index.html?category=${category}`;
      }
    });
  });

  categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const category = link.dataset.category;
      if (category) {
        window.location.href = `index.html?category=${category}`;
      }
    });
  });
}

// Newsletter form
function setupNewsletterForm() {
  const newsletterForm = document.getElementById('newsletter-form');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletter-email').value;
      
      if (email) {
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        newsletterForm.reset();
      } else {
        showNotification('Please enter a valid email address', 'error');
      }
    });
  }
}

// Utility functions
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let starsHTML = '';
  
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }
  
  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }
  
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }
  
  return starsHTML;
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-NG').format(price);
}

function formatCategory(category) {
  const categoryMap = {
    'electronics': 'Electronics',
    'fashion': 'Fashion',
    'home': 'Home & Living',
    'beauty': 'Beauty',
    'phones': 'Phones & Tablets',
    'computing': 'Computing',
    'gaming': 'Gaming',
    'appliances': 'Appliances',
    'baby': 'Baby Products',
    'supermarket': 'Supermarket'
  };
  return categoryMap[category] || category;
}

// Product interaction functions
function addToCart(productId) {
  console.log('Adding to cart:', productId);
  const product = products.find(p => p.id === productId);
  if (!product) {
    console.error('Product not found:', productId);
    return;
  }

  let cart = getCart();
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.flashPrice || product.price,
      image: product.image,
      quantity: 1
    });
  }

  localStorage.setItem('luxora_cart', JSON.stringify(cart));
  updateCartCount();
  showNotification(`${product.name} added to cart!`, 'success');
}

function toggleWishlist(productId) {
  console.log('Toggle wishlist:', productId);
  const product = products.find(p => p.id === productId);
  if (!product) return;

  let wishlist = getWishlist();
  const existingIndex = wishlist.findIndex(item => item.id === productId);

  if (existingIndex > -1) {
    wishlist.splice(existingIndex, 1);
    showNotification(`${product.name} removed from wishlist`, 'info');
  } else {
    wishlist.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    showNotification(`${product.name} added to wishlist!`, 'success');
  }

  localStorage.setItem('luxora_wishlist', JSON.stringify(wishlist));
}

function quickViewProduct(productId) {
  console.log('Quick view:', productId);
  window.location.href = `product.html?id=${productId}`;
}

// Helper functions
function getCart() {
  const cartStr = localStorage.getItem('luxora_cart');
  return cartStr ? JSON.parse(cartStr) : [];
}

function getWishlist() {
  const wishlistStr = localStorage.getItem('luxora_wishlist');
  return wishlistStr ? JSON.parse(wishlistStr) : [];
}

function updateCartCount() {
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;
  }
}

function showNotification(message, type = 'info') {
  console.log('Notification:', message, type);
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function getNotificationIcon(type) {
  switch (type) {
    case 'success': return 'check-circle';
    case 'error': return 'exclamation-circle';
    case 'warning': return 'exclamation-triangle';
    default: return 'info-circle';
  }
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
});