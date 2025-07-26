// slider.js - Hero banner slider functionality

document.addEventListener('DOMContentLoaded', () => {
  initializeSlider();
});

function initializeSlider() {
  const slider = document.getElementById('hero-slider');
  if (!slider) return;
  
  const slides = slider.querySelectorAll('.slide');
  const indicators = document.querySelectorAll('.slider-indicators .indicator');
  
  if (slides.length === 0) return;
  
  let currentSlide = 0;
  let slideInterval;
  let isTransitioning = false;
  
  // Configuration
  const config = {
    autoPlayInterval: 5000, // 5 seconds
    transitionDuration: 1000, // 1 second
    pauseOnHover: true,
    swipeThreshold: 50
  };
  
  // Initialize slider
  setupSlider();
  startAutoPlay();
  setupEventListeners();
  
  function setupSlider() {
    // Ensure first slide is active
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === 0);
    });
    
    // Ensure first indicator is active
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === 0);
    });
    
    // Set initial ARIA attributes for accessibility
    slider.setAttribute('role', 'region');
    slider.setAttribute('aria-label', 'Hero banner carousel');
    
    slides.forEach((slide, index) => {
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
      slide.setAttribute('aria-hidden', index !== 0 ? 'true' : 'false');
    });
    
    indicators.forEach((indicator, index) => {
      indicator.setAttribute('role', 'button');
      indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
      indicator.setAttribute('tabindex', index === 0 ? '0' : '-1');
    });
  }
  
  function goToSlide(slideIndex, direction = 'next') {
    if (isTransitioning || slideIndex === currentSlide) return;
    
    isTransitioning = true;
    
    // Validate slide index
    if (slideIndex < 0 || slideIndex >= slides.length) {
      isTransitioning = false;
      return;
    }
    
    const previousSlide = currentSlide;
    currentSlide = slideIndex;
    
    // Update slides
    slides.forEach((slide, index) => {
      slide.classList.remove('active', 'prev', 'next');
      slide.setAttribute('aria-hidden', 'true');
      
      if (index === currentSlide) {
        slide.classList.add('active');
        slide.setAttribute('aria-hidden', 'false');
      } else if (index === previousSlide) {
        slide.classList.add(direction === 'next' ? 'prev' : 'next');
      }
    });
    
    // Update indicators
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentSlide);
      indicator.setAttribute('tabindex', index === currentSlide ? '0' : '-1');
    });
    
    // Announce slide change to screen readers
    announceSlideChange();
    
    // Reset transition flag after animation completes
    setTimeout(() => {
      isTransitioning = false;
      
      // Clean up transition classes
      slides.forEach(slide => {
        slide.classList.remove('prev', 'next');
      });
    }, config.transitionDuration);
  }
  
  function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex, 'next');
  }
  
  function prevSlide() {
    const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    goToSlide(prevIndex, 'prev');
  }
  
  function startAutoPlay() {
    if (slideInterval) clearInterval(slideInterval);
    
    slideInterval = setInterval(() => {
      if (!document.hidden && !isTransitioning) {
        nextSlide();
      }
    }, config.autoPlayInterval);
  }
  
  function stopAutoPlay() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }
  
  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }
  
  function setupEventListeners() {
    // Indicator clicks
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        goToSlide(index);
        resetAutoPlay();
      });
      
      // Keyboard navigation for indicators
      indicator.addEventListener('keydown', (e) => {
        handleIndicatorKeydown(e, index);
      });
    });
    
    // Pause on hover if enabled
    if (config.pauseOnHover) {
      slider.addEventListener('mouseenter', stopAutoPlay);
      slider.addEventListener('mouseleave', startAutoPlay);
      slider.addEventListener('focusin', stopAutoPlay);
      slider.addEventListener('focusout', startAutoPlay);
    }
    
    // Keyboard navigation for slider
    slider.addEventListener('keydown', handleSliderKeydown);
    
    // Touch/swipe support
    setupTouchEvents();
    
    // Pause when page is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoPlay();
      } else {
        startAutoPlay();
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Intersection Observer for performance
    setupIntersectionObserver();
  }
  
  function handleIndicatorKeydown(e, index) {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        goToSlide(index);
        resetAutoPlay();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        const prevIndicatorIndex = index === 0 ? indicators.length - 1 : index - 1;
        indicators[prevIndicatorIndex].focus();
        break;
      case 'ArrowRight':
        e.preventDefault();
        const nextIndicatorIndex = (index + 1) % indicators.length;
        indicators[nextIndicatorIndex].focus();
        break;
      case 'Home':
        e.preventDefault();
        indicators[0].focus();
        break;
      case 'End':
        e.preventDefault();
        indicators[indicators.length - 1].focus();
        break;
    }
  }
  
  function handleSliderKeydown(e) {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        prevSlide();
        resetAutoPlay();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextSlide();
        resetAutoPlay();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        resetAutoPlay();
        break;
      case 'End':
        e.preventDefault();
        goToSlide(slides.length - 1);
        resetAutoPlay();
        break;
    }
  }
  
  function setupTouchEvents() {
    let startX = 0;
    let startY = 0;
    let distX = 0;
    let distY = 0;
    let startTime = 0;
    
    slider.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
      stopAutoPlay();
    }, { passive: true });
    
    slider.addEventListener('touchmove', (e) => {
      if (!startX || !startY) return;
      
      const touch = e.touches[0];
      distX = touch.clientX - startX;
      distY = touch.clientY - startY;
      
      // Prevent default if horizontal swipe is more significant
      if (Math.abs(distX) > Math.abs(distY)) {
        e.preventDefault();
      }
    }, { passive: false });
    
    slider.addEventListener('touchend', () => {
      const elapsedTime = Date.now() - startTime;
      
      // Only trigger if swipe was fast enough and long enough
      if (elapsedTime < 300 && Math.abs(distX) > config.swipeThreshold) {
        if (distX > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
      }
      
      // Reset values
      startX = 0;
      startY = 0;
      distX = 0;
      distY = 0;
      startTime = 0;
      
      resetAutoPlay();
    }, { passive: true });
  }
  
  function setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAutoPlay();
        } else {
          stopAutoPlay();
        }
      });
    }, {
      threshold: 0.5
    });
    
    observer.observe(slider);
  }
  
  function handleResize() {
    // Recalculate any position-dependent values if needed
    // Currently not needed but useful for future enhancements
  }
  
  function announceSlideChange() {
    // Create a live region for screen reader announcements
    let liveRegion = document.getElementById('slider-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'slider-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      document.body.appendChild(liveRegion);
    }
    
    const currentSlideText = slides[currentSlide].querySelector('h2')?.textContent || 
                           slides[currentSlide].querySelector('.slide-content h2')?.textContent ||
                           `Slide ${currentSlide + 1}`;
    
    liveRegion.textContent = `${currentSlideText}, slide ${currentSlide + 1} of ${slides.length}`;
  }
  
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
  
  // Public API for external control
  window.HeroSlider = {
    goToSlide: (index) => goToSlide(index),
    nextSlide,
    prevSlide,
    startAutoPlay,
    stopAutoPlay,
    resetAutoPlay,
    getCurrentSlide: () => currentSlide,
    getTotalSlides: () => slides.length,
    isTransitioning: () => isTransitioning
  };
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    stopAutoPlay();
  });
}

// Initialize additional sliders if they exist on the page
function initializeAllSliders() {
  const sliders = document.querySelectorAll('.slider');
  
  sliders.forEach((slider, index) => {
    if (!slider.id) {
      slider.id = `slider-${index}`;
    }
    
    // Only initialize if not already initialized
    if (!slider.hasAttribute('data-slider-initialized')) {
      initializeGenericSlider(slider);
      slider.setAttribute('data-slider-initialized', 'true');
    }
  });
}

// Generic slider initialization for other sliders on the site
function initializeGenericSlider(sliderElement) {
  const slides = sliderElement.querySelectorAll('.slide, .slider-item');
  const indicators = sliderElement.querySelectorAll('.indicator');
  
  if (slides.length <= 1) return; // No need for slider functionality
  
  let currentSlide = 0;
  let slideInterval;
  
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === index);
    });
    
    currentSlide = index;
  }
  
  function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }
  
  function startAutoPlay() {
    slideInterval = setInterval(nextSlide, 5000);
  }
  
  function stopAutoPlay() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }
  
  // Setup indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      showSlide(index);
      stopAutoPlay();
      startAutoPlay();
    });
  });
  
  // Start auto-play
  startAutoPlay();
  
  // Pause on hover
  sliderElement.addEventListener('mouseenter', stopAutoPlay);
  sliderElement.addEventListener('mouseleave', startAutoPlay);
}

// Auto-initialize all sliders when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure other scripts have loaded
  setTimeout(initializeAllSliders, 100);
});

// Expose utility functions
window.SliderUtils = {
  initializeAllSliders,
  initializeGenericSlider
};