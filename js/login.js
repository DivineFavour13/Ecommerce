// =============== LOGIN PAGE FUNCTIONALITY ===============

document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const registerLink = document.getElementById('register-link');
  const switchFormText = document.getElementById('switch-form-text');
  const formTitle = document.getElementById('form-title');
  const formSubtitle = document.getElementById('form-subtitle');
  const passwordToggle = document.getElementById('password-toggle');
  const passwordInput = document.getElementById('password');
  
  // State
  let isLoginForm = true;

  // =============== FORM SWITCHING ===============

  function switchToRegister() {
    isLoginForm = false;

    // Fade out login form
    loginForm.style.opacity = '0';
    loginForm.style.transform = 'translateX(-20px)';

    setTimeout(() => {
      loginForm.style.display = 'none';
      registerForm.style.display = 'block';

      // Fade in register form
      setTimeout(() => {
        registerForm.style.opacity = '1';
        registerForm.style.transform = 'translateX(0)';
      }, 50);
    }, 300);

    // Update header
    formTitle.textContent = 'Create Account';
    formSubtitle.textContent = 'Join LUXORA and start shopping';
    switchFormText.innerHTML = 'Already have an account? <a href="#" id="login-link">Sign in</a>';
  }

  function switchToLogin() {
    isLoginForm = true;

    // Fade out register form
    registerForm.style.opacity = '0';
    registerForm.style.transform = 'translateX(-20px)';

    setTimeout(() => {
      registerForm.style.display = 'none';
      loginForm.style.display = 'block';

      // Fade in login form
      setTimeout(() => {
        loginForm.style.opacity = '1';
        loginForm.style.transform = 'translateX(0)';
      }, 50);
    }, 300);

    // Update header
    formTitle.textContent = 'Welcome Back';
    formSubtitle.textContent = 'Sign in to your LUXORA account';
    switchFormText.innerHTML = 'Don\'t have an account? <a href="#" id="register-link">Create one</a>';
  }

  // Use event delegation for dynamic links
  document.addEventListener('click', function(e) {
    if (e.target.matches('#register-link, #register-link *')) {
      e.preventDefault();
      switchToRegister();
    }

    if (e.target.matches('#login-link, #login-link *')) {
      e.preventDefault();
      switchToLogin();
    }
  });

  // =============== PASSWORD TOGGLE ===============
  
  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type');
      const icon = passwordToggle.querySelector('i');
      
      if (type === 'password') {
        passwordInput.setAttribute('type', 'text');
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        passwordInput.setAttribute('type', 'password');
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  }
  
  // Register form password toggle
  const regPasswordInput = document.getElementById('reg-password');
  const regConfirmPasswordInput = document.getElementById('reg-confirm-password');
  
  if (regPasswordInput) {
    const regPasswordToggle = document.createElement('button');
    regPasswordToggle.type = 'button';
    regPasswordToggle.className = 'password-toggle';
    regPasswordToggle.innerHTML = '<i class="fas fa-eye"></i>';
    regPasswordInput.parentElement.appendChild(regPasswordToggle);
    
    regPasswordToggle.addEventListener('click', function() {
      const type = regPasswordInput.getAttribute('type');
      const icon = regPasswordToggle.querySelector('i');
      
      if (type === 'password') {
        regPasswordInput.setAttribute('type', 'text');
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        regPasswordInput.setAttribute('type', 'password');
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  }

  // =============== DEMO CREDENTIALS AUTO-FILL ===============

  const demoInfo = document.querySelector('.demo-info');
  if (demoInfo) {
    // Make demo info clickable
    demoInfo.style.cursor = 'pointer';
    demoInfo.title = 'Click to auto-fill credentials';

    demoInfo.addEventListener('click', function() {
      const emailInput = document.getElementById('email');
      const passwordInputField = document.getElementById('password');

      // Auto-fill with admin credentials
      if (emailInput && passwordInputField) {
        emailInput.value = 'admin@luxora.com';
        passwordInputField.value = 'admin123';

        // Show feedback
        showNotification('Demo credentials filled!', 'success');
      }
    });

    // Add visual indicator
    const clickHint = document.createElement('p');
    clickHint.style.fontSize = '0.75rem';
    clickHint.style.color = 'var(--primary-color)';
    clickHint.style.marginTop = '0.5rem';
    clickHint.innerHTML = '<i class="fas fa-hand-pointer"></i> Click here to auto-fill';
    demoInfo.appendChild(clickHint);
  }

  // =============== DEMO ACCOUNT CREATION ===============

  if (registerForm) {
    // Add demo account creation button
    const demoAccountBtn = document.createElement('button');
    demoAccountBtn.type = 'button';
    demoAccountBtn.className = 'btn-secondary btn-full demo-account-btn';
    demoAccountBtn.innerHTML = '<span class="btn-text">Create Demo Account</span>';
    demoAccountBtn.style.marginTop = '1rem';

    // Insert after the main create account button
    const createAccountBtn = registerForm.querySelector('button[type="submit"]');
    if (createAccountBtn) {
      createAccountBtn.parentElement.insertBefore(demoAccountBtn, createAccountBtn.nextSibling);
    }

    demoAccountBtn.addEventListener('click', function() {
      // Auto-fill demo account data
      const nameInput = document.getElementById('reg-name');
      const emailInput = document.getElementById('reg-email');
      const passwordInput = document.getElementById('reg-password');
      const confirmPasswordInput = document.getElementById('reg-confirm-password');
      const termsCheckbox = document.getElementById('terms-agreement');
      const phoneInput = document.getElementById('reg-phone');
      const countryCodeSelect = document.getElementById('reg-country-code');

      if (nameInput && emailInput && passwordInput && confirmPasswordInput && termsCheckbox && phoneInput && countryCodeSelect) {
        // Generate random demo data
        const demoNames = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
        const randomName = demoNames[Math.floor(Math.random() * demoNames.length)];
        const randomEmail = `demo${Date.now()}@luxora.com`;

        nameInput.value = randomName;
        emailInput.value = randomEmail;
        passwordInput.value = 'demo123';
        confirmPasswordInput.value = 'demo123';
        countryCodeSelect.value = '+234';
        phoneInput.value = '8012345678';
        termsCheckbox.checked = true;

        // Clear any previous validation errors
        clearFieldValidation(nameInput);
        clearFieldValidation(emailInput);
        clearFieldValidation(passwordInput);
        clearFieldValidation(confirmPasswordInput);
        clearFieldValidation(phoneInput);

        showNotification('Demo account data filled! Click "Create Account" to proceed.', 'info');
      }
    });
  }

  // =============== FORM VALIDATION ===============
  
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  function validatePassword(password) {
    return password.length >= 6;
  }

  function validatePhone(phone) {
    const digits = (phone || '').replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
  }
  
  function showFieldError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    input.parentElement.after(errorDiv);
  }
  
  function showFieldSuccess(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
    formGroup.classList.add('success');
    
    // Remove error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
  }
  
  function clearFieldValidation(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error', 'success');
    
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }
  }

  // Real-time validation for login form
  if (loginForm) {
    const emailInput = document.getElementById('email');
    const passwordInputField = document.getElementById('password');
    
    if (emailInput) {
      emailInput.addEventListener('blur', function() {
        const value = this.value.trim();
        if (!value) {
          showFieldError(this, 'Email or phone is required');
          return;
        }
        if (value.includes('@')) {
          if (!validateEmail(value)) {
            showFieldError(this, 'Please enter a valid email');
            return;
          }
        } else if (!validatePhone(value)) {
          showFieldError(this, 'Please enter a valid phone number');
          return;
        }
        showFieldSuccess(this);
      });
      
      emailInput.addEventListener('input', function() {
        const value = this.value.trim();
        if (!value) return;
        if (value.includes('@')) {
          if (validateEmail(value)) showFieldSuccess(this);
        } else if (validatePhone(value)) {
          showFieldSuccess(this);
        }
      });
    }
    
    if (passwordInputField) {
      passwordInputField.addEventListener('blur', function() {
        if (!this.value) {
          showFieldError(this, 'Password is required');
        } else if (!validatePassword(this.value)) {
          showFieldError(this, 'Password must be at least 6 characters');
        } else {
          showFieldSuccess(this);
        }
      });
    }
  }

  // Real-time validation for register form
  if (registerForm) {
    const regEmailInput = document.getElementById('reg-email');
    const regPasswordInputField = document.getElementById('reg-password');
    const regConfirmPasswordInputField = document.getElementById('reg-confirm-password');
    const termsCheckbox = document.getElementById('terms-agreement');
    const regPhoneInput = document.getElementById('reg-phone');
    
    if (regEmailInput) {
      regEmailInput.addEventListener('blur', function() {
        if (!this.value) {
          showFieldError(this, 'Email is required');
        } else if (!validateEmail(this.value)) {
          showFieldError(this, 'Please enter a valid email');
        } else {
          showFieldSuccess(this);
        }
      });
    }

    if (regPhoneInput) {
      regPhoneInput.addEventListener('blur', function() {
        if (!this.value) {
          showFieldError(this, 'Phone number is required');
        } else if (!validatePhone(this.value)) {
          showFieldError(this, 'Enter a valid phone number');
        } else {
          showFieldSuccess(this);
        }
      });
    }
    
    if (regPasswordInputField) {
      regPasswordInputField.addEventListener('blur', function() {
        if (!this.value) {
          showFieldError(this, 'Password is required');
        } else if (!validatePassword(this.value)) {
          showFieldError(this, 'Password must be at least 6 characters');
        } else {
          showFieldSuccess(this);
        }
      });
    }
    
    if (regConfirmPasswordInputField && regPasswordInputField) {
      regConfirmPasswordInputField.addEventListener('blur', function() {
        if (!this.value) {
          showFieldError(this, 'Please confirm your password');
        } else if (this.value !== regPasswordInputField.value) {
          showFieldError(this, 'Passwords do not match');
        } else {
          showFieldSuccess(this);
        }
      });
      
      regPasswordInputField.addEventListener('input', function() {
        if (regConfirmPasswordInputField.value) {
          if (this.value === regConfirmPasswordInputField.value) {
            showFieldSuccess(regConfirmPasswordInputField);
          } else {
            showFieldError(regConfirmPasswordInputField, 'Passwords do not match');
          }
        }
      });
    }
  }

  // =============== LOGIN FORM SUBMISSION ===============
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = document.getElementById('email');
      const passwordInputField = document.getElementById('password');
      const rememberMe = document.getElementById('remember-me');
      
      // Validate
      let isValid = true;
      
      if (!emailInput.value) {
        showFieldError(emailInput, 'Email is required');
        isValid = false;
      } else if (!validateEmail(emailInput.value)) {
        showFieldError(emailInput, 'Please enter a valid email');
        isValid = false;
      }
      
      if (!passwordInputField.value) {
        showFieldError(passwordInputField, 'Password is required');
        isValid = false;
      }
      
      if (!isValid) return;
      
      // Show loading state
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');
      
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline-block';
      submitBtn.disabled = true;
      
      // Simulate login (replace with actual API call)
      setTimeout(() => {
      const identifier = emailInput.value.trim();
      const password = passwordInputField.value;

      let user = null;
      if (typeof authenticateUserByIdentifier === 'function') {
        user = authenticateUserByIdentifier(identifier, password);
      } else if (typeof authenticateUser === 'function' && identifier.includes('@')) {
        user = authenticateUser(identifier, password);
      }

      if (!user) {
        showNotification('Invalid email/phone or password', 'error');
        btnText.style.display = 'inline-block';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
        return;
      }

      setCurrentUser(user);
      if (typeof addLoginActivity === 'function') {
        addLoginActivity(user, {
          at: new Date().toISOString(),
          device: navigator.userAgent || 'Unknown device'
        });
      }
        
        // Handle remember me
      if (rememberMe && rememberMe.checked) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('savedEmail', identifier);
      }
        
        showNotification('Login successful! Redirecting...', 'success');
        
        // Redirect after short delay
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1000);
      }, 1500);
    });
  }

  // =============== REGISTER FORM SUBMISSION ===============

  if (registerForm) {
    const createAccountBtn = registerForm.querySelector('button[type="submit"]');
    if (createAccountBtn) {
      registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Use native HTML5 validation first
        if (!registerForm.checkValidity()) {
          registerForm.reportValidity();
          return;
        }

        const nameInput = document.getElementById('reg-name');
        const emailInput = document.getElementById('reg-email');
        const passwordInputField = document.getElementById('reg-password');
        const confirmPasswordInput = document.getElementById('reg-confirm-password');
        const termsCheckbox = document.getElementById('terms-agreement');
        const phoneInput = document.getElementById('reg-phone');
        const countryCodeSelect = document.getElementById('reg-country-code');

        // Clear previous errors
        if (nameInput) clearFieldValidation(nameInput);
        if (emailInput) clearFieldValidation(emailInput);
        if (passwordInputField) clearFieldValidation(passwordInputField);
        if (confirmPasswordInput) clearFieldValidation(confirmPasswordInput);
        if (phoneInput) clearFieldValidation(phoneInput);

        // Validate
        let isValid = true;

        if (!nameInput) {
          showNotification('Form error: Name field not found', 'error');
          return;
        }
        if (!nameInput.value.trim()) {
          showFieldError(nameInput, 'Name is required');
          isValid = false;
        }

      if (!emailInput) {
        showNotification('Form error: Email field not found', 'error');
        return;
      }
        if (!emailInput.value.trim()) {
          showFieldError(emailInput, 'Email is required');
          isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
          showFieldError(emailInput, 'Please enter a valid email');
          isValid = false;
        }

      if (!passwordInputField) {
        showNotification('Form error: Password field not found', 'error');
        return;
      }
        if (!passwordInputField.value.trim()) {
          showFieldError(passwordInputField, 'Password is required');
          isValid = false;
        } else if (!validatePassword(passwordInputField.value.trim())) {
          showFieldError(passwordInputField, 'Password must be at least 6 characters');
          isValid = false;
        }

      if (!confirmPasswordInput) {
        showNotification('Form error: Confirm password field not found', 'error');
        return;
      }
        if (!confirmPasswordInput.value.trim()) {
          showFieldError(confirmPasswordInput, 'Please confirm your password');
          isValid = false;
        } else if (confirmPasswordInput.value.trim() !== passwordInputField.value.trim()) {
          showFieldError(confirmPasswordInput, 'Passwords do not match');
          isValid = false;
        }

      if (!termsCheckbox) {
        showNotification('Form error: Terms checkbox not found', 'error');
        return;
      }

      if (!phoneInput || !countryCodeSelect) {
        showNotification('Form error: Phone number field not found', 'error');
        return;
      }
      if (!phoneInput.value.trim()) {
        showFieldError(phoneInput, 'Phone number is required');
        isValid = false;
      } else if (!validatePhone(phoneInput.value.trim())) {
        showFieldError(phoneInput, 'Enter a valid phone number');
        isValid = false;
      }
        if (!termsCheckbox.checked) {
          showNotification('Please agree to the Terms of Service', 'error');
          termsCheckbox.focus();
          return;
        }

        if (!isValid) {
          showNotification('Please fill in all required fields correctly', 'error');
          return;
        }

        // Show loading state
        const btnText = createAccountBtn.querySelector('.btn-text');
        const btnLoading = createAccountBtn.querySelector('.btn-loading');

        if (btnText && btnLoading) {
          btnText.style.display = 'none';
          btnLoading.style.display = 'inline-block';
          createAccountBtn.disabled = true;
        }

        // Simulate registration (replace with actual API call)
        setTimeout(() => {
          const plainPassword = passwordInputField.value.trim();
          const newUserData = {
            name: nameInput.value.trim(),
            email: emailInput.value.toLowerCase().trim(),
            countryCode: countryCodeSelect.value,
            phone: phoneInput.value.trim(),
            password: plainPassword,
          };

          // Persist the user in the users list for admin metrics
          if (typeof addUser === 'function') {
            const added = addUser(newUserData);
            if (!added) {
              showNotification('An account with this email already exists.', 'error');
              if (createAccountBtn) {
                const btnText = createAccountBtn.querySelector('.btn-text');
                const btnLoading = createAccountBtn.querySelector('.btn-loading');
                if (btnText && btnLoading) {
                  btnText.style.display = 'inline-block';
                  btnLoading.style.display = 'none';
                  createAccountBtn.disabled = false;
                }
              }
              return;
            }
          }

          // Set current session user without storing password
          const user = {
            name: newUserData.name,
            email: newUserData.email,
            countryCode: newUserData.countryCode,
            phone: newUserData.phone,
            role: 'user'
          };
          setCurrentUser(user);
          if (typeof addLoginActivity === 'function') {
            addLoginActivity(user, {
              at: new Date().toISOString(),
              device: navigator.userAgent || 'Unknown device'
            });
          }

          showNotification('Account created successfully! Redirecting...', 'success');

          // Redirect after short delay
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1000);
        }, 1500);
      });
    }
  }

  // =============== REMEMBER ME - AUTO-FILL ===============
  
  const rememberMeChecked = localStorage.getItem('rememberMe');
  const savedEmail = localStorage.getItem('savedEmail');
  
  if (rememberMeChecked === 'true' && savedEmail) {
    const emailInput = document.getElementById('email');
    const rememberMeCheckbox = document.getElementById('remember-me');
    
    if (emailInput) {
      emailInput.value = savedEmail;
    }
    
    if (rememberMeCheckbox) {
      rememberMeCheckbox.checked = true;
    }
  }

  // =============== SOCIAL LOGIN (PLACEHOLDER) ===============
  
  const socialButtons = document.querySelectorAll('.social-btn');
  socialButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const provider = this.getAttribute('data-provider');
      showNotification(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`, 'info');
    });
  });

  // =============== FORGOT PASSWORD (PLACEHOLDER) ===============
  
  const forgotPasswordLink = document.querySelector('.forgot-password');
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
      e.preventDefault();
      showNotification('Password reset feature coming soon! Please contact support.', 'info');
    });
  }
});

// =============== NOTIFICATION HELPER ===============

function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${icons[type]}"></i>
      <span class="notification-message">${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}
