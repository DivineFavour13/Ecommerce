document.addEventListener('DOMContentLoaded', () => {
  initializeLoginPage();
});

function initializeLoginPage() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const registerLink = document.getElementById('register-link');
  const loginLink = document.getElementById('login-link');
  
  if (!loginForm) return; // Not on login page
  
  setupFormToggling(loginForm, registerForm, registerLink, loginLink);
  setupPasswordToggle();
  setupFormValidation();
  setupSocialLogin();
  handleLoginForm(loginForm);
  handleRegisterForm(registerForm);
  
  // Check if user is already logged in
  checkExistingLogin();
}

// Check if user is already logged in
function checkExistingLogin() {
  const currentUser = getCurrentUser();
  if (currentUser) {
    showNotification(`Welcome back, ${currentUser.name}!`, 'info');
    setTimeout(() => {
      if (currentUser.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'index.html';
      }
    }, 1000);
  }
}

// Setup form toggling between login and register
function setupFormToggling(loginForm, registerForm, registerLink, loginLink) {
  if (registerLink) {
    registerLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchToRegisterForm(loginForm, registerForm);
    });
  }
  
  if (loginLink) {
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      switchToLoginForm(loginForm, registerForm);
    });
  }
}

// Switch to register form
function switchToRegisterForm(loginForm, registerForm) {
  // Update form title and subtitle
  const formTitle = document.getElementById('form-title');
  const formSubtitle = document.getElementById('form-subtitle');
  
  if (formTitle) formTitle.textContent = 'Create Account';
  if (formSubtitle) formSubtitle.textContent = 'Join LUXORA today';
  
  // Update switch form text
  const switchFormText = document.getElementById('switch-form-text');
  if (switchFormText) {
    switchFormText.innerHTML = 
      'Already have an account? <a href="#" id="login-link">Sign in</a>';
  }
  
  // Toggle forms with animation
  if (loginForm) {
    loginForm.classList.add('fade-out');
    
    setTimeout(() => {
      loginForm.style.display = 'none';
      if (registerForm) {
        registerForm.style.display = 'block';
        registerForm.classList.add('fade-in');
      }
      
      // Re-setup login link
      const newLoginLink = document.getElementById('login-link');
      if (newLoginLink) {
        newLoginLink.addEventListener('click', (e) => {
          e.preventDefault();
          switchToLoginForm(loginForm, registerForm);
        });
      }
    }, 300);
  }
}

// Switch to login form
function switchToLoginForm(loginForm, registerForm) {
  // Update form title and subtitle
  const formTitle = document.getElementById('form-title');
  const formSubtitle = document.getElementById('form-subtitle');
  
  if (formTitle) formTitle.textContent = 'Welcome Back';
  if (formSubtitle) formSubtitle.textContent = 'Sign in to your LUXORA account';
  
  // Update switch form text
  const switchFormText = document.getElementById('switch-form-text');
  if (switchFormText) {
    switchFormText.innerHTML = 
      'Don\'t have an account? <a href="#" id="register-link">Create one</a>';
  }
  
  // Toggle forms with animation
  if (registerForm) {
    registerForm.classList.add('fade-out');
    
    setTimeout(() => {
      registerForm.style.display = 'none';
      if (loginForm) {
        loginForm.style.display = 'block';
        loginForm.classList.add('fade-in');
      }
      
      // Re-setup register link
      const newRegisterLink = document.getElementById('register-link');
      if (newRegisterLink) {
        newRegisterLink.addEventListener('click', (e) => {
          e.preventDefault();
          switchToRegisterForm(loginForm, registerForm);
        });
      }
    }, 300);
  }
}

// Setup password toggle functionality
function setupPasswordToggle() {
  const passwordToggles = document.querySelectorAll('.password-toggle');
  
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const input = toggle.previousElementSibling;
      const icon = toggle.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
      } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
      }
    });
  });
}

// Setup form validation
function setupFormValidation() {
  // Validate all email fields
  const emailInputs = document.querySelectorAll('input[type="email"]');
  emailInputs.forEach(input => {
    input.addEventListener('blur', () => validateEmailField(input));
    input.addEventListener('input', () => clearFieldError(input));
  });

  // Validate all password fields
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  passwordInputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (input.id === 'register-password') {
        validatePasswordField(input); // Custom strength check
      } else {
        validateField(input); // Simple non-empty check
      }
    });
    input.addEventListener('input', () => clearFieldError(input));
  });

  // Confirm password field
  const confirmPasswordInput = document.getElementById('confirm-password');
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('blur', () => {
      validateConfirmPassword();
    });
    confirmPasswordInput.addEventListener('input', () => {
      clearFieldError(confirmPasswordInput);
    });
  }
}

function validateEmailField(input) {
  const email = input.value.trim();
  const isValid = validateEmail(email);
  
  if (email && !isValid) {
    showFieldError(input, 'Please enter a valid email address');
    return false;
  } else {
    clearFieldError(input);
    return true;
  }
}

function validatePasswordField(input) {
  const password = input.value;
  const validation = validatePasswordStrength(password);
  
  if (password && !validation.isValid) {
    showFieldError(input, 'Password must be at least 8 characters with uppercase, lowercase, and numbers');
    return false;
  } else {
    clearFieldError(input);
    return true;
  }
}

function validateConfirmPassword() {
  const password = document.getElementById('register-password')?.value;
  const confirmPassword = document.getElementById('confirm-password')?.value;
  
  if (confirmPassword && password !== confirmPassword) {
    showFieldError(document.getElementById('confirm-password'), 'Passwords do not match');
    return false;
  } else {
    clearFieldError(document.getElementById('confirm-password'));
    return true;
  }
}

function showFieldError(input, message) {
  clearFieldError(input);
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.textContent = message;
  
  input.parentNode.appendChild(errorDiv);
  input.classList.add('error');
}

function clearFieldError(input) {
  const existingError = input.parentNode.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
  input.classList.remove('error');
}

// Setup social login (placeholder)
function setupSocialLogin() {
  const socialButtons = document.querySelectorAll('.social-login-btn');
  
  socialButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const provider = button.dataset.provider;
      showNotification(`${provider} login not implemented yet`, 'info');
    });
  });
}

// Handle login form submission
function handleLoginForm(loginForm) {
  if (!loginForm) return;
  
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value;
    const rememberMe = document.getElementById('remember-me')?.checked;
    
    // Validate inputs
    if (!email) {
      showNotification('Please enter your email address', 'error');
      return;
    }
    
    if (!validateEmail(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    if (!password) {
      showNotification('Please enter your password', 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing in...';
    submitBtn.disabled = true;
    
    // Simulate login delay
    setTimeout(() => {
      const success = handleLogin(email, password, rememberMe);
      
      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      if (!success) {
        // Clear password field on failed login
        document.getElementById('password').value = '';
      }
    }, 1000);
  });
}

// Handle register form submission
function handleRegisterForm(registerForm) {
  if (!registerForm) return;
  
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('register-name')?.value.trim();
    const email = document.getElementById('register-email')?.value.trim();
    const password = document.getElementById('register-password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;
    const agreeTerms = document.getElementById('agree-terms')?.checked;
    
    // Validate inputs
    if (!name || name.length < 2) {
      showNotification('Please enter your full name (at least 2 characters)', 'error');
      return;
    }
    
    if (!email || !validateEmail(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
    
    if (!password || !validatePassword(password)) {
      showNotification('Password must be at least 6 characters long', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }
    
    if (!agreeTerms) {
      showNotification('Please agree to the terms and conditions', 'error');
      return;
    }
    
    // Check if user already exists
    const existingUsers = getUsers();
    const userExists = existingUsers.some(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (userExists) {
      showNotification('An account with this email already exists', 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;
    
    // Simulate registration delay
    setTimeout(() => {
      const success = handleRegister(name, email, password);
      
      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      if (success) {
        // Clear form
        registerForm.reset();
      }
    }, 1000);
  });
}

// Handle login logic
function handleLogin(email, password, rememberMe = false) {
  const users = getUsers();
  const user = users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && 
    u.password === password
  );
  
  if (user) {
    // Set current user
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || 'user'
    };
    
    setCurrentUser(userData);
    
    // Store remember me preference
    if (rememberMe) {
      localStorage.setItem('luxora_remember_me', 'true');
    }
    
    showNotification(`Welcome back, ${user.name}!`, 'success');
    
    // Redirect based on role
    setTimeout(() => {
      if (user.role === 'admin') {
        window.location.href = 'admin.html';
      } else {
        window.location.href = 'index.html';
      }
    }, 1500);
    
    return true;
  } else {
    showNotification('Invalid email or password. Please try again.', 'error');
    return false;
  }
}

// Handle registration logic
function handleRegister(name, email, password) {
  try {
    const newUser = {
      name: name,
      email: email,
      password: password, // In production, this should be hashed
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    const success = addUser(newUser);
    
    if (success) {
      showNotification('Account created successfully! Please sign in.', 'success');
      
      // Switch to login form
      setTimeout(() => {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        switchToLoginForm(loginForm, registerForm);
        
        // Pre-fill email in login form
        const emailInput = document.getElementById('email');
        if (emailInput) {
          emailInput.value = email;
        }
      }, 1500);
      
      return true;
    } else {
      showNotification('Failed to create account. Please try again.', 'error');
      return false;
    }
  } catch (error) {
    console.error('Registration error:', error);
    showNotification('An error occurred during registration. Please try again.', 'error');
    return false;
  }
}

// Forgot password functionality
function handleForgotPassword() {
  const email = prompt('Please enter your email address:');
  
  if (!email) return;
  
  if (!validateEmail(email)) {
    showNotification('Please enter a valid email address', 'error');
    return;
  }
  
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (user) {
    showNotification('Password reset instructions have been sent to your email', 'success');
  } else {
    showNotification('No account found with this email address', 'error');
  }
}

// Auto-login for development/testing
function autoLogin(email, role = 'user') {
  const users = getUsers();
  let user = users.find(u => u.email === email);
  
  if (!user) {
    // Create user if doesn't exist
    user = {
      name: role === 'admin' ? 'Admin User' : 'Test User',
      email: email,
      password: 'test123',
      role: role,
      createdAt: new Date().toISOString()
    };
    addUser(user);
  }
  
  setCurrentUser({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
  
  showNotification(`Auto-logged in as ${user.name}`, 'info');
  
  setTimeout(() => {
    if (user.role === 'admin') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'index.html';
    }
  }, 1000);
}

function validateField(input) {
  const value = input.value.trim();
  let isValid = true;
  let message = '';

  switch (input.id) {
    case 'email':
      isValid = validateEmail(value);
      message = 'Please enter a valid email address';
      break;
    case 'register-email':
      isValid = validateEmail(value);
      message = 'Please enter a valid email address';
      break;
    case 'password':
    case 'register-password':
      isValid = value.length >= 6;
      message = 'Password must be at least 6 characters';
      break;
    case 'register-name':
      isValid = value.length >= 2;
      message = 'Name must be at least 2 characters';
      break;
  }

  if (!isValid) {
    showFieldError(input, message);
  } else {
    clearFieldError(input);
  }
}

function showFieldError(input, message) {
  clearFieldError(input);
  input.classList.add('error');
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error';
  errorDiv.textContent = message;
  input.parentNode.appendChild(errorDiv);
}

function clearFieldError(input) {
  const existingError = input.parentNode.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
  input.classList.remove('error');
}



// Development helper functions
window.devLogin = {
  admin: () => autoLogin('admin@luxora.com', 'admin'),
  user: () => autoLogin('user@luxora.com', 'user')
};

// Make functions globally available
window.handleForgotPassword = handleForgotPassword;
window.autoLogin = autoLogin;