// common.js - Common utility functions and shared functionality

// Initialize common functionality when DOM is loaded
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

// Cart count update
function updateCartCount() {
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    const count = getCartItemCount();
    cartCountElement.textContent = count;
    
    // Add animation when count changes
    if (count > 0) {
      cartCountElement.parentElement.classList.add('has-items');
    } else {
      cartCountElement.parentElement.classList.remove('has-items');
    }
  }
}

// Auth link update based on user status
function updateAuthLink() {
  const authLink = document.getElementById('auth-link');
  const authText = document.getElementById('auth-text');
  
  if (authLink && authText) {
    const user = getCurrentUser();
    
    if (user) {
      authText.textContent = user.name || 'Account';
      authLink.href = user.role === 'admin' ? 'admin.html' : '#';
      
      // Add dropdown menu for logged-in users
      if (!authLink.querySelector('.user-dropdown')) {
        createUserDropdown(authLink, user);
      }
    } else {
      authText.textContent = 'Login';
      authLink.href = 'login.html';
      
      // Remove dropdown if exists
      const dropdown = authLink.querySelector('.user-dropdown');
      if (dropdown) {
        dropdown.remove();
      }
    }
  }
}

// Create user dropdown menu
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
  
  // Toggle dropdown on click
  authLink.addEventListener('click', (e) => {
    e.preventDefault();
    dropdown.classList.toggle('active');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!authLink.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });
  
  // Handle logout
  const logoutLink = dropdown.querySelector('#logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }
}

// Handle user logout
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    logout();
    clearCart(); // Optional: clear cart on logout
    showNotification('You have been logged out successfully', 'success');
    
    // Redirect to home page after a short delay
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }
}

// Search functionality
function setupSearchFunctionality() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  
  if (searchInput && searchBtn) {
    // Handle search button click
    searchBtn.addEventListener('click', performSearch);
    
    // Handle enter key press
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
    
    // Add search suggestions (debounced)
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        showSearchSuggestions(e.target.value);
      }, 300);
    });
  }
}

// Perform search
function performSearch() {
  const searchInput = document.getElementById('search-input');
  const query = searchInput?.value.trim();
  
  if (query) {
    // Store search query for results page
    localStorage.setItem('searchQuery', query);
    
    // If we're on home page, filter products
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
      filterProductsBySearch(query);
    } else {
      // Redirect to search results page
      window.location.href = `index.html?search=${encodeURIComponent(query)}`;
    }
  }
}

// Filter products by search query
function filterProductsBySearch(query) {
  const products = getProducts();
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  );
  
  // Update product grids with filtered results
  const grids = document.querySelectorAll('.product-grid');
  grids.forEach(grid => {
    if (grid) {
      renderFilteredProducts(grid, filteredProducts);
    }
  });
  
  // Show search result message
  showSearchResultMessage(query, filteredProducts.length);
}

// Show search suggestions
function showSearchSuggestions(query) {
  if (query.length < 2) return;
  
  const products = getProducts();
  const suggestions = products
    .filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5)
    .map(product => product.name);
  
  // Create or update suggestions dropdown
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
    
    // Handle suggestion clicks
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

// Newsletter form setup
function setupNewsletterForm() {
  const newsletterForms = document.querySelectorAll('#newsletter-form, .footer-newsletter');
  
  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput?.value.trim();
      
      if (email && isValidEmail(email)) {
        // Simulate newsletter subscription
        subscribeToNewsletter(email);
        
        // Show success message
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        
        // Clear form
        emailInput.value = '';
      } else {
        showNotification('Please enter a valid email address', 'error');
      }
    });
  });
}

// Newsletter subscription
function subscribeToNewsletter(email) {
  // Get existing subscribers
  let subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
  
  // Check if already subscribed
  if (!subscribers.includes(email)) {
    subscribers.push(email);
    localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
  }
  
  return true;
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Mobile menu setup
function setupMobileMenu() {
  // This would be for a mobile hamburger menu if needed
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });
  }
}

// Notification system
function initializeNotifications() {
  // Create notification container if it doesn't exist
  if (!document.getElementById('notification-container')) {
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.className = 'notification-container';
    document.body.appendChild(container);
  }
}

// Show notification
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
  
  // Add to container
  container.appendChild(notification);
  
  // Animate in
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Auto remove
  const autoRemove = setTimeout(() => {
    removeNotification(notification);
  }, duration);
  
  // Manual close
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    clearTimeout(autoRemove);
    removeNotification(notification);
  });
}

// Remove notification
function removeNotification(notification) {
  notification.classList.add('hide');
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

// Get notification icon
function getNotificationIcon(type) {
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };
  return icons[type] || icons.info;
}

// Format currency
function formatCurrency(amount, currency = '₦') {
  return `${currency}${amount.toLocaleString()}`;
}

// Format date
function formatDate(dateString, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const formatOptions = { ...defaultOptions, ...options };
  return new Date(dateString).toLocaleDateString('en-US', formatOptions);
}

// Debounce function
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

// Throttle function
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

// Smooth scroll to element
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

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Lazy load images
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

// Generate random ID
function generateRandomId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Copy to clipboard
function copyToClipboard(text) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text).then(() => {
      showNotification('Copied to clipboard!', 'success');
    });
  } else {
    // Fallback for older browsers
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

// Handle page visibility change
function handleVisibilityChange() {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Page is hidden
      console.log('Page hidden');
    } else {
      // Page is visible
      console.log('Page visible');
      // Refresh cart count and auth status
      updateCartCount();
      updateAuthLink();
    }
  });
}

// Initialize page visibility handling
handleVisibilityChange();

// Handle URL parameters
function getUrlParameters() {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}

// Update URL without page reload
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

// Initialize common functionality on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCommon);
} else {
  initCommon();
}

function getCurrentUser() {
  const userStr = localStorage.getItem('luxora_current_user');
  return userStr ? JSON.parse(userStr) : null;
}

function setCurrentUser(user) {
  localStorage.setItem('luxora_current_user', JSON.stringify(user));
}

function getCart() {
  const cartStr = localStorage.getItem('luxora_cart');
  return cartStr ? JSON.parse(cartStr) : [];
}

function showNotification(message, type = 'info') {
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

// common.js - Enhanced with image handling

// Image handling utilities
function handleImageError(img) {
  img.src = 'https://via.placeholder.com/300x300?text=No+Image';
  img.alt = 'Image not available';
}

// Add error handling to all product images
function setupImageErrorHandling() {
  document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[src*="unsplash"], img[src*="placeholder"]');
    images.forEach(img => {
      img.addEventListener('error', () => handleImageError(img));
    });
  });
}

// Initialize image error handling
setupImageErrorHandling();

// Enhanced notification function
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => {
    notification.classList.add('slide-out');
    setTimeout(() => notification.remove(), 300);
  });

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
    notification.classList.add('slide-out');
    setTimeout(() => notification.remove(), 300);
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

// Enhanced utility functions
function getCurrentUser() {
  const userStr = localStorage.getItem('luxora_current_user');
  return userStr ? JSON.parse(userStr) : null;
}

function setCurrentUser(user) {
  localStorage.setItem('luxora_current_user', JSON.stringify(user));
}

function getCart() {
  const cartStr = localStorage.getItem('luxora_cart');
  return cartStr ? JSON.parse(cartStr) : [];
}

function saveCart(cart) {
  localStorage.setItem('luxora_cart', JSON.stringify(cart));
}

function getWishlist() {
  const wishlistStr = localStorage.getItem('luxora_wishlist');
  return wishlistStr ? JSON.parse(wishlistStr) : [];
}

function saveWishlist(wishlist) {
  localStorage.setItem('luxora_wishlist', JSON.stringify(wishlist));
}

// Product utility functions
function findProductById(id) {
  return products.find(product => product.id === parseInt(id));
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

// Initialize common functionality
document.addEventListener('DOMContentLoaded', () => {
  // Setup global error handling for images
  setupImageErrorHandling();
  
  // Update cart count if element exists
  updateCartCountIfExists();
});

function updateCartCountIfExists() {
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;
  }
}

// Export functions for use in other modules
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