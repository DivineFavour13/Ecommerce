// payment.js - Enhanced payment functionality with validation

document.addEventListener('DOMContentLoaded', () => {
  initializePaymentPage();
});

function initializePaymentPage() {
  const form = document.getElementById("payment-form");
  if (!form) return;

  setupPaymentForm(form);
  setupCardFormatting();
  loadOrderSummary();
  setupPaymentValidation();
}

function setupPaymentForm(form) {
  form.addEventListener("submit", handlePaymentSubmit);
}

function handlePaymentSubmit(e) {
  e.preventDefault();
  
  const cart = getCart();
  if (!cart.length) {
    showNotification("Your cart is empty!", 'error');
    return;
  }
  
  // Validate form
  if (!validatePaymentForm()) {
    return;
  }
  
  // Show processing state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Processing...';
  submitBtn.disabled = true;
  
  // Simulate payment processing
  setTimeout(() => {
    processPayment(cart);
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 2000);
}

function processPayment(cart) {
  try {
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = 5999; // ₦59.99 shipping
    const total = subtotal + tax + shipping;
    
    // Create order
    const orderData = {
      items: cart,
      subtotal: subtotal,
      tax: tax,
      shipping: shipping,
      total: total,
      paymentMethod: getPaymentMethod(),
      billingAddress: getBillingAddress(),
      userId: getCurrentUser()?.id || null
    };
    
    const order = createOrder(orderData);
    
    if (order) {
      // Clear cart
      clearCart();
      updateCartCount();
      
      // Show success message
      showNotification(`Payment of ${formatCurrency(total)} processed successfully! Order ID: ${order.id}`, 'success', 8000);
      
      // Redirect to success page or home
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } else {
      throw new Error('Failed to create order');
    }
    
  } catch (error) {
    console.error('Payment processing error:', error);
    showNotification('Payment processing failed. Please try again.', 'error');
  }
}

function validatePaymentForm() {
  const errors = [];
  
  // Validate card number
  const cardNumber = document.getElementById("card-number")?.value.replace(/\s/g, '');
  if (!cardNumber || !validateCreditCard(cardNumber)) {
    errors.push('Please enter a valid card number');
  }
  
  // Validate expiry date
  const expiry = document.getElementById("expiry")?.value;
  if (!expiry || !validateExpiryDate(expiry)) {
    errors.push('Please enter a valid expiry date');
  }
  
  // Validate CVV
  const cvv = document.getElementById("cvv")?.value;
  if (!cvv || !validateCVV(cvv)) {
    errors.push('Please enter a valid CVV');
  }
  
  // Validate cardholder name
  const cardholderName = document.getElementById("cardholder-name")?.value;
  if (!cardholderName || cardholderName.trim().length < 2) {
    errors.push('Please enter the cardholder name');
  }
  
  // Validate billing address
  const address = document.getElementById("billing-address")?.value;
  if (!address || address.trim().length < 5) {
    errors.push('Please enter a valid billing address');
  }
  
  const city = document.getElementById("billing-city")?.value;
  if (!city || city.trim().length < 2) {
    errors.push('Please enter a valid city');
  }
  
  const zipCode = document.getElementById("billing-zip")?.value;
  if (!zipCode || zipCode.trim().length < 3) {
    errors.push('Please enter a valid ZIP code');
  }
  
  // Show errors if any
  if (errors.length > 0) {
    errors.forEach(error => showNotification(error, 'error'));
    return false;
  }
  
  return true;
}

function setupCardFormatting() {
  // Card number formatting
  const cardNumberInput = document.getElementById("card-number");
  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, '').substring(0, 16);
      value = value.replace(/(.{4})/g, '$1 ').trim();
      e.target.value = value;
      
      // Update card type indicator
      updateCardTypeIndicator(value);
    });
  }
  
  // Expiry date formatting
  const expiryInput = document.getElementById("expiry");
  if (expiryInput) {
    expiryInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
      }
      e.target.value = value;
    });
  }
  
  // CVV formatting
  const cvvInput = document.getElementById("cvv");
  if (cvvInput) {
    cvvInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
    });
  }
}

function updateCardTypeIndicator(cardNumber) {
  const cardType = getCardType(cardNumber.replace(/\s/g, ''));
  const indicator = document.getElementById("card-type-indicator");
  
  if (indicator) {
    indicator.textContent = cardType;
    indicator.className = `card-type-indicator ${cardType.toLowerCase()}`;
  }
}

function getCardType(cardNumber) {
  const patterns = {
    visa: /^4/,
    mastercard: /^5[1-5]/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/
  };
  
  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(cardNumber)) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
  }
  
  return 'Unknown';
}

function getPaymentMethod() {
  const cardNumber = document.getElementById("card-number")?.value.replace(/\s/g, '');
  return {
    type: 'credit_card',
    cardType: getCardType(cardNumber),
    lastFour: cardNumber.slice(-4)
  };
}

function getBillingAddress() {
  return {
    name: document.getElementById("cardholder-name")?.value,
    address: document.getElementById("billing-address")?.value,
    city: document.getElementById("billing-city")?.value,
    state: document.getElementById("billing-state")?.value,
    zipCode: document.getElementById("billing-zip")?.value,
    country: document.getElementById("billing-country")?.value || 'NG'
  };
}

function loadOrderSummary() {
  const cart = getCart();
  const summaryContainer = document.getElementById("order-summary");
  
  if (!summaryContainer || cart.length === 0) return;
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const shipping = 5999;
  const total = subtotal + tax + shipping;
  
  summaryContainer.innerHTML = `
    <h3>Order Summary</h3>
    <div class="summary-items">
      ${cart.map(item => `
        <div class="summary-item">
          <span class="item-name">${item.name} × ${item.quantity}</span>
          <span class="item-price">${formatCurrency(item.price * item.quantity)}</span>
        </div>
      `).join('')}
    </div>
    <div class="summary-totals">
      <div class="summary-row">
        <span>Subtotal:</span>
        <span>${formatCurrency(subtotal)}</span>
      </div>
      <div class="summary-row">
        <span>Tax (8%):</span>
        <span>${formatCurrency(tax)}</span>
      </div>
      <div class="summary-row">
        <span>Shipping:</span>
        <span>${formatCurrency(shipping)}</span>
      </div>
      <div class="summary-row total">
        <span>Total:</span>
        <span>${formatCurrency(total)}</span>
      </div>
    </div>
  `;
}

function setupPaymentValidation() {
  // Real-time validation
  const inputs = document.querySelectorAll('#payment-form input');
  
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearFieldError(input));
  });
}

function validateField(input) {
  const value = input.value.trim();
  let isValid = true;
  let errorMessage = '';
  
  switch (input.id) {
    case 'card-number':
      isValid = validateCreditCard(value.replace(/\s/g, ''));
      errorMessage = 'Please enter a valid card number';
      break;
    case 'expiry':
      isValid = validateExpiryDate(value);
      errorMessage = 'Please enter a valid expiry date (MM/YY)';
      break;
    case 'cvv':
      isValid = validateCVV(value);
      errorMessage = 'Please enter a valid CVV';
      break;
    case 'cardholder-name':
      isValid = value.length >= 2;
      errorMessage = 'Please enter the cardholder name';
      break;
    case 'billing-address':
      isValid = value.length >= 5;
      errorMessage = 'Please enter a valid address';
      break;
    case 'billing-city':
      isValid = value.length >= 2;
      errorMessage = 'Please enter a valid city';
      break;
    case 'billing-zip':
      isValid = value.length >= 3;
      errorMessage = 'Please enter a valid ZIP code';
      break;
  }
  
  if (!isValid) {
    showFieldError(input, errorMessage);
  } else {
    clearFieldError(input);
  }
  
  return isValid;
}

function showFieldError(input, message) {
  clearFieldError(input);
  
  input.classList.add('error');
  const errorElement = document.createElement('div');
  errorElement.className = 'field-error';
  errorElement.textContent = message;
  
  input.parentNode.appendChild(errorElement);
}

function clearFieldError(input) {
  input.classList.remove('error');
  const errorElement = input.parentNode.querySelector('.field-error');
  if (errorElement) {
    errorElement.remove();
  }
}