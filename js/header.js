// header.js - Enhanced sticky header functionality

document.addEventListener('DOMContentLoaded', () => {
  initializeHeader();
});

function initializeHeader() {
  setupStickyHeader();
  setupUserDropdown();
  updateUserDropdown();
  updateCartCount();

  window.addEventListener('cartUpdated', () => {
    updateCartCount();
  });
}

window.addEventListener('cartUpdated', () => {
  updateCartCount();
});

// Sticky header functionality
function setupStickyHeader() {
  const header = document.getElementById('main-header');
  const body = document.body;
  let lastScrollTop = 0;
  let isMinimized = false;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Minimize header when scrolling down, expand when scrolling up or at top
    if (scrollTop > 100 && scrollTop > lastScrollTop && !isMinimized) {
      // Scrolling down
      header.classList.add('minimized');
      body.classList.add('header-minimized');
      isMinimized = true;
    } else if ((scrollTop < lastScrollTop || scrollTop <= 50) && isMinimized) {
      // Scrolling up or at top
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

  // Close dropdown when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.classList.remove('active');
    }
  });

  // Handle dropdown item clicks
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
      dropdown.classList.remove('active');
    });
  }
}

// Update user dropdown based on authentication state
function updateUserDropdown() {
  const user = getCurrentUser();
  const userName = document.getElementById('user-name');
  const adminBadge = document.getElementById('admin-badge');
  const adminLink = document.getElementById('admin-link');
  const loginLink = document.getElementById('login-link');
  const logoutLink = document.getElementById('logout-link');

  if (user) {
    // User is logged in
    userName.textContent = user.name || 'Account';
    loginLink.style.display = 'none';
    logoutLink.style.display = 'flex';
    
    if (user.role === 'admin') {
      adminBadge.style.display = 'inline-block';
      adminLink.style.display = 'flex';
    } else {
      adminBadge.style.display = 'none';
      adminLink.style.display = 'none';
    }
  } else {
    // User is not logged in
    userName.textContent = 'Account';
    adminBadge.style.display = 'none';
    adminLink.style.display = 'none';
    loginLink.style.display = 'flex';
    logoutLink.style.display = 'none';
  }
}

// Handle logout
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    // Clear user data
    localStorage.removeItem('luxora_current_user');
    localStorage.removeItem('luxora_remember_user');
    
    // Update UI
    updateUserDropdown();
    updateCartCount();
    
    showNotification('Logged out successfully', 'info');
    
    // Redirect to home page
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }
}

// Update cart count in header
function updateCartCount() {
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;
  }
}

// Search functionality
function setupHeaderSearch() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  if (searchInput && searchBtn) {
    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `index.html?search=${encodeURIComponent(query)}`;
      }
    });

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `index.html?search=${encodeURIComponent(query)}`;
        }
      }
    });
  }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', () => {
  setupHeaderSearch();
});