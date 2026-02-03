// Price formatting functions
function formatPrice(price) {
  if (typeof price !== 'number') {
    price = parseFloat(price) || 0;
  }
  return price.toLocaleString();
}

function formatCurrency(price) {
  if (typeof price !== 'number') {
    price = parseFloat(price) || 0;
  }
  return `₦${price.toLocaleString()}`;
}

// Star rating generation
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let html = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    html += '<i class="fas fa-star"></i>';
  }
  
  // Half star
  if (hasHalfStar) {
    html += '<i class="fas fa-star-half-alt"></i>';
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    html += '<i class="far fa-star"></i>';
  }
  
  return html;
}

function generateStarRating(rating) {
  return generateStars(rating);
}

// URL parameter parsing
function getUrlParameters() {
  const params = {};
  const urlParams = new URLSearchParams(window.location.search);
  
  for (const [key, value] of urlParams) {
    params[key] = value;
  }
  
  return params;
}

// Notification system
function showNotification(message, type = 'info', duration = 5000) {
  // Create notification container if it doesn't exist
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    container.className = 'notification-container';
    document.body.appendChild(container);
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  // Notification icon based on type
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };
  
  notification.innerHTML = `
    <div class="notification-content">
      <i class="${icons[type] || icons.info}"></i>
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  // Add to container
  container.appendChild(notification);
  
  // Auto-remove after duration
  if (duration > 0) {
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, duration);
  }
  
  // Add click to close
  notification.addEventListener('click', () => {
    notification.remove();
  });
  
  return notification;
}

// Form validation functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password && password.length >= 6;
}

function validatePasswordStrength(password) {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const score = [minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar]
    .filter(Boolean).length;
  
  return {
    score,
    isValid: score >= 3,
    strength: score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong',
    requirements: {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    }
  };
}

// Credit card validation
function validateCreditCard(cardNumber) {
  // Remove spaces and non-digits
  const cleaned = cardNumber.replace(/\D/g, '');
  
  // Check length
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i));
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

function validateExpiryDate(expiry) {
  const cleaned = expiry.replace(/\D/g, '');
  if (cleaned.length !== 4) return false;
  
  const month = parseInt(cleaned.substring(0, 2));
  const year = parseInt('20' + cleaned.substring(2, 4));
  
  if (month < 1 || month > 12) return false;
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  return year > currentYear || (year === currentYear && month >= currentMonth);
}

function validateCVV(cvv) {
  const cleaned = cvv.replace(/\D/g, '');
  return cleaned.length >= 3 && cleaned.length <= 4;
}

// Search and filter utilities
function searchProducts(products, query) {
  if (!query || !query.trim()) return products;
  
  const searchTerm = query.toLowerCase().trim();
  
  return products.filter(product => {
    return (
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm)
    );
  });
}

function filterProductsByCategory(products, category) {
  if (!category || category === 'all') return products;
  return products.filter(product => product.category === category);
}

function sortProducts(products, sortBy) {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'newest':
      return sorted.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    default:
      return sorted;
  }
}

// Image utilities
function handleImageError(img) {
  const width = img.width || 400;
  const height = img.height || 400;
  img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect fill='%23f0f0f0' width='${width}' height='${height}'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='12' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E`;
  img.alt = 'Image not available';
}

//SVG placeholder helper
function getSVGPlaceholder(width = 400, height = 400) {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect fill='%23f0f0f0' width='${width}' height='${height}'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='12' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E`;
}

// Debounce function for search
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

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Safe JSON parse
function safeJSONParse(str, defaultValue = null) {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error('JSON parse error:', error);
    return defaultValue;
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Redirect with message helper
function redirectWithMessage(message, type = 'info', delay = 2000, url = 'index.html') {
  if (message) {
    showNotification(message, type);
  }
  setTimeout(() => {
    window.location.href = url;
  }, delay);
}

// Export all functions for global use
window.formatPrice = formatPrice;
window.formatCurrency = formatCurrency;
window.generateStars = generateStars;
window.generateStarRating = generateStarRating;
window.getUrlParameters = getUrlParameters;
window.showNotification = showNotification;
window.validateEmail = validateEmail;
window.validatePassword = validatePassword;
window.validatePasswordStrength = validatePasswordStrength;
window.validateCreditCard = validateCreditCard;
window.validateExpiryDate = validateExpiryDate;
window.validateCVV = validateCVV;
window.searchProducts = searchProducts;
window.filterProductsByCategory = filterProductsByCategory;
window.sortProducts = sortProducts;
window.handleImageError = handleImageError;
window.debounce = debounce;
window.generateId = generateId;
window.safeJSONParse = safeJSONParse;
window.escapeHtml = escapeHtml;