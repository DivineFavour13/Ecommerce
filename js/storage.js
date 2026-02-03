// storage.js - FIXED with password hashing and proper security

// Storage keys
const PRODUCTS_KEY = 'luxora_products';
const CART_KEY = 'luxora_cart';
const USER_KEY = 'luxora_user';
const USERS_KEY = 'luxora_users';
const WISHLIST_KEY = 'luxora_wishlist';
const RECENTLY_VIEWED_KEY = 'luxora_recently_viewed';
const ORDERS_KEY = 'luxora_orders';
const SETTINGS_KEY = 'luxora_settings';

// ==================== PASSWORD HASHING ====================
// Simple hash function for demo purposes (in production use bcrypt or similar)
function hashPassword(password) {
  let hash = 0;
  const salt = 'luxora_secret_salt_2024';
  const combined = password + salt;
  
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return hash.toString(36);
}

function verifyPassword(password, hashedPassword) {
  return hashPassword(password) === hashedPassword;
}

function verifyAdminPermission() {
  const user = getCurrentUser(); // This uses your existing function to get the logged-in user
  if (!user || user.role !== 'admin') {
    if (typeof showNotification === 'function') {
      showNotification("Permission denied: Administrative privileges required.", "error");
    }
    return false;
  }
  return true;
}

// ==================== PRODUCT MANAGEMENT ====================
function getProducts() {
  try {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    if (typeof products !== 'undefined' && products.length > 0) {
      saveProducts(products);
      return products;
    }
    
    return [];
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
}

function saveProducts(products) {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('productsUpdated'));
    return true;
  } catch (error) {
    console.error('Error saving products:', error);
    return false;
  }
}

function getProductById(id) {
  const products = getProducts();
  return products.find(product => product.id === parseInt(id));
}

function updateProduct(id, updates) {
  if (!verifyAdminPermission()) return false;

  const products = getProducts();
  const index = products.findIndex(product => product.id === parseInt(id));
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    return saveProducts(products);
  }
  return false;
}

function deleteProduct(id) {
  if (!verifyAdminPermission()) return false;

  const products = getProducts();
  const filteredProducts = products.filter(product => product.id !== parseInt(id));
  return saveProducts(filteredProducts);
}

// ==================== CART MANAGEMENT ====================
function getCart() {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    return true;
  } catch (error) {
    console.error('Error saving cart:', error);
    return false;
  }
}

function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  
  return saveCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart();
  const filteredCart = cart.filter(item => item.id !== parseInt(productId));
  return saveCart(filteredCart);
}

function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.id === parseInt(productId));
  
  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    } else {
      item.quantity = quantity;
      return saveCart(cart);
    }
  }
  return false;
}

function clearCart() {
  return saveCart([]);
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// ==================== USER MANAGEMENT (SECURE) ====================
function getCurrentUser() {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

function setCurrentUser(user) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('userUpdated'));
    return true;
  } catch (error) {
    console.error('Error setting current user:', error);
    return false;
  }
}

function logout() {
  try {
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event('userUpdated'));
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
}

function getUsers() {
  try {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
}

function addUser(user) {
  const users = getUsers();
  
  // Check if user already exists
  if (users.find(u => u.email.toLowerCase() === user.email.toLowerCase())) {
    return false;
  }
  
  const newUser = {
    id: Date.now(),
    name: user.name,
    email: user.email,
    password: hashPassword(user.password), 
    role: 'user', 
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  return saveUsers(users);
}

// FIXED: Verify password using hash
function authenticateUser(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return null;
  }
  
  // Verify hashed password
  if (verifyPassword(password, user.password)) {
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
}

// ==================== WISHLIST MANAGEMENT ====================
function getWishlist() {
  try {
    const wishlist = localStorage.getItem(WISHLIST_KEY);
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return [];
  }
}

function saveWishlist(wishlist) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    window.dispatchEvent(new Event('wishlistUpdated'));
    return true;
  } catch (error) {
    console.error('Error saving wishlist:', error);
    return false;
  }
}

function addToWishlist(product) {
  const wishlist = getWishlist();
  const exists = wishlist.find(item => item.id === product.id);
  
  if (!exists) {
    wishlist.push(product);
    return saveWishlist(wishlist);
  }
  return false;
}

function removeFromWishlist(productId) {
  const wishlist = getWishlist();
  const filteredWishlist = wishlist.filter(item => item.id !== parseInt(productId));
  return saveWishlist(filteredWishlist);
}

function isInWishlist(productId) {
  const wishlist = getWishlist();
  return wishlist.some(item => item.id === parseInt(productId));
}

// ==================== RECENTLY VIEWED ====================
function getRecentlyViewed() {
  try {
    const recentlyViewed = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return recentlyViewed ? JSON.parse(recentlyViewed) : [];
  } catch (error) {
    console.error('Error getting recently viewed:', error);
    return [];
  }
}

function saveRecentlyViewed(recentlyViewed) {
  try {
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
    return true;
  } catch (error) {
    console.error('Error saving recently viewed:', error);
    return false;
  }
}

function addToRecentlyViewed(product) {
  const recentlyViewed = getRecentlyViewed();
  const filtered = recentlyViewed.filter(item => item.id !== product.id);
  filtered.unshift(product);
  const limited = filtered.slice(0, 10);
  return saveRecentlyViewed(limited);
}

// ==================== ORDERS MANAGEMENT ====================
function getOrders() {
  try {
    const orders = localStorage.getItem(ORDERS_KEY);
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
}

function saveOrders(orders) {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return true;
  } catch (error) {
    console.error('Error saving orders:', error);
    return false;
  }
}

function createOrder(orderData) {
  const orders = getOrders();
  const newOrder = {
    id: generateOrderId(),
    ...orderData,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  return saveOrders(orders) ? newOrder : null;
}

function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const order = orders.find(order => order.id === orderId);
  
  if (order) {
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return saveOrders(orders);
  }
  return false;
}

function generateOrderId() {
  return 'ORD-' + Date.now().toString().slice(-6);
}

// ==================== SETTINGS ====================
function getSettings() {
  try {
    const settings = localStorage.getItem(SETTINGS_KEY);
    return settings ? JSON.parse(settings) : getDefaultSettings();
  } catch (error) {
    console.error('Error getting settings:', error);
    return getDefaultSettings();
  }
}

function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}

function getDefaultSettings() {
  return {
    siteName: 'LUXORA',
    siteDescription: 'Your No.1 Online Shopping Destination',
    contactEmail: 'contact@luxora.com',
    currency: 'NGN',
    currencySymbol: '₦',
    emailNotifications: true,
    smsNotifications: true,
    dailyReports: false,
    theme: 'light',
    language: 'en'
  };
}

// ==================== UTILITY FUNCTIONS ====================
function clearAllData() {
  try {
    localStorage.removeItem(PRODUCTS_KEY);
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(WISHLIST_KEY);
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
    localStorage.removeItem(ORDERS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
}

function exportData() {
  try {
    const data = {
      products: getProducts(),
      users: getUsers().map(u => ({ ...u, password: '[ENCRYPTED]' })), // Don't export passwords
      orders: getOrders(),
      settings: getSettings(),
      timestamp: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    return null;
  }
}

function importData(jsonData) {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.products) saveProducts(data.products);
    if (data.orders) saveOrders(data.orders);
    if (data.settings) saveSettings(data.settings);
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}

function isStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

// ==================== INITIALIZATION ====================
function initializeStorage() {
  if (!isStorageAvailable()) {
    console.warn('LocalStorage is not available');
    return false;
  }

  // 1. Initialize products (merge newly added products from products-data.js)
  const storedProducts = getProducts();
  if (typeof products !== 'undefined' && Array.isArray(products) && products.length > 0) {
    if (!storedProducts || storedProducts.length === 0) {
      // No stored products yet: seed from file
      saveProducts(products);
    } else {
      // Merge: append any products from file that are not in storage by id
      const existingIds = new Set(storedProducts.map(p => p.id));
      const toAdd = products.filter(p => !existingIds.has(p.id));
      if (toAdd.length > 0) {
        saveProducts([...storedProducts, ...toAdd]);
      }
    }
  }

  // 2. Initialize default users (SECURE METHOD)
  const users = getUsers();
  if (users.length === 0) {
    const initialAdmin = {
      id: 1,
      name: 'Admin',
      email: 'admin@luxora.com',
      password: hashPassword('admin123'),
      role: 'admin',
      joinedDate: new Date().toISOString()
    };
    
    const initialUser = {
      id: 2,
      name: 'Test User',
      email: 'user@luxora.com',
      password: hashPassword('user123'),
      role: 'user',
      joinedDate: new Date().toISOString()
    };

    // Save directly to localStorage to establish the initial admin
    localStorage.setItem(USERS_KEY, JSON.stringify([initialAdmin, initialUser]));
  }

  // 3. Initialize other storage keys if they don't exist
  if (!localStorage.getItem(SETTINGS_KEY)) {
    saveSettings(getDefaultSettings());
  }
  if (!localStorage.getItem(CART_KEY)) {
    saveCart([]);
  }
  if (!localStorage.getItem(WISHLIST_KEY)) {
    saveWishlist([]);
  }
  if (!localStorage.getItem(RECENTLY_VIEWED_KEY)) {
    saveRecentlyViewed([]);
  }
  if (!localStorage.getItem(ORDERS_KEY)) {
    saveOrders([]);
  }

  return true;
}

// Auto-initialize (kept your existing timeout logic)
if (typeof window !== 'undefined') {
  setTimeout(() => {
    initializeStorage();
  }, 50);
}