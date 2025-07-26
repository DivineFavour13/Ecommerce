document.addEventListener('DOMContentLoaded', () => {
      initProducts();
      updateCartCount();
      updateAuthLink();
      loadFlashSalesPage();
      startFlashSaleCountdown();
    });

    function loadFlashSalesPage() {
      const container = document.getElementById('flash-products-grid');
      const products = getProducts().filter(p => p.oldPrice); // Products with discount
      
      document.getElementById('flash-items-count').textContent = products.length;
      
      if (products.length === 0) {
        container.innerHTML = '<div class="no-products">No flash sale items available</div>';
        return;
      }

      renderFlashProducts(products);
      setupFilters();
      setupViewToggle();
    }

    function renderFlashProducts(products) {
      const container = document.getElementById('flash-products-grid');
      container.innerHTML = '';

      products.forEach(product => {
        const discount = product.oldPrice ? Math.round(100 - (product.price / product.oldPrice) * 100) : 0;
        const percentSold = Math.floor(((product.stockMax - product.stock) / product.stockMax) * 100);
        const soldOut = product.stock === 0;

        const card = document.createElement('div');
        card.className = 'flash-product-card';

        card.innerHTML = `
          <div class="product-image">
            <a href="product.html?id=${product.id}">
              <img src="${product.image}" alt="${product.name}" />
              ${soldOut ? '<div class="sold-out-overlay">Sold Out</div>' : ''}
              ${discount > 0 ? `<div class="discount-badge">-${discount}%</div>` : ''}
            </a>
            <button class="wishlist-btn" data-id="${product.id}">
              <i class="far fa-heart"></i>
            </button>
          </div>
          <div class="product-info">
            <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
            <div class="price-section">
              <span class="current-price">₦${product.price.toLocaleString()}</span>
              ${product.oldPrice ? `<span class="old-price">₦${product.oldPrice.toLocaleString()}</span>` : ''}
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
              <p class="stock-text">${product.stock} items left</p>
            </div>
            <button class="add-to-cart btn-primary" data-product='${JSON.stringify(product)}' ${soldOut ? 'disabled' : ''}>
              ${soldOut ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        `;

        container.appendChild(card);
      });

      // Add event listeners
      document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
          const product = JSON.parse(btn.getAttribute('data-product'));
          addToCart(product);
        });
      });
    }

    function setupFilters() {
      const categoryFilter = document.getElementById('category-filter');
      const priceFilter = document.getElementById('price-filter');
      const discountFilter = document.getElementById('discount-filter');
      const sortFilter = document.getElementById('sort-filter');

      [categoryFilter, priceFilter, discountFilter, sortFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
      });
    }

    function applyFilters() {
      let products = getProducts().filter(p => p.oldPrice);
      
      const category = document.getElementById('category-filter').value;
      const priceRange = document.getElementById('price-filter').value;
      const minDiscount = document.getElementById('discount-filter').value;
      const sortBy = document.getElementById('sort-filter').value;

      // Apply filters
      if (category) {
        products = products.filter(p => p.category === category);
      }

      if (priceRange) {
        if (priceRange === '200000+') {
          products = products.filter(p => p.price >= 200000);
        } else {
          const [min, max] = priceRange.split('-').map(Number);
          products = products.filter(p => p.price >= min && p.price <= max);
        }
      }

      if (minDiscount) {
        products = products.filter(p => {
          const discount = Math.round(100 - (p.price / p.oldPrice) * 100);
          return discount >= parseInt(minDiscount);
        });
      }

      // Apply sorting
      switch (sortBy) {
        case 'price-low':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'discount':
          products.sort((a, b) => {
            const discountA = Math.round(100 - (a.price / a.oldPrice) * 100);
            const discountB = Math.round(100 - (b.price / b.oldPrice) * 100);
            return discountB - discountA;
          });
          break;
        default:
          // Keep default order
      }

      renderFlashProducts(products);
    }

    function setupViewToggle() {
      const viewButtons = document.querySelectorAll('.view-btn');
      const grid = document.getElementById('flash-products-grid');

      viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          viewButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          const view = btn.dataset.view;
          grid.className = view === 'list' ? 'flash-products-list' : 'flash-products-grid';
        });
      });
    }

    function startFlashSaleCountdown() {
      let hours = 12, minutes = 0, seconds = 0;
      
      const hoursEl = document.getElementById('hours');
      const minutesEl = document.getElementById('minutes');
      const secondsEl = document.getElementById('seconds');
      
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
        
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
      }, 1000);
    }