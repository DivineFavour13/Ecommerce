// storage.js - Local Storage Management

// Storage keys
const PRODUCTS_KEY = 'luxora_products';
const CART_KEY = 'luxora_cart';
const USER_KEY = 'luxora_user';
const USERS_KEY = 'luxora_users';
const WISHLIST_KEY = 'luxora_wishlist';
const RECENTLY_VIEWED_KEY = 'luxora_recently_viewed';
const ORDERS_KEY = 'luxora_orders';
const SETTINGS_KEY = 'luxora_settings';

// Product Management
function getProducts() {
  try {
    const products = localStorage.getItem(PRODUCTS_KEY);
    return products ? JSON.parse(products) : [];
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
}

function saveProducts(products) {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
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
  const products = getProducts();
  const index = products.findIndex(product => product.id === parseInt(id));
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    return saveProducts(products);
  }
  return false;
}

function deleteProduct(id) {
  const products = getProducts();
  const filteredProducts = products.filter(product => product.id !== parseInt(id));
  return saveProducts(filteredProducts);
}

// Cart Management
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
    return true;
  } catch (error) {
    console.error('Error saving cart:', error);
    return false;
  }
}

function dispatchCartUpdateEvent() {
  const event = new Event('cartUpdated');
  window.dispatchEvent(event);
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    dispatchCartUpdateEvent(); // Notify listeners
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

// User Management
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
    return true;
  } catch (error) {
    console.error('Error setting current user:', error);
    return false;
  }
}

function logout() {
  try {
    localStorage.removeItem(USER_KEY);
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
  const newUser = {
    id: Date.now(),
    ...user,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  return saveUsers(users);
}

// Wishlist Management
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

// Recently Viewed Management
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
  
  // Remove if already exists
  const filtered = recentlyViewed.filter(item => item.id !== product.id);
  
  // Add to beginning
  filtered.unshift(product);
  
  // Keep only last 10 items
  const limited = filtered.slice(0, 10);
  
  return saveRecentlyViewed(limited);
}

// Orders Management
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

// Settings Management
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

// Utility Functions
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
      users: getUsers(),
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
    if (data.users) saveUsers(data.users);
    if (data.orders) saveOrders(data.orders);
    if (data.settings) saveSettings(data.settings);
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}

// Check if localStorage is available
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

// Initialize storage with default data if empty
function initializeStorage() {
  if (!isStorageAvailable()) {
    console.warn('LocalStorage is not available');
    return false;
  }

  console.log('Initializing storage...');

  // Initialize products
  const storedProducts = getProducts();
  if (!storedProducts || storedProducts.length === 0) {
    if (typeof products !== 'undefined' && products.length > 0) {
      console.log('Saving default products...');
      saveProducts(products);
    } else {
      console.warn('No products data found in products-data.js');
    }
  }

  // Initialize users (create default admin if none)
  const users = getUsers();
  if (users.length === 0) {
    const defaultAdmin = {
      id: 1,
      name: 'Admin',
      email: 'admin@luxora.com',
      password: 'admin123', // In production, this should be hashed
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    addUser(defaultAdmin);
    console.log('Default admin created');
  }

  // Initialize settings
  if (!localStorage.getItem(SETTINGS_KEY)) {
    saveSettings(getDefaultSettings());
    console.log('Default settings applied');
  }

  // Initialize cart if needed
  if (!localStorage.getItem(CART_KEY)) {
    saveCart([]);
  }

  // Initialize wishlist if needed
  if (!localStorage.getItem(WISHLIST_KEY)) {
    saveWishlist([]);
  }

  // Initialize recently viewed if needed
  if (!localStorage.getItem(RECENTLY_VIEWED_KEY)) {
    saveRecentlyViewed([]);
  }

  // Initialize orders if needed
  if (!localStorage.getItem(ORDERS_KEY)) {
    saveOrders([]);
  }

  console.log('Storage initialized successfully');
  return true;
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  initializeStorage();
}

console.log('Checking products in localStorage:', localStorage.getItem(PRODUCTS_KEY));