document.addEventListener('DOMContentLoaded', function() {
  initializeHomePage();
});

function initializeHomePage() {
  // FIXED: Wait for products to be available without arbitrary timeout
  const checkProducts = () => {
    let availableProducts = getAvailableProducts();
    
    if (!availableProducts || availableProducts.length === 0) {
      // If products aren't ready, wait a bit and try again (max 5 attempts)
      if (!checkProducts.attempts) checkProducts.attempts = 0;
      checkProducts.attempts++;
      
      if (checkProducts.attempts < 5) {
        setTimeout(checkProducts, 50);
        return;
      } else {
        showNoProductsMessage();
        return;
      }
    }
    
    window.productsData = availableProducts;
    
    initializeAllSections();
  };
  
  checkProducts();
}

function getAvailableProducts() {
  // Try global products first
  if (typeof products !== 'undefined' && products && products.length > 0) {
    return products;
  }
  
  // Try window.productsData
  if (window.productsData && window.productsData.length > 0) {
    return window.productsData;
  }
  
  // Try localStorage
  if (typeof getProducts === 'function') {
    return getProducts();
  }
  
  return [];
}

function initializeAllSections() {
  updateCurrentDate();
  loadFlashSalesProducts();
  loadTopSellersProducts();
  loadNewArrivalsProducts();
  loadBrandPartners();
  setupHeroSlider();
  setupCategoryNavigation();
  setupNewsletterForm();
  startFlashSaleCountdown();
  setupProductCardEvents && setupProductCardEvents();
}

function showNoProductsMessage() {
  const sections = [
    'flash-sales-home',
    'top-sellers-grid',
    'new-arrivals-grid'
  ];
  
  sections.forEach(id => {
    const container = document.getElementById(id);
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #666;">
          <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: #FF6B35; margin-bottom: 1rem;"></i>
          <p>No products available. Please refresh the page.</p>
        </div>
      `;
    }
  });
}

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

function loadFlashSalesProducts() {
  const flashSalesContainer = document.getElementById('flash-sales-home');
  
  if (!flashSalesContainer) return;

  const products = window.productsData || getProducts();
  const flashProducts = products.filter(product => product.isFlashSale).slice(0, 8);
  
  if (flashProducts.length === 0) {
    flashSalesContainer.innerHTML = '<p class="no-products">No flash sales available</p>';
    return;
  }

  flashSalesContainer.innerHTML = flashProducts.map(product => {
    const discount = product.originalPrice ? 
      Math.round(((product.originalPrice - (product.flashPrice || product.price)) / product.originalPrice) * 100) : 
      0;
    
    return `
      <div class="flash-sale-item" data-product-id="${product.id}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2212%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'">
          ${discount > 0 ? `<div class="discount-badge">-${discount}%</div>` : ''}
          <div class="product-actions">
            <button class="wishlist-btn" data-id="${product.id}" title="Add to Wishlist">
              <i class="far fa-heart"></i>
            </button>
            <button class="quick-view-btn" data-product-id="${product.id}" title="Quick View">
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </div>
        <div class="product-info">
          <h4>${truncateText(product.name, 50)}</h4>
          <div class="product-rating">
            ${generateStarRating(product.rating || 4.5)}
            <span class="review-count">(${product.reviews || 0})</span>
          </div>
          <div class="product-prices">
            <span class="flash-price">₦${formatPrice(product.flashPrice || product.price)}</span>
            ${product.originalPrice ? `<span class="original-price">₦${formatPrice(product.originalPrice)}</span>` : ''}
          </div>
          <div class="flash-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${Math.random() * 60 + 30}%"></div>
            </div>
            <span class="items-left">${product.stock} items left</span>
          </div>
          <button class="add-to-cart-btn" data-product-id="${product.id}">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function loadTopSellersProducts() {
  const topSellersContainer = document.getElementById('top-sellers-grid');
  
  if (!topSellersContainer) return;

  const products = window.productsData || getProducts();
  const topSellerProducts = products.filter(product => product.isTopSeller).slice(0, 8);
  
  if (topSellerProducts.length === 0) {
    topSellersContainer.innerHTML = '<p class="no-products">No top sellers available</p>';
    return;
  }

  topSellersContainer.innerHTML = topSellerProducts.map(product => {
    const discount = product.originalPrice ? 
      Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 
      0;
      
    return `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2212%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'">
          <div class="product-badge">Best Seller</div>
          ${discount > 0 ? `<div class="discount-badge">-${discount}%</div>` : ''}
          <div class="product-actions">
            <button class="wishlist-btn" data-id="${product.id}">
              <i class="far fa-heart"></i>
            </button>
            <button class="quick-view-btn" data-product-id="${product.id}">
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </div>
        <div class="product-info">
          <div class="product-category">${formatCategory(product.category)}</div>
          <h4>${truncateText(product.name, 60)}</h4>
          <div class="product-rating">
            ${generateStarRating(product.rating || 4.5)}
            <span class="review-count">(${product.reviews || 0})</span>
          </div>
          <div class="product-price">
            <span class="current-price">₦${formatPrice(product.price)}</span>
            ${product.originalPrice ? `<span class="original-price">₦${formatPrice(product.originalPrice)}</span>` : ''}
          </div>
          <button class="add-to-cart-btn" data-product-id="${product.id}">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function loadNewArrivalsProducts() {
  const newArrivalsContainer = document.getElementById('new-arrivals-grid');
  
  if (!newArrivalsContainer) return;

  const products = window.productsData || getProducts();
  const newArrivalProducts = products.filter(product => product.isNewArrival).slice(0, 8);
  
  if (newArrivalProducts.length === 0) {
    newArrivalsContainer.innerHTML = '<p class="no-products">No new arrivals available</p>';
    return;
  }

  newArrivalsContainer.innerHTML = newArrivalProducts.map(product => {
    const discount = product.originalPrice ? 
      Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 
      0;
      
    return `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2212%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'">
          <div class="product-badge new">New</div>
          ${discount > 0 ? `<div class="discount-badge">-${discount}%</div>` : ''}
          <div class="product-actions">
            <button class="wishlist-btn" data-id="${product.id}">
              <i class="far fa-heart"></i>
            </button>
            <button class="quick-view-btn" data-product-id="${product.id}">
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </div>
        <div class="product-info">
          <div class="product-category">${formatCategory(product.category)}</div>
          <h4>${truncateText(product.name, 60)}</h4>
          <div class="product-rating">
            ${generateStarRating(product.rating || 4.5)}
            <span class="review-count">(${product.reviews || 0})</span>
          </div>
          <div class="product-price">
            <span class="current-price">₦${formatPrice(product.price)}</span>
            ${product.originalPrice ? `<span class="original-price">₦${formatPrice(product.originalPrice)}</span>` : ''}
          </div>
          <button class="add-to-cart-btn" data-product-id="${product.id}">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function loadBrandPartners() {
  const wrap = document.querySelector('.brand-partners .brands');
  if (!wrap) return;

  const brands = [
    'images/Apple.png',
    'images/Nike.png',
    'images/brands/brand-3.png',
    'images/brands/brand-4.png',
    'images/brands/brand-5.png',
    'images/brands/brand-6.png'
  ];

  const placeholder = "data:image/svg+xml;utf8,"
    + "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='80'>"
    + "<rect width='100%' height='100%' fill='%23f3f3f3'/>"
    + "<text x='50%' y='50%' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%23bdbdbd'>Brand</text>"
    + "</svg>";

  wrap.innerHTML = brands.map(src => {
    return `<div class="brand"><img src="${src}" alt="brand" onerror="this.onerror=null;this.src='${placeholder}'"></div>`;
  }).join('');
}

function startFlashSaleCountdown() {
  const countdownElement = document.getElementById('home-countdown');
  
  if (!countdownElement) return;

  // Check if we have a stored end time
  let endTime = localStorage.getItem('flash_sale_end_time');
  
  if (!endTime) {
    // Set countdown to 12 hours from now
    endTime = new Date().getTime() + (12 * 60 * 60 * 1000);
    localStorage.setItem('flash_sale_end_time', endTime);
  } else {
    endTime = parseInt(endTime);
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = endTime - now;

    if (distance < 0) {
      countdownElement.innerHTML = "SALE ENDED";
      // Reset for next sale
      localStorage.removeItem('flash_sale_end_time');
      return;
    }

    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElement.innerHTML = `${hours.toString().padStart(2, '0')}h : ${minutes.toString().padStart(2, '0')}m : ${seconds.toString().padStart(2, '0')}s`;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

function setupHeroSlider() {
  const slider = document.getElementById('hero-slider');
  const indicators = document.querySelectorAll('.indicator');
  
  if (!slider || indicators.length === 0) return;

  let currentSlide = 0;
  const slides = slider.querySelectorAll('.slide');
  const totalSlides = slides.length;

  if (totalSlides === 0) return;

  const autoSlide = setInterval(() => {
    showSlide((currentSlide + 1) % totalSlides);
  }, 5000);

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      clearInterval(autoSlide);
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

function setupNewsletterForm() {
  const newsletterForm = document.getElementById('newsletter-form');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletter-email').value;
      
      if (email && isValidEmail(email)) {
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        newsletterForm.reset();
      } else {
        showNotification('Please enter a valid email address', 'error');
      }
    });
  }
}

function setupProductCardEvents() {
  document.body.addEventListener('click', function (e) {
    const target = e.target;

    const addToCartBtn = target.closest && target.closest('.add-to-cart-btn');
    if (addToCartBtn) {
      const id = addToCartBtn.dataset.productId;
      if (id) {
        if (typeof addToCart === 'function') addToCart(id);
        else if (typeof addProductToCart === 'function') addProductToCart(id);
        else {
          try {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existing = cart.find(i => i.id === id);
            if (existing) existing.qty = (existing.qty || 1) + 1;
            else cart.push({ id, qty: 1 });
            localStorage.setItem('cart', JSON.stringify(cart));
            if (typeof updateCartCount === 'function') updateCartCount();
          } catch (err) {}
        }
      }
      e.preventDefault();
      return;
    }

    const wishlistBtn = target.closest && target.closest('.wishlist-btn');
    if (wishlistBtn) {
      const id = wishlistBtn.dataset.id || wishlistBtn.dataset.productId;
      if (id) {
        if (typeof toggleWishlist === 'function') toggleWishlist(id);
        else {
          const key = 'wishlist';
          const list = JSON.parse(localStorage.getItem(key) || '[]');
          const exists = list.includes(id);
          if (exists) localStorage.setItem(key, JSON.stringify(list.filter(x => x !== id)));
          else { list.push(id); localStorage.setItem(key, JSON.stringify(list)); }
        }
      }
      e.preventDefault();
      return;
    }

    const quickViewBtn = target.closest && target.closest('.quick-view-btn');
    if (quickViewBtn) {
      const id = quickViewBtn.dataset.productId;
      if (id) {
        if (typeof openQuickView === 'function') openQuickView(id);
        else if (typeof openProductModal === 'function') openProductModal(id);
        else window.location.href = `product.html?id=${encodeURIComponent(id)}`;
      }
      e.preventDefault();
      return;
    }

    const productCard = target.closest && target.closest('.product-card, .flash-sale-item');
    if (productCard) {
      const id = productCard.dataset.productId;
      if (id) window.location.href = `product.html?id=${encodeURIComponent(id)}`;
    }
  });

  document.querySelectorAll('.product-image img, .brand img').forEach(img => {
    img.addEventListener('error', function () {
      if (this.dataset._errored) return;
      this.dataset._errored = '1';
      this.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='150'%3E%3Crect width='100%25' height='100%25' fill='%23f3f3f3'/%3E%3Ctext x='50%25' y='50%25' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%23bdbdbd'%3ENo Image%3C/text%3E%3C/svg%3E";
    }, { passive: true });
  });
}

// Utility functions
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
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

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}