document.addEventListener('DOMContentLoaded', () => {
  initializeProductPage();
});

function initializeProductPage() {
  const urlParams = getUrlParameters();
  const productId = urlParams.id;

  if (!productId || isNaN(parseInt(productId))) {
    console.error('Invalid product ID:', productId);
    showNotification('Product ID is invalid or missing', 'error');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
    return;
  }

  // Load the product from storage
  const product = getProductById(parseInt(productId));
  if (!product) {
    console.error('Product not found for id:', productId);
    showNotification('Product not found', 'error');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
    return;
  }

  // Proceed with rendering the product
  renderProductDetails(product);
  updateBreadcrumb(product);
  setupProductActions(product);
  setupProductTabs(product);
  setupImageGallery(product);
  loadRelatedProducts(product.id);
  updateCartCount();
  updateAuthLink();

  // Add to recently viewed
  addToRecentlyViewed(product);
}

// Load product details
function loadProductDetails(productId) {
  const product = getProductById(parseInt(productId));

  if (!product) {
    showNotification('Product not found', 'error');
    window.location.href = 'index.html';
    return;
  }

  // Add to recently viewed
  addToRecentlyViewed(product);

  renderProductDetails(product);
  updateBreadcrumb(product);
  setupProductActions(product);
}

// Render product details
function renderProductDetails(product) {
  const container = document.getElementById('product-details');
  if (!container) return;

  const discount = product.originalPrice ? Math.round(100 - (product.price / product.originalPrice) * 100) : 0;
  const stockPercentage = product.stockMax ?
    Math.floor(((product.stockMax - product.stock) / product.stockMax) * 100) : 0;

  container.innerHTML = `
    <div class="product-images">
      <div class="main-image">
        <img src="${product.image}" alt="${product.name}" id="main-product-image">
        ${discount > 0 ? `<div class="image-badge">-${discount}% OFF</div>` : ''}
        <button class="wishlist-btn" data-id="${product.id}">
          <i class="far fa-heart"></i>
        </button>
      </div>
      <div class="thumbnail-images">
        <div class="thumbnail active">
          <img src="${product.image}" alt="${product.name}">
        </div>
        ${generateAdditionalImages(product)}
      </div>
    </div>
    
    <div class="product-info">
      <h1 class="product-title">${product.name}</h1>
      
      <div class="product-rating">
        <div class="rating-stars">
          <div class="stars">${generateStars(product.rating || 4.5)}</div>
          <span class="rating-score">${(product.rating || 4.5).toFixed(1)}</span>
        </div>
        <div class="rating-count">
          <a href="#reviews-tab">(${product.reviewCount || Math.floor(Math.random() * 500) + 50} reviews)</a>
        </div>
      </div>
      
      <div class="product-price">
        <span class="current-price">${formatCurrency(product.price)}</span>
        ${product.originalPrice ? `
          <span class="old-price">${formatCurrency(product.originalPrice)}</span>
          <span class="discount-percentage">-${discount}%</span>
        ` : ''}
      </div>
      
      <div class="product-description">
        <p>${product.description}</p>
      </div>
      
      ${product.features ? generateProductFeatures(product.features) : ''}
      
      <div class="stock-info">
        <div class="stock-status">
          <span>Availability:</span>
          <span class="stock-count ${getStockClass(product.stock)}">${getStockText(product.stock)}</span>
        </div>
        ${product.stock > 0 ? `
          <div class="stock-bar">
            <div class="stock-progress" style="width: ${stockPercentage}%;"></div>
          </div>
          <p class="stock-text">${product.stock} items left - ${stockPercentage}% sold</p>
        ` : ''}
      </div>
      
      ${generateProductOptions(product)}
      
      <div class="product-actions">
        <div class="quantity-selector">
          <label for="quantity">Quantity:</label>
          <div class="quantity-controls">
            <button class="quantity-btn" id="decrease-qty" ${product.stock === 0 ? 'disabled' : ''}>
              <i class="fas fa-minus"></i>
            </button>
            <input type="number" id="quantity-input" class="quantity-input" value="1" min="1" max="${product.stock}" ${product.stock === 0 ? 'disabled' : ''}>
            <button class="quantity-btn" id="increase-qty" ${product.stock === 0 ? 'disabled' : ''}>
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
        
        <button class="add-to-cart-btn" id="add-to-cart-btn" ${product.stock === 0 ? 'disabled' : ''}>
          <i class="fas fa-shopping-cart"></i>
          ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        
        <button class="buy-now-btn" id="buy-now-btn" ${product.stock === 0 ? 'disabled' : ''}>
          <i class="fas fa-bolt"></i>
          Buy Now
        </button>
      </div>
      
      <div class="product-meta">
        <div class="meta-row">
          <span>Category:</span>
          <span><a href="index.html?category=${product.category}">${product.category}</a></span>
        </div>
        <div class="meta-row">
          <span>SKU:</span>
          <span>LUX-${product.id}</span>
        </div>
        <div class="meta-row">
          <span>Brand:</span>
          <span>${product.brand || 'LUXORA'}</span>
        </div>
        ${product.warranty ? `
          <div class="meta-row">
            <span>Warranty:</span>
            <span>${product.warranty}</span>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  // Update product description tab
  const descriptionTab = document.getElementById('product-description');
  if (descriptionTab) {
    descriptionTab.innerHTML = `
      <p>${product.description}</p>
      ${product.longDescription ? `<p>${product.longDescription}</p>` : ''}
      ${product.features ? generateDetailedFeatures(product.features) : ''}
    `;
  }

  // Update specifications tab
  const specsTab = document.getElementById('product-specs');
  if (specsTab) {
    specsTab.innerHTML = generateSpecifications(product);
  }
}

// Generate additional images (mock for demo)
function generateAdditionalImages(product) {
  // In a real app, these would come from the product data
  const additionalImages = (product.images && product.images.length > 1)
    ? product.images.slice(1)
    : [
      product.image.replace('.jpg', '_2.jpg'),
      product.image.replace('.jpg', '_3.jpg'),
      product.image.replace('.jpg', '_4.jpg')
    ];

  return additionalImages.map(img => `
    <div class="thumbnail">
      <img src="${img}" alt="${product.name}" onerror="this.style.display='none'">
    </div>
  `).join('');
}

// Generate product features
function generateProductFeatures(features) {
  if (!features || !Array.isArray(features)) return '';

  return `
    <div class="product-features">
      <h4>Key Features</h4>
      <ul class="features-list">
        ${features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
      </ul>
    </div>
  `;
}

// Generate detailed features for description tab
function generateDetailedFeatures(features) {
  if (!features || !Array.isArray(features)) return '';

  return `
    <h3>Features & Benefits</h3>
    <ul>
      ${features.map(feature => `<li>${feature}</li>`).join('')}
    </ul>
  `;
}

// Generate product options (color, size, etc.)
function generateProductOptions(product) {
  let optionsHtml = '';

  if (product.colors && product.colors.length > 0) {
    optionsHtml += `
      <div class="product-options">
        <div class="option-group">
          <h4>Color:</h4>
          <div class="color-options">
            ${product.colors.map((color, index) => `
              <div class="color-option ${index === 0 ? 'active' : ''}" 
                   style="background-color: ${color.value || color}" 
                   data-color="${color.name || color}"
                   title="${color.name || color}"></div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  if (product.sizes && product.sizes.length > 0) {
    optionsHtml += `
      <div class="product-options">
        <div class="option-group">
          <h4>Size:</h4>
          <div class="size-options">
            ${product.sizes.map((size, index) => `
              <div class="size-option ${index === 0 ? 'active' : ''}" data-size="${size}">${size}</div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  return optionsHtml;
}

// Generate specifications
function generateSpecifications(product) {
  const specs = product.specifications || {
    'General': {
      'Brand': product.brand || 'LUXORA',
      'Model': `LUX-${product.id}`,
      'Category': product.category,
      'Weight': product.weight || 'N/A',
      'Dimensions': product.dimensions || 'N/A'
    },
    'Features': {
      'Color': product.colors ? product.colors.map(c => c.name || c).join(', ') : 'Multiple',
      'Material': product.material || 'Premium Quality',
      'Warranty': product.warranty || '1 Year'
    }
  };

  return Object.keys(specs).map(category => `
    <div class="spec-category">
      <h4>${category}</h4>
      <div class="spec-list">
        ${Object.keys(specs[category]).map(key => `
          <div class="spec-item">
            <span class="spec-label">${key}:</span>
            <span class="spec-value">${specs[category][key]}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// Get stock class for styling
function getStockClass(stock) {
  if (stock === 0) return 'out-of-stock';
  if (stock <= 5) return 'low';
  if (stock <= 20) return 'medium';
  return 'high';
}

// Get stock text
function getStockText(stock) {
  if (stock === 0) return 'Out of Stock';
  if (stock <= 5) return `Only ${stock} left!`;
  if (stock <= 20) return `${stock} in stock`;
  return 'In Stock';
}

// Generate stars for rating
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let starsHtml = '';

  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fas fa-star"></i>';
  }

  if (hasHalfStar) {
    starsHtml += '<i class="fas fa-star-half-alt"></i>';
  }

  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="far fa-star"></i>';
  }

  return starsHtml;
}

// Update breadcrumb
function updateBreadcrumb(product) {
  const categoryEl = document.getElementById('breadcrumb-category');
  const productEl = document.getElementById('breadcrumb-product');

  if (categoryEl) categoryEl.textContent = product.category;
  if (productEl) productEl.textContent = product.name;
}

// Setup product actions
function setupProductActions(product) {
  setupQuantityControls(product);
  setupAddToCart(product);
  setupBuyNow(product);
  setupWishlist(product);
  setupProductOptions();
}

// Setup quantity controls
function setupQuantityControls(product) {
  const quantityInput = document.getElementById('quantity-input');
  const decreaseBtn = document.getElementById('decrease-qty');
  const increaseBtn = document.getElementById('increase-qty');

  if (!quantityInput || !decreaseBtn || !increaseBtn) return;

  decreaseBtn.addEventListener('click', () => {
    const currentQty = parseInt(quantityInput.value);
    if (currentQty > 1) {
      quantityInput.value = currentQty - 1;
      updateQuantityButtons();
    }
  });

  increaseBtn.addEventListener('click', () => {
    const currentQty = parseInt(quantityInput.value);
    if (currentQty < product.stock) {
      quantityInput.value = currentQty + 1;
      updateQuantityButtons();
    }
  });

  quantityInput.addEventListener('change', () => {
    let qty = parseInt(quantityInput.value);
    if (isNaN(qty) || qty < 1) qty = 1;
    if (qty > product.stock) qty = product.stock;
    quantityInput.value = qty;
    updateQuantityButtons();
  });

  function updateQuantityButtons() {
    const qty = parseInt(quantityInput.value);
    decreaseBtn.disabled = qty <= 1;
    increaseBtn.disabled = qty >= product.stock;
  }
}

// Setup add to cart
function setupAddToCart(product) {
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  if (!addToCartBtn) return;

  addToCartBtn.addEventListener('click', () => {
    if (product.stock === 0) {
      showNotification('This item is out of stock', 'error');
      return;
    }

    const quantity = parseInt(document.getElementById('quantity-input').value);
    const selectedOptions = getSelectedOptions();

    const cartItem = {
      ...product,
      quantity: quantity,
      ...selectedOptions
    };

    const cart = getCart();
    const existingItem = cart.find(item =>
      item.id === product.id &&
      item.color === selectedOptions.color &&
      item.size === selectedOptions.size
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity <= product.stock) {
        existingItem.quantity = newQuantity;
        saveCart(cart);
        showNotification(`${product.name} quantity updated in cart`, 'success');
      } else {
        showNotification(`Only ${product.stock} items available`, 'warning');
        return;
      }
    } else {
      cart.push(cartItem);
      saveCart(cart);
      showNotification(`${product.name} added to cart`, 'success');
    }

    updateCartCount();

    // Update product stock
    updateProduct(product.id, { stock: product.stock - quantity });

    // Refresh product display
    setTimeout(() => {
      loadProductDetails(product.id);
    }, 1000);
  });
}

// Setup buy now
function setupBuyNow(product) {
  const buyNowBtn = document.getElementById('buy-now-btn');
  if (!buyNowBtn) return;

  buyNowBtn.addEventListener('click', () => {
    // Add to cart first
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
      addToCartBtn.click();

      // Redirect to cart after a short delay
      setTimeout(() => {
        window.location.href = 'cart.html';
      }, 500);
    }
  });
}

// Setup wishlist
function setupWishlist(product) {
  const wishlistBtn = document.querySelector('.wishlist-btn');
  if (!wishlistBtn) return;

  // Update button state
  updateWishlistButton(wishlistBtn, product.id);

  wishlistBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleWishlist(product);
  });
}

// Toggle wishlist
function toggleWishlist(product) {
  const isInWish = isInWishlist(product.id);

  if (isInWish) {
    removeFromWishlist(product.id);
    showNotification(`${product.name} removed from wishlist`, 'info');
  } else {
    addToWishlist(product);
    showNotification(`${product.name} added to wishlist`, 'success');
  }

  // Update button state
  const wishlistBtn = document.querySelector('.wishlist-btn');
  updateWishlistButton(wishlistBtn, product.id);
}

// Update wishlist button
function updateWishlistButton(button, productId) {
  const isInWish = isInWishlist(productId);
  const icon = button.querySelector('i');

  if (isInWish) {
    icon.className = 'fas fa-heart';
    button.classList.add('active');
  } else {
    icon.className = 'far fa-heart';
    button.classList.remove('active');
  }
}

// Setup product options
function setupProductOptions() {
  // Color options
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    option.addEventListener('click', () => {
      colorOptions.forEach(o => o.classList.remove('active'));
      option.classList.add('active');
    });
  });

  // Size options
  const sizeOptions = document.querySelectorAll('.size-option');
  sizeOptions.forEach(option => {
    option.addEventListener('click', () => {
      sizeOptions.forEach(o => o.classList.remove('active'));
      option.classList.add('active');
    });
  });
}

// Get selected options
function getSelectedOptions() {
  const selectedColor = document.querySelector('.color-option.active');
  const selectedSize = document.querySelector('.size-option.active');

  return {
    color: selectedColor ? selectedColor.getAttribute('data-color') : null,
    size: selectedSize ? selectedSize.getAttribute('data-size') : null
  };
}

// Setup image gallery
function setupImageGallery() {
  const thumbnails = document.querySelectorAll('.thumbnail');
  const mainImage = document.getElementById('main-product-image');

  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
      const img = thumbnail.querySelector('img');
      if (img && mainImage) {
        mainImage.src = img.src;

        // Update active thumbnail
        thumbnails.forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
      }
    });
  });
}

// Setup product tabs
function setupProductTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Update active tab button
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update active tab pane
      tabPanes.forEach(pane => pane.classList.remove('active'));
      const targetPane = document.getElementById(`${targetTab}-tab`);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // Handle review count update
  const reviewCount = document.getElementById('review-count');
  if (reviewCount) {
    reviewCount.textContent = Math.floor(Math.random() * 500) + 50;
  }
}

// Load related products
function loadRelatedProducts(currentProductId) {
  const relatedGrid = document.getElementById('related-products-grid');
  if (!relatedGrid) return;

  const currentProduct = getProductById(parseInt(currentProductId));
  if (!currentProduct) return;

  const allProducts = getProducts();

  // Filter products by same category, excluding current product
  let relatedProducts = allProducts.filter(product =>
    product.category === currentProduct.category &&
    product.id !== currentProduct.id
  );

  // If not enough related products, add random products
  if (relatedProducts.length < 6) {
    const additionalProducts = allProducts
      .filter(product => product.id !== currentProduct.id && !relatedProducts.includes(product))
      .slice(0, 6 - relatedProducts.length);

    relatedProducts = [...relatedProducts, ...additionalProducts];
  }

  // Limit to 6 products
  relatedProducts = relatedProducts.slice(0, 6);

  // Render related products
  renderRelatedProducts(relatedGrid, relatedProducts);
}

// Render related products
function renderRelatedProducts(container, products) {
  container.innerHTML = '';

  products.forEach(product => {
    const card = createRelatedProductCard(product);
    container.appendChild(card);
  });
}

// Create related product card
function createRelatedProductCard(product) {
  const discount = product.originalPrice ? Math.round(100 - (product.price / product.originalPrice) * 100) : 0;

  const card = document.createElement('div');
  card.className = 'product-card';

  card.innerHTML = `
    <div class="product-image">
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${discount > 0 ? `<div class="discount-badge">-${discount}%</div>` : ''}
      </a>
    </div>
    <div class="product-info">
      <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
      <div class="rating">
        <div class="stars">${generateStars(product.rating || 4.5)}</div>
        <span class="rating-count">(${product.reviewCount || Math.floor(Math.random() * 500) + 50})</span>
      </div>
      <div class="price">
        ${formatCurrency(product.price)}
        ${product.originalPrice ? `<span class="old-price">${formatCurrency(product.originalPrice)}</span>` : ''}
      </div>
      <button class="add-to-cart btn-primary" onclick="addRelatedToCart(${product.id})">
        Add to Cart
      </button>
    </div>
  `;

  return card;
}

// Add related product to cart
function addRelatedToCart(productId) {
  const product = getProductById(productId);
  if (!product) return;

  if (product.stock === 0) {
    showNotification('This item is out of stock', 'error');
    return;
  }

  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    if (existingItem.quantity < product.stock) {
      existingItem.quantity++;
      saveCart(cart);
      showNotification(`${product.name} quantity updated in cart`, 'success');
    } else {
      showNotification('Maximum stock limit reached', 'warning');
      return;
    }
  } else {
    cart.push({ ...product, quantity: 1 });
    saveCart(cart);
    showNotification(`${product.name} added to cart`, 'success');
  }

  updateCartCount();
}

// Expose function for onclick handlers
window.addRelatedToCart = addRelatedToCart;