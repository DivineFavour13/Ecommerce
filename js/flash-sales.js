document.addEventListener("DOMContentLoaded", () => {
  // Ensure required functions exist before calling them
  if (typeof initProducts === "function") initProducts();
  if (typeof updateCartCount === "function") updateCartCount();
  if (typeof updateAuthLink === "function") updateAuthLink();

  loadFlashSalesPage();
  startFlashSaleCountdown();
});

function loadFlashSalesPage() {
  const container = document.getElementById("flash-products-grid");
  if (!container) return console.error("Missing #flash-products-grid element");

  const products = getProducts()
    .filter((p) => p.originalPrice || p.oldPrice || p.flashPrice); // Support various markers

  const countEl = document.getElementById("flash-items-count");
  if (countEl) countEl.textContent = products.length;

  if (products.length === 0) {
    container.innerHTML = '<div class="no-products">No flash sale items available</div>';
    return;
  }

  renderFlashProducts(products);
  setupFilters();
  setupViewToggle();
}

function renderFlashProducts(products) {
  const container = document.getElementById("flash-products-grid");
  if (!container) return;

  container.innerHTML = "";

  products.forEach((product) => {
    const original = product.originalPrice || product.oldPrice || product.price || 0;
    const discount = original > 0 ? Math.round(100 - (product.price / original) * 100) : 0;

    // protect against missing stock
    const stock = typeof product.stock === 'number' ? product.stock : 0;
    const stockMax = (typeof product.stockMax === 'number' && product.stockMax > 0) ? product.stockMax : (stock + 50);
    const percentSold = stockMax > 0 ? Math.floor(((stockMax - stock) / stockMax) * 100) : 0;
    const soldOut = stock <= 0;

    const card = document.createElement("div");
    card.className = "flash-product-card";

    card.innerHTML = `
      <div class="product-image">
        <a href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}" />
          ${soldOut ? '<div class="sold-out-overlay">Sold Out</div>' : ""}
          ${discount > 0 ? `<div class="discount-badge">-${discount}%</div>` : ""}
        </a>
        <button class="wishlist-btn" data-id="${product.id}">
          <i class="far fa-heart"></i>
        </button>
      </div>
      <div class="product-info">
        <h3><a href="product.html?id=${product.id}">${escapeHtml(product.name)}</a></h3>
        <div class="price-section">
          <span class="current-price">₦${product.price.toLocaleString()}</span>
          ${original && original !== product.price ? `<span class="old-price">₦${original.toLocaleString()}</span>` : ""}
        </div>
        <div class="rating">
          <div class="stars">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star-half-alt"></i>
          </div>
          <span class="rating-count">(${Math.floor(Math.random() * 500) + 50})</span>
        </div>
        <div class="stock-info">
          <div class="progress-bar">
            <div class="progress" style="width: ${percentSold}%;"></div>
          </div>
          <p class="stock-text">${stock} items left</p>
        </div>
        <button class="add-to-cart btn-primary" data-product-id="${product.id}" ${soldOut ? "disabled" : ""}>
          ${soldOut ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  // Safe add-to-cart event binding by product id
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.getAttribute("data-product-id"));
      const product = getProductById(id);
      if (!product) {
        showNotification('Product not found', 'error');
        return;
      }
      if (typeof addToCart === "function") {
        const success = addToCart(product, 1);
        if (success) {
          showNotification(`${product.name} added to cart`, 'success');
          if (typeof updateCartCount === 'function') updateCartCount();
        } else {
          showNotification('Failed to add to cart', 'error');
        }
      } else {
        console.warn("addToCart() not defined");
      }
    });
  });
}

function setupFilters() {
  const ids = ["category-filter", "price-filter", "discount-filter", "sort-filter"];
  const filters = ids.map((id) => document.getElementById(id)).filter(Boolean);

  if (filters.length === 0) return;

  filters.forEach((filter) => filter.addEventListener("change", applyFilters));
}

function applyFilters() {
  let products = getProducts().filter((p) => p.originalPrice || p.oldPrice);

  const category = document.getElementById("category-filter")?.value;
  const priceRange = document.getElementById("price-filter")?.value;
  const minDiscount = document.getElementById("discount-filter")?.value;
  const sortBy = document.getElementById("sort-filter")?.value;

  if (category) products = products.filter((p) => p.category === category);

  if (priceRange) {
    if (priceRange === "200000+") {
      products = products.filter((p) => p.price >= 200000);
    } else {
      const [min, max] = priceRange.split("-").map(Number);
      products = products.filter((p) => p.price >= min && p.price <= max);
    }
  }

  if (minDiscount) {
    products = products.filter((p) => {
      const base = p.originalPrice || p.oldPrice || p.price;
      const discount = Math.round(100 - (p.price / base) * 100);
      return discount >= parseInt(minDiscount);
    });
  }

  switch (sortBy) {
    case "price-low":
      products.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      products.sort((a, b) => b.price - a.price);
      break;
    case "discount":
      products.sort((a, b) => {
        const discA = Math.round(100 - (a.price / (a.originalPrice || a.oldPrice)) * 100);
        const discB = Math.round(100 - (b.price / (b.originalPrice || b.oldPrice)) * 100);
        return discB - discA;
      });
      break;
  }

  renderFlashProducts(products);
}

function setupViewToggle() {
  const viewButtons = document.querySelectorAll(".view-btn");
  const grid = document.getElementById("flash-products-grid");
  if (!grid || viewButtons.length === 0) return;

  viewButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      viewButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const view = btn.dataset.view;
      grid.className = view === "list" ? "flash-products-list" : "flash-products-grid";
    });
  });
}

function startFlashSaleCountdown() {
  let hours = 12,
    minutes = 0,
    seconds = 0;

  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (!hoursEl || !minutesEl || !secondsEl) return;

  setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        if (hours === 0) return;
        hours--;
        minutes = 59;
      } else {
        minutes--;
      }
      seconds = 59;
    } else {
      seconds--;
    }

    hoursEl.textContent = hours.toString().padStart(2, "0");
    minutesEl.textContent = minutes.toString().padStart(2, "0");
    secondsEl.textContent = seconds.toString().padStart(2, "0");
  }, 1000);
}