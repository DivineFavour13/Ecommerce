import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import products from '../data/products-data.js';
import { addToCart, addToWishlist, isInWishlist, removeFromWishlist, getProducts } from '../utils/storage.js';
import { showNotification } from '../utils/notifications.js';
import { formatCurrency } from '../utils/format.js';

function byRatingThenReviews(a, b) {
  const byRating = Number(b.rating || 0) - Number(a.rating || 0);
  if (byRating !== 0) return byRating;
  return Number(b.reviews || 0) - Number(a.reviews || 0);
}

function byReviewsThenRating(a, b) {
  const byReviews = Number(b.reviews || 0) - Number(a.reviews || 0);
  if (byReviews !== 0) return byReviews;
  return Number(b.rating || 0) - Number(a.rating || 0);
}

function byNewest(a, b) {
  const aDate = a?.createdAt ? new Date(a.createdAt).getTime() : Number(a.id || 0);
  const bDate = b?.createdAt ? new Date(b.createdAt).getTime() : Number(b.id || 0);
  return bDate - aDate;
}

function selectShowcaseProducts(allProducts, predicate, primarySort, limit = 8) {
  const inStock = allProducts.filter((product) => Number(product.stock || 0) > 0 && product.inStock !== false);
  const featured = inStock.filter(predicate).sort(primarySort);
  return featured.slice(0, limit);
}

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [slideIndex, setSlideIndex] = useState(0);
  const [countdown, setCountdown] = useState('12h : 00m : 00s');
  const [, setWishlistTick] = useState(0);
  const [catalogProducts, setCatalogProducts] = useState(() => {
    const stored = getProducts();
    return stored.length ? stored : products;
  });
  const activeCategory = (searchParams.get('category') || '').toLowerCase();
  const scopedProducts = useMemo(
    () => (activeCategory ? catalogProducts.filter((product) => String(product.category || '').toLowerCase() === activeCategory) : catalogProducts),
    [activeCategory, catalogProducts]
  );

  const slides = [
    { src: '/images/banner1a.jpg', alt: 'Flash Sale Week' },
    { src: '/images/banner2a.jpg', alt: 'New Electronics' },
    { src: '/images/banner3a.jpg', alt: 'Fashion Week' },
    { src: '/images/banner4a.jpg', alt: 'Home & Living' },
    { src: '/images/banner5a.jpg', alt: 'New Banner 5' },
    { src: '/images/banner6a.jpg', alt: 'New Banner 6' }
  ];

  const flashProducts = useMemo(
    () =>
      selectShowcaseProducts(
        scopedProducts,
        (product) => product.isFlashSale,
        byRatingThenReviews,
        8
      ),
    [scopedProducts]
  );
  const topSellers = useMemo(
    () =>
      selectShowcaseProducts(
        scopedProducts,
        (product) => product.isTopSeller,
        byReviewsThenRating,
        8
      ),
    [scopedProducts]
  );
  const newArrivals = useMemo(
    () =>
      selectShowcaseProducts(
        scopedProducts,
        (product) => product.isNewArrival,
        byNewest,
        8
      ),
    [scopedProducts]
  );

  const brandPartners = useMemo(() => [
    '/images/Apple.png',
    '/images/Nike.png',
    '/images/brands/brand-3.png',
    '/images/brands/brand-4.png',
    '/images/brands/brand-5.png',
    '/images/brands/brand-6.png'
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const syncProducts = () => {
      const stored = getProducts();
      setCatalogProducts(stored.length ? stored : products);
    };
    window.addEventListener('productsUpdated', syncProducts);
    return () => window.removeEventListener('productsUpdated', syncProducts);
  }, []);

  useEffect(() => {
    let endTime = localStorage.getItem('flash_sale_end_time');
    if (!endTime) {
      endTime = String(Date.now() + (12 * 60 * 60 * 1000));
      localStorage.setItem('flash_sale_end_time', endTime);
    }
    const tick = () => {
      const distance = parseInt(endTime, 10) - Date.now();
      if (distance <= 0) {
        setCountdown('SALE ENDED');
        localStorage.removeItem('flash_sale_end_time');
        return;
      }
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setCountdown(`${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAdd = (product) => {
    if (!product || Number(product.stock || 0) <= 0 || product.inStock === false) {
      showNotification('This product is out of stock', 'warning');
      return;
    }
    addToCart(product, 1);
    showNotification(`${product.name} added to cart`, 'success');
  };

  const handleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      showNotification(`${product.name} removed from wishlist`, 'info');
    } else {
      addToWishlist(product);
      showNotification(`${product.name} added to wishlist!`, 'success');
    }
    setWishlistTick((v) => v + 1);
  };

  const toCategory = (category) => {
    setSearchParams({ category });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderStars = (rating = 4.5) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <>
        {Array.from({ length: full }).map((_, i) => <i key={`f-${i}`} className="fas fa-star"></i>)}
        {half ? <i key="half" className="fas fa-star-half-alt"></i> : null}
        {Array.from({ length: empty }).map((_, i) => <i key={`e-${i}`} className="far fa-star"></i>)}
      </>
    );
  };

  return (
    <main>
      <div className="container">
        <section className="hero-section">
          <div className="hero-container">
            <aside className="hero-categories">
              <h3>Categories</h3>
              <ul>
                <li><a href="#" data-category="appliances" onClick={(e) => { e.preventDefault(); toCategory('appliances'); }}><i className="fas fa-plug"></i> Appliances</a></li>
                <li><a href="#" data-category="phones" onClick={(e) => { e.preventDefault(); toCategory('phones'); }}><i className="fas fa-mobile-alt"></i> Phones & Tablets</a></li>
                <li><a href="#" data-category="beauty" onClick={(e) => { e.preventDefault(); toCategory('beauty'); }}><i className="fas fa-heart"></i> Health & Beauty</a></li>
                <li><a href="#" data-category="home" onClick={(e) => { e.preventDefault(); toCategory('home'); }}><i className="fas fa-home"></i> Home & Office</a></li>
                <li><a href="#" data-category="electronics" onClick={(e) => { e.preventDefault(); toCategory('electronics'); }}><i className="fas fa-tv"></i> Electronics</a></li>
                <li><a href="#" data-category="fashion" onClick={(e) => { e.preventDefault(); toCategory('fashion'); }}><i className="fas fa-tshirt"></i> Fashion</a></li>
                <li><a href="#" data-category="supermarket" onClick={(e) => { e.preventDefault(); toCategory('supermarket'); }}><i className="fas fa-shopping-basket"></i> Supermarket</a></li>
                <li><a href="#" data-category="computing" onClick={(e) => { e.preventDefault(); toCategory('computing'); }}><i className="fas fa-laptop"></i> Computing</a></li>
                <li><a href="#" data-category="baby" onClick={(e) => { e.preventDefault(); toCategory('baby'); }}><i className="fas fa-baby"></i> Baby Products</a></li>
                <li><a href="#" data-category="gaming" onClick={(e) => { e.preventDefault(); toCategory('gaming'); }}><i className="fas fa-gamepad"></i> Gaming</a></li>
              </ul>
            </aside>

            <div className="hero-banner">
              <div className="slider" id="hero-slider">
                {slides.map((s, idx) => (
                  <div key={s.src} className={`slide ${idx === slideIndex ? 'active' : ''}`}>
                    <img src={s.src} alt={s.alt} className="slide-image" />
                  </div>
                ))}
              </div>
              <div className="slider-indicators">
                {slides.map((_, idx) => (
                  <span
                    key={idx}
                    className={`indicator ${idx === slideIndex ? 'active' : ''}`}
                    data-slide={idx}
                    onClick={() => setSlideIndex(idx)}
                  ></span>
                ))}
              </div>
            </div>

            <aside className="hero-quicklinks">
              <div className="quicklink">
                <i className="fas fa-phone"></i>
                <div>
                  <strong>CALL TO ORDER</strong>
                  <p>0700-600-6095<br />0905-344-5793</p>
                </div>
              </div>
              <div className="quicklink">
                <i className="fas fa-store"></i>
                <a href="#" onClick={(e) => { e.preventDefault(); showNotification('Sell on Luxora is coming soon.', 'info'); }}>Sell on Luxora</a>
              </div>
              <div className="quicklink">
                <i className="fas fa-shipping-fast"></i>
                <a href="#" onClick={(e) => { e.preventDefault(); showNotification('Express Delivery details are coming soon.', 'info'); }}>Express Delivery</a>
              </div>
              <div className="quicklink orange">
                <i className="fas fa-star"></i>
                <a href="#">LUXORA PRIME<br />JOIN NOW</a>
              </div>
            </aside>
            <aside className="hero-luxora-animation">
              <div className="luxora-logo-jump">LUXORA</div>
              <p className="luxora-tagline">Your No.1 Shopping Destination</p>
              <div className="luxora-features">
                <div className="luxora-feature">
                  <i className="fas fa-shipping-fast"></i>
                  <span>Fast Delivery</span>
                </div>
                <div className="luxora-feature">
                  <i className="fas fa-shield-alt"></i>
                  <span>Secure Shopping</span>
                </div>
                <div className="luxora-feature">
                  <i className="fas fa-tags"></i>
                  <span>Best Prices</span>
                </div>
                <div className="luxora-feature">
                  <i className="fas fa-headset"></i>
                  <span>24/7 Support</span>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="brand-partners">
          <div className="container">
            <div className="brands" aria-hidden="false">
              {brandPartners.map((src, idx) => (
                <div className="brand" key={`${src}-${idx}`}>
                  <img src={src} alt="brand" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flash-sales-section">
          <div className="section-header">
            <h2><i className="fas fa-bolt"></i> Flash Sales</h2>
            <div className="flash-timer">
              <span className="timer-label">Ends in:</span>
              <span className="countdown" id="home-countdown">{countdown}</span>
            </div>
            <Link to="/flash-sales" className="see-all">See All <i className="fas fa-arrow-right"></i></Link>
          </div>
          <div className="flash-sales-products" id="flash-sales-home">
            {flashProducts.length > 0 ? flashProducts.map(product => (
              <div className="flash-sale-item" key={product.id} data-product-id={product.id} onClick={() => navigate(`/product?id=${product.id}`)}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  {product.originalPrice ? <div className="discount-badge">-{Math.round(((product.originalPrice - (product.flashPrice || product.price)) / product.originalPrice) * 100)}%</div> : null}
                  <div className="product-actions">
                    <button className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`} data-id={product.id} title="Add to Wishlist" onClick={(e) => { e.stopPropagation(); handleWishlist(product); }}>
                      <i className={isInWishlist(product.id) ? 'fas fa-heart' : 'far fa-heart'}></i>
                    </button>
                    <button className="quick-view-btn" data-product-id={product.id} title="Quick View" onClick={(e) => { e.stopPropagation(); navigate(`/product?id=${product.id}`); }}>
                      <i className="fas fa-eye"></i>
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <h4>{product.name.length > 50 ? `${product.name.slice(0, 50)}...` : product.name}</h4>
                  <div className="product-rating">
                    {renderStars(product.rating || 4.5)}
                    <span className="review-count">({product.reviews || 0})</span>
                  </div>
                  <div className="product-prices">
                    <span className="flash-price">{formatCurrency(product.flashPrice || product.price)}</span>
                    {product.originalPrice ? <span className="original-price">{formatCurrency(product.originalPrice)}</span> : null}
                  </div>
                  <div className="flash-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(product.id * 17) % 60 + 30}%` }}></div>
                    </div>
                    <span className="items-left">{product.stock || 0} items left</span>
                  </div>
                  <button className="add-to-cart-btn" data-product-id={product.id} onClick={(e) => { e.stopPropagation(); handleAdd(product); }}>
                    <i className="fas fa-shopping-cart"></i> Add to Cart
                  </button>
                </div>
              </div>
            )) : <p>No flash sales in this category yet.</p>}
          </div>
        </section>

        <section className="top-sellers-section flash-sales-section">
          <div className="section-header">
            <h2><i className="fas fa-trophy"></i> Top Sellers</h2>
            <Link to="/top-sellers" className="see-all">See All <i className="fas fa-arrow-right"></i></Link>
          </div>
          <div className="flash-sales-products" id="top-sellers-grid">
            {topSellers.length > 0 ? topSellers.map(product => (
              <div className="flash-sale-item" key={product.id} data-product-id={product.id} onClick={() => navigate(`/product?id=${product.id}`)}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-badge">Best Seller</div>
                  {product.originalPrice ? <div className="discount-badge">-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</div> : null}
                  <div className="product-actions">
                    <button className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`} data-id={product.id} onClick={(e) => { e.stopPropagation(); handleWishlist(product); }}>
                      <i className={isInWishlist(product.id) ? 'fas fa-heart' : 'far fa-heart'}></i>
                    </button>
                    <button className="quick-view-btn" data-product-id={product.id} onClick={(e) => { e.stopPropagation(); navigate(`/product?id=${product.id}`); }}>
                      <i className="fas fa-eye"></i>
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <h4>{product.name.length > 60 ? `${product.name.slice(0, 60)}...` : product.name}</h4>
                  <div className="product-rating">
                    {renderStars(product.rating || 4.5)}
                    <span className="review-count">({product.reviews || 0})</span>
                  </div>
                  <div className="product-prices">
                    <span className="flash-price">{formatCurrency(product.price)}</span>
                    {product.originalPrice ? <span className="original-price">{formatCurrency(product.originalPrice)}</span> : null}
                  </div>
                  <div className="flash-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${Math.min(100, (product.stock || 0))}%` }}></div>
                    </div>
                    <span className="items-left">{product.stock || 0} items left</span>
                  </div>
                  <button className="add-to-cart-btn" data-product-id={product.id} onClick={(e) => { e.stopPropagation(); handleAdd(product); }}>
                    <i className="fas fa-shopping-cart"></i> Add to Cart
                  </button>
                </div>
              </div>
            )) : <p>No top sellers in this category yet.</p>}
          </div>
        </section>

        <section className="categories-section">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            <div className="category-card" data-category="electronics" onClick={() => toCategory('electronics')}>
              <i className="fas fa-tv"></i>
              <h3>Electronics</h3>
              <p>Latest gadgets & tech</p>
            </div>
            <div className="category-card" data-category="fashion" onClick={() => toCategory('fashion')}>
              <i className="fas fa-tshirt"></i>
              <h3>Fashion</h3>
              <p>Trending styles</p>
            </div>
            <div className="category-card" data-category="home" onClick={() => toCategory('home')}>
              <i className="fas fa-home"></i>
              <h3>Home & Living</h3>
              <p>Transform your space</p>
            </div>
            <div className="category-card" data-category="beauty" onClick={() => toCategory('beauty')}>
              <i className="fas fa-heart"></i>
              <h3>Beauty</h3>
              <p>Health & personal care</p>
            </div>
            <div className="category-card" data-category="phones" onClick={() => toCategory('phones')}>
              <i className="fas fa-mobile-alt"></i>
              <h3>Phones</h3>
              <p>Latest smartphones</p>
            </div>
            <div className="category-card" data-category="computing" onClick={() => toCategory('computing')}>
              <i className="fas fa-laptop"></i>
              <h3>Computing</h3>
              <p>Laptops & accessories</p>
            </div>
          </div>
        </section>

        <section className="new-arrivals-section flash-sales-section">
          <div className="section-header">
            <h2><i className="fas fa-star"></i> New Arrivals</h2>
            <Link to="/new-arrivals" className="see-all">See All <i className="fas fa-arrow-right"></i></Link>
          </div>
          <div className="flash-sales-products" id="new-arrivals-grid">
            {newArrivals.length > 0 ? newArrivals.map(product => (
              <div className="flash-sale-item" key={product.id} data-product-id={product.id} onClick={() => navigate(`/product?id=${product.id}`)}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-badge new">New</div>
                  {product.originalPrice ? <div className="discount-badge">-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%</div> : null}
                  <div className="product-actions">
                    <button className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`} data-id={product.id} onClick={(e) => { e.stopPropagation(); handleWishlist(product); }}>
                      <i className={isInWishlist(product.id) ? 'fas fa-heart' : 'far fa-heart'}></i>
                    </button>
                    <button className="quick-view-btn" data-product-id={product.id} onClick={(e) => { e.stopPropagation(); navigate(`/product?id=${product.id}`); }}>
                      <i className="fas fa-eye"></i>
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <h4>{product.name.length > 60 ? `${product.name.slice(0, 60)}...` : product.name}</h4>
                  <div className="product-rating">
                    {renderStars(product.rating || 4.5)}
                    <span className="review-count">({product.reviews || 0})</span>
                  </div>
                  <div className="product-prices">
                    <span className="flash-price">{formatCurrency(product.price)}</span>
                    {product.originalPrice ? <span className="original-price">{formatCurrency(product.originalPrice)}</span> : null}
                  </div>
                  <div className="flash-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${Math.min(100, (product.stock || 0))}%` }}></div>
                    </div>
                    <span className="items-left">{product.stock || 0} items left</span>
                  </div>
                  <button className="add-to-cart-btn" data-product-id={product.id} onClick={(e) => { e.stopPropagation(); handleAdd(product); }}>
                    <i className="fas fa-shopping-cart"></i> Add to Cart
                  </button>
                </div>
              </div>
            )) : <p>No new arrivals in this category yet.</p>}
          </div>
        </section>

        <section className="about-platform">
          <h2>LUXORA Nigeria - Your No.1 Online Shopping Destination</h2>
          <p>
            LUXORA Nigeria is the country's largest online shopping platform, letting customers nationwide buy everything they need easily from the website or mobile app. You can shop from the comfort of your home or workplace and get fast delivery on thousands of items, including fashion, electronics, groceries, mobile phones, computers, and much more.
          </p>
          <div className="about-features">
            <div className="feature">
              <i className="fas fa-shield-alt"></i>
              <h3>Original Products</h3>
              <p>Authentic products from top brands at unbeatable prices</p>
            </div>
            <div className="feature">
              <i className="fas fa-shipping-fast"></i>
              <h3>Fast Delivery</h3>
              <p>Express delivery within 24 hours for selected items</p>
            </div>
            <div className="feature">
              <i className="fas fa-credit-card"></i>
              <h3>Secure Payment</h3>
              <p>Multiple payment options with secure transactions</p>
            </div>
            <div className="feature">
              <i className="fas fa-headset"></i>
              <h3>24/7 Support</h3>
              <p>Customer service available round the clock</p>
            </div>
          </div>
        </section>
      </div>

      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h3>Stay Updated with LUXORA</h3>
            <p>Subscribe to our newsletter for exclusive deals and latest updates</p>
            <form
              id="newsletter-form"
              className="newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                const email = e.currentTarget.querySelector('#newsletter-email')?.value || '';
                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                  showNotification('Thank you for subscribing to our newsletter!', 'success');
                  e.currentTarget.reset();
                } else {
                  showNotification('Please enter a valid email address', 'error');
                }
              }}
            >
              <input type="email" id="newsletter-email" placeholder="Enter your email address" required />
              <button type="submit" className="btn-primary">Subscribe</button>
            </form>
            <div className="newsletter-benefits">
              <span><i className="fas fa-check"></i> Exclusive deals</span>
              <span><i className="fas fa-check"></i> New arrivals</span>
              <span><i className="fas fa-check"></i> Special offers</span>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-top">
          <div className="container">
            <div className="row">
              <div className="col">
                <h4>NEW TO LUXORA?</h4>
                <p>Subscribe to our newsletter to get updates on our latest offers!</p>
                <form className="footer-newsletter" onSubmit={(e) => e.preventDefault()}>
                  <input type="email" placeholder="Enter E-mail Address" required />
                  <button type="submit">Subscribe</button>
                </form>
                <div className="policy-links">
                  <label>
                    <input type="checkbox" required />
                    I agree to LUXORA's Privacy and Cookie Policy
                  </label>
                  <a href="#" className="legal-terms" onClick={(e) => { e.preventDefault(); showNotification('Legal terms page is coming soon.', 'info'); }}>I accept the Legal Terms</a>
                </div>
              </div>
              <div className="col">
                <h4>DOWNLOAD LUXORA FREE APP</h4>
                <p>Get access to exclusive offers!</p>
                <div className="app-links">
                  <a href="#" target="_blank" rel="noreferrer" className="app-store">
                    <i className="fab fa-apple"></i>
                    <div>
                      <span>Download on the</span>
                      <strong>App Store</strong>
                    </div>
                  </a>
                  <a href="#" target="_blank" rel="noreferrer" className="google-play">
                    <i className="fab fa-google-play"></i>
                    <div>
                      <span>Get it on</span>
                      <strong>Google Play</strong>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-middle">
          <div className="container">
            <div className="row">
              <div className="col">
                <h4>NEED HELP?</h4>
                <ul>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); showNotification('Chat support is coming soon.', 'info'); }}><i className="fas fa-comments"></i> Chat with us</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); showNotification('Help Center is coming soon.', 'info'); }}><i className="fas fa-question-circle"></i> Help Center</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); showNotification('Contact page is coming soon.', 'info'); }}><i className="fas fa-envelope"></i> Contact Us</a></li>
                </ul>
              </div>
              <div className="col">
                <h4>ABOUT LUXORA</h4>
                <ul>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); showNotification('About Us page is coming soon.', 'info'); }}>About Us</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); showNotification('Careers page is coming soon.', 'info'); }}>Careers</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); showNotification('Blog is coming soon.', 'info'); }}>Our Blog</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); showNotification('Terms & Conditions page is coming soon.', 'info'); }}>Terms & Conditions</a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); showNotification('Privacy Notice page is coming soon.', 'info'); }}>Privacy Notice</a></li>
                </ul>
              </div>
              <div className="col">
                <h4>PAYMENT METHODS & DELIVERY</h4>
                <div className="payment-methods">
                  <img src="/images/visa.png" alt="Visa" />
                  <img src="/images/mastercard.png" alt="Mastercard" />
                  <img src="/images/paypal.png" alt="PayPal" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="container">
            <p>&copy; 2025 LUXORA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
