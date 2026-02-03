// common.js - FIXED with all duplicates removed

document.addEventListener('DOMContentLoaded', () => {
  initCommon();
});

function initCommon() {
  updateCartCount();
  updateAuthLink();
  setupSearchFunctionality();
  setupNewsletterForm();
  setupMobileMenu();
  initializeNotifications();
}

// ==================== CART COUNT ====================
function updateCartCount() {
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    const count = getCartItemCount();
    cartCountElement.textContent = count;
    
    if (count > 0) {
      cartCountElement.parentElement.classList.add('has-items');
    } else {
      cartCountElement.parentElement.classList.remove('has-items');
    }
  }
}

// ==================== AUTH LINK ====================
function updateAuthLink() {
  const authLink = document.getElementById('auth-link');
  const authText = document.getElementById('auth-text');
  
  if (authLink && authText) {
    const user = getCurrentUser();
    
    if (user) {
      authText.textContent = user.name || 'Account';
      authLink.href = user.role === 'admin' ? 'admin.html' : '#';
      
      if (!authLink.querySelector('.user-dropdown')) {
        createUserDropdown(authLink, user);
      }
    } else {
      authText.textContent = 'Login';
      authLink.href = 'login.html';
      
      const dropdown = authLink.querySelector('.user-dropdown');
      if (dropdown) {
        dropdown.remove();
      }
    }
  }
}

// ==================== USER DROPDOWN ====================
function createUserDropdown(authLink, user) {
  const dropdown = document.createElement('div');
  dropdown.className = 'user-dropdown';
  dropdown.innerHTML = `
    <div class="dropdown-menu">
      ${user.role === 'admin' ? '<a href="admin.html"><i class="fas fa-cog"></i> Admin Panel</a>' : ''}
      <a href="#" id="my-orders"><i class="fas fa-shopping-bag"></i> My Orders</a>
      <a href="#" id="my-wishlist"><i class="fas fa-heart"></i> Wishlist</a>
      <a href="#" id="my-account"><i class="fas fa-user"></i> Account</a>
      <div class="dropdown-divider"></div>
      <a href="#" id="logout-link"><i class="fas fa-sign-out-alt"></i> Logout</a>
    </div>
  `;
  
  authLink.appendChild(dropdown);
  
  authLink.addEventListener('click', (e) => {
    e.preventDefault();
    dropdown.classList.toggle('active');
  });
  
  document.addEventListener('click', (e) => {
    if (!authLink.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });
  
  const logoutLink = dropdown.querySelector('#logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }
}

// ==================== LOGOUT ====================
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    logout();
    clearCart();
    showNotification('You have been logged out successfully', 'success');
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }
}

// ==================== SEARCH ====================
function setupSearchFunctionality() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  
  if (searchInput && searchBtn) {
    searchBtn.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
    
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        showSearchSuggestions(e.target.value);
      }, 300);
    });
  }
}

function performSearch() {
  const searchInput = document.getElementById('search-input');
  const query = searchInput?.value.trim();
  
  if (query) {
    localStorage.setItem('searchQuery', query);
    
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
      filterProductsBySearch(query);
    } else {
      window.location.href = `index.html?search=${encodeURIComponent(query)}`;
    }
  }
}

function filterProductsBySearch(query) {
  const products = getProducts();
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );
  
  const grids = document.querySelectorAll('.product-grid');
  grids.forEach(grid => {
    if (grid) {
      renderFilteredProducts(grid, filteredProducts);
    }
  });
  
  showSearchResultMessage(query, filteredProducts.length);
}

function showSearchSuggestions(query) {
  if (query.length < 2) return;
  
  const products = getProducts();
  const suggestions = products
    .filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5)
    .map(product => product.name);
  
  let suggestionsEl = document.getElementById('search-suggestions');
  if (!suggestionsEl) {
    suggestionsEl = document.createElement('div');
    suggestionsEl.id = 'search-suggestions';
    suggestionsEl.className = 'search-suggestions';
    document.querySelector('.search-bar').appendChild(suggestionsEl);
  }
  
  if (suggestions.length > 0) {
    suggestionsEl.innerHTML = suggestions
      .map(suggestion => `<div class="suggestion-item">${suggestion}</div>`)
      .join('');
    
    suggestionsEl.style.display = 'block';
    
    suggestionsEl.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        document.getElementById('search-input').value = item.textContent;
        suggestionsEl.style.display = 'none';
        performSearch();
      });
    });
  } else {
    suggestionsEl.style.display = 'none';
  }
}

// ==================== NEWSLETTER ====================
function setupNewsletterForm() {
  const newsletterForms = document.querySelectorAll('#newsletter-form, .footer-newsletter');
  
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput?.value.trim();
      
      if (email && isValidEmail(email)) {
        subscribeToNewsletter(email);
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        emailInput.value = '';
      } else {
        showNotification('Please enter a valid email address', 'error');
      }
    });
  });
}

function subscribeToNewsletter(email) {
  let subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
  
  if (!subscribers.includes(email)) {
    subscribers.push(email);
    localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
  }
  
  return true;
}

// ==================== MOBILE MENU ====================
function setupMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });
  }
}

// ==================== NOTIFICATIONS ====================
function initializeNotifications() {
  if (!document.getElementById('notification-container')) {
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.className = 'notification-container';
    document.body.appendChild(container);
  }
}

function showNotification(message, type = 'info', duration = 5000) {
  const container = document.getElementById('notification-container');
  if (!container) return;
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const icon = getNotificationIcon(type);
  notification.innerHTML = `
    <div class="notification-content">
      <i class="${icon}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close">&times;</button>
  `;
  
  container.appendChild(notification);
  
  setTimeout(() => notification.classList.add('show'), 100);
  
  const autoRemove = setTimeout(() => {
    removeNotification(notification);
  }, duration);
  
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    clearTimeout(autoRemove);
    removeNotification(notification);
  });
}

function removeNotification(notification) {
  notification.classList.add('hide');
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

function getNotificationIcon(type) {
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };
  return icons[type] || icons.info;
}

// ==================== UTILITIES ====================
function formatCurrency(amount, currency = '₦') {
  return `${currency}${amount.toLocaleString()}`;
}

function formatDate(dateString, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const formatOptions = { ...defaultOptions, ...options };
  return new Date(dateString).toLocaleDateString('en-US', formatOptions);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function scrollToElement(elementId, offset = 0) {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function setupLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

function generateRandomId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text).then(() => {
      showNotification('Copied to clipboard!', 'success');
    });
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      showNotification('Copied to clipboard!', 'success');
    } catch (err) {
      showNotification('Failed to copy to clipboard', 'error');
    }
    
    document.body.removeChild(textArea);
  }
}

function handleVisibilityChange() {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Page is hidden
    } else {
      // Page is visible - refresh cart count and auth status
      updateCartCount();
      updateAuthLink();
    }
  });
}

handleVisibilityChange();

function getUrlParameters() {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}

function updateUrl(params) {
  const url = new URL(window.location);
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      url.searchParams.set(key, params[key]);
    } else {
      url.searchParams.delete(key);
    }
  });
  window.history.pushState({}, '', url);
}
function handleImageError(img) {
  const width = img.width || 300;
  const height = img.height || 300;
  img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect fill='%23f0f0f0' width='${width}' height='${height}'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='12' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E`;
  img.alt = 'Image not available';
}

function setupImageErrorHandling() {
  document.addEventListener('DOMContentLoaded', () => {
    // Attach error handler to all images (more robust)
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('error', () => handleImageError(img));
    });
  });
}

setupImageErrorHandling();

// Export functions for onclick handlers (keep rest of your common.js exports)
window.CommonUtils = {
  updateCartCount,
  updateAuthLink,
  showNotification,
  formatCurrency,
  formatDate,
  debounce,
  throttle,
  scrollToElement,
  isInViewport,
  generateRandomId,
  copyToClipboard,
  getUrlParameters,
  updateUrl,
  isValidEmail
};