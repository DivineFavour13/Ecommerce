document.addEventListener('DOMContentLoaded', () => {
  initializeHeader();
  setupHeaderSearch();
});

// Initialize header
function initializeHeader() {
  setupStickyHeader();
  setupUserDropdown();
  updateUserDropdown();
  updateCartCount();

  // Listen for cart updates
  window.addEventListener('cartUpdated', () => {
    updateCartCount();
  });

  // Listen for user updates
  window.addEventListener('userUpdated', () => {
    updateUserDropdown();
  });
}

// Sticky header functionality
function setupStickyHeader() {
  const header = document.getElementById('main-header');
  const body = document.body;
  
  if (!header) {
    return;
  }

  let lastScrollTop = 0;
  let isMinimized = false;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Minimize header when scrolling down, expand when scrolling up or at top
    if (scrollTop > 100 && scrollTop > lastScrollTop && !isMinimized) {
      header.classList.add('minimized');
      body.classList.add('header-minimized');
      isMinimized = true;
    } else if ((scrollTop < lastScrollTop || scrollTop <= 50) && isMinimized) {
      header.classList.remove('minimized');
      body.classList.remove('header-minimized');
      isMinimized = false;
    }

    lastScrollTop = scrollTop;
  });
  

}

// User dropdown functionality
function setupUserDropdown() {
  const dropdown = document.getElementById('user-dropdown');
  const dropdownBtn = document.getElementById('user-dropdown-btn');
  const dropdownMenu = document.getElementById('dropdown-menu');

  if (!dropdown || !dropdownBtn || !dropdownMenu) {

    return;
  }

  // Toggle dropdown
  dropdownBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropdown.classList.toggle('active');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });

  // Close dropdown with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.classList.remove('active');
    }
  });

  // Handle logout link
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
      dropdown.classList.remove('active');
    });
  }
  

}

// Update user dropdown based on current user
function updateUserDropdown() {
  const user = getCurrentUser?.();
  const userName = document.getElementById('user-name');
  const adminBadge = document.getElementById('admin-badge');
  const adminLink = document.getElementById('admin-link');
  const loginLink = document.getElementById('login-link');
  const logoutLink = document.getElementById('logout-link');

  if (!userName || !loginLink || !logoutLink) {

    return;
  }

  if (user) {
    // User is logged in
    userName.textContent = user.name || 'Account';
    loginLink.style.display = 'none';
    logoutLink.style.display = 'flex';

    if (adminBadge && adminLink) {
      if (user.role === 'admin') {
        adminBadge.style.display = 'inline-block';
        adminLink.style.display = 'flex';

        // Toggle between Admin Panel and Home based on current page
        const onAdminPage = /(^|\/)admin\.html(\?|#|$)/i.test(window.location.pathname + window.location.search + window.location.hash);
        if (onAdminPage) {
          adminLink.href = 'index.html';
          adminLink.innerHTML = '<i class="fas fa-home"></i> Home';
        } else {
          adminLink.href = 'admin.html';
          adminLink.innerHTML = '<i class="fas fa-tachometer-alt"></i> Admin Panel';
        }
      } else {
        adminBadge.style.display = 'none';
        adminLink.style.display = 'none';
      }
    }
    

  } else {
    // User is not logged in
    userName.textContent = 'Account';
    if (adminBadge) adminBadge.style.display = 'none';
    if (adminLink) adminLink.style.display = 'none';
    loginLink.style.display = 'flex';
    logoutLink.style.display = 'none';
    

  }
}

// Handle logout
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {

    
    // Clear user data
    if (typeof logout === 'function') {
      logout();
    } else {
      localStorage.removeItem('luxora_current_user');
      localStorage.removeItem('luxora_remember_user');
    }

    // Update UI
    updateUserDropdown();
    updateCartCount();

    if (typeof showNotification === 'function') {
      showNotification('Logged out successfully', 'info');
    }

    // Redirect to home
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }
}

// Update cart count - FIXED with event listening
function updateCartCount() {
  const cartCountEl = document.getElementById('cart-count');
  
  if (!cartCountEl) {

    return;
  }
  
  let cart = [];
  
  // Try to get cart from storage
  if (typeof getCart === 'function') {
    cart = getCart() || [];
  } else {
    try {
      const cartStr = localStorage.getItem('luxora_cart');
      cart = cartStr ? JSON.parse(cartStr) : [];
    } catch (error) {
      console.error('Error getting cart:', error);
      cart = [];
    }
  }
  
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  cartCountEl.textContent = totalItems;
  
  // Add visual feedback for cart updates
  if (totalItems > 0) {
    cartCountEl.parentElement.classList.add('has-items');
  } else {
    cartCountEl.parentElement.classList.remove('has-items');
  }
  

}

// Header search functionality
function setupHeaderSearch() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  if (!searchInput || !searchBtn) {

    return;
  }

  const performSearch = () => {
    const query = searchInput.value.trim();
    if (query) {

      window.location.href = `index.html?search=${encodeURIComponent(query)}`;
    }
  };

  searchBtn.addEventListener('click', performSearch);
  
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
  
  // Add search suggestions (optional enhancement)
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    
    if (query.length >= 2) {
      searchTimeout = setTimeout(() => {
        showSearchSuggestions(query);
      }, 300);
    } else {
      hideSearchSuggestions();
    }
  });
  

}

// Show search suggestions
function showSearchSuggestions(query) {
  // Remove existing suggestions
  hideSearchSuggestions();
  
  // Get products
  let products = [];
  if (typeof getProducts === 'function') {
    products = getProducts();
  } else if (window.productsData) {
    products = window.productsData;
  }
  
  if (!products || products.length === 0) return;
  
  // Filter products
  const suggestions = products
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5);
  
  if (suggestions.length === 0) return;
  
  // Create suggestions dropdown
  const suggestionsDiv = document.createElement('div');
  suggestionsDiv.id = 'search-suggestions';
  suggestionsDiv.className = 'search-suggestions';
  
  suggestionsDiv.innerHTML = suggestions.map(product => `
    <div class="suggestion-item" data-product-id="${product.id}">
      <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22%3E%3Crect fill=%22%23f0f0f0%22 width=%2240%22 height=%2240%22/%3E%3C/svg%3E'">
      <div class="suggestion-info">
        <div class="suggestion-name">${product.name}</div>
        <div class="suggestion-price">₦${formatPrice(product.price)}</div>
      </div>
    </div>
  `).join('');
  
  // Add to search bar
  const searchBar = document.querySelector('.search-bar');
  if (searchBar) {
    searchBar.appendChild(suggestionsDiv);
    
    // Handle suggestion clicks
    suggestionsDiv.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        const productId = item.getAttribute('data-product-id');
        window.location.href = `product.html?id=${productId}`;
      });
    });
  }
}

// Hide search suggestions
function hideSearchSuggestions() {
  const existingSuggestions = document.getElementById('search-suggestions');
  if (existingSuggestions) {
    existingSuggestions.remove();
  }
}

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
  const searchBar = document.querySelector('.search-bar');
  if (searchBar && !searchBar.contains(e.target)) {
    hideSearchSuggestions();
  }
});

// Helper function for price formatting
function formatPrice(price) {
  return new Intl.NumberFormat('en-NG').format(price);
}