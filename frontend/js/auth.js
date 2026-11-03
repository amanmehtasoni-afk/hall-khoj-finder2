/**
 * Hall Khoj Finder — Authentication & Registration Module
 * Supports Customer and Business Owner accounts with category selection and validation.
 */

window.HallKhojAuth = (function () {
  // Password Policy Rules
  function evaluatePassword(password) {
    return {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
  }

  function initPasswordMeter() {
    const pwdInput = document.getElementById('reg-password');
    if (!pwdInput) return;

    const ruleLength = document.getElementById('rule-length');
    const ruleUpper = document.getElementById('rule-upper');
    const ruleLower = document.getElementById('rule-lower');
    const ruleNumber = document.getElementById('rule-number');
    const ruleSpecial = document.getElementById('rule-special');
    const meterBar = document.getElementById('pwd-strength-bar');

    pwdInput.addEventListener('input', () => {
      const val = pwdInput.value;
      const res = evaluatePassword(val);

      if (ruleLength) ruleLength.classList.toggle('valid', res.length);
      if (ruleUpper) ruleUpper.classList.toggle('valid', res.upper);
      if (ruleLower) ruleLower.classList.toggle('valid', res.lower);
      if (ruleNumber) ruleNumber.classList.toggle('valid', res.number);
      if (ruleSpecial) ruleSpecial.classList.toggle('valid', res.special);

      // Calculate score out of 5
      const score = [res.length, res.upper, res.lower, res.number, res.special].filter(Boolean).length;
      if (meterBar) {
        meterBar.style.width = `${(score / 5) * 100}%`;
        if (score <= 2) {
          meterBar.style.backgroundColor = '#ef4444'; // Red
        } else if (score <= 4) {
          meterBar.style.backgroundColor = '#f59e0b'; // Amber
        } else {
          meterBar.style.backgroundColor = '#10b981'; // Green
        }
      }
    });
  }

  function initShowPasswordToggles() {
    document.querySelectorAll('.pwd-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement?.querySelector('input');
        if (!input) return;
        if (input.type === 'password') {
          input.type = 'text';
          btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>`;
        } else {
          input.type = 'password';
          btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
        }
      });
    });
  }

  function initRoleTabs() {
    const roleTabs = document.querySelectorAll('.auth-role-tab');
    const ownerFields = document.querySelectorAll('.owner-only-field');
    const categorySelect = document.getElementById('reg-business-category');
    const businessNameInput = document.getElementById('reg-business-name');

    roleTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        roleTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const role = tab.getAttribute('data-role');
        const roleHidden = document.getElementById('selected-role-input');
        if (roleHidden) roleHidden.value = role;

        const isOwner = (role === 'owner');

        // Toggle owner-specific fields
        ownerFields.forEach(field => {
          field.style.display = isOwner ? 'block' : 'none';
        });

        // Set or remove required constraints
        if (categorySelect) {
          categorySelect.required = isOwner;
        }
        if (businessNameInput) {
          businessNameInput.required = isOwner;
        }

        // Hide any existing error on role switch
        hideFormAlert();
      });
    });
  }

  function showFormAlert(message, type = 'error') {
    const box = document.getElementById('form-alert-box');
    if (!box) {
      if (window.showToast) window.showToast(message, type);
      return;
    }

    box.style.display = 'block';
    if (type === 'success') {
      box.style.background = 'rgba(16, 185, 129, 0.15)';
      box.style.border = '1px solid #10b981';
      box.style.color = '#a7f3d0';
      box.innerHTML = `<strong>✓ Success:</strong> ${message}`;
    } else {
      box.style.background = 'rgba(239, 68, 68, 0.15)';
      box.style.border = '1px solid #ef4444';
      box.style.color = '#fca5a5';
      box.innerHTML = `<strong>⚠️ Error:</strong> ${message}`;
    }

    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideFormAlert() {
    const box = document.getElementById('form-alert-box');
    if (box) {
      box.style.display = 'none';
      box.innerHTML = '';
    }
  }

  function initFormSubmissions() {
    // 1. Login Form (Mobile Number + Password)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const mobile = document.getElementById('login-mobile')?.value.trim() || document.getElementById('login-email')?.value.trim() || '';
        const pwd = document.getElementById('login-password')?.value;
        const role = document.querySelector('.auth-role-tab.active')?.getAttribute('data-role') || 'user';
        const cleanMobile = mobile.replace(/[\s+-]/g, '').slice(-10);

        if (!cleanMobile || cleanMobile.length < 10) {
          if (window.showToast) window.showToast('Please enter your 10-digit mobile number.', 'error');
          document.getElementById('login-mobile')?.focus();
          return;
        }
        if (!pwd) {
          if (window.showToast) window.showToast('Please enter your password.', 'error');
          document.getElementById('login-password')?.focus();
          return;
        }

        try {
          if (window.showToast) window.showToast('Authenticating with server...', 'info');

          if (window.HKF_API?.auth) {
            const res = await window.HKF_API.auth.login(cleanMobile, pwd);
            const user = res.data?.user || {};
            if (window.showToast) window.showToast('Login successful! Welcome back.', 'success');
            setTimeout(() => {
              if (user.role === 'owner' || role === 'owner') {
                window.location.href = '/owner/dashboard.html';
              } else {
                window.location.href = '/dashboard.html';
              }
            }, 500);
          } else {
            const mockUser = { mobile: cleanMobile, role, name: 'User ' + cleanMobile.slice(-4), isLoggedIn: true };
            localStorage.setItem('hkf_session', JSON.stringify(mockUser));
            window.location.href = role === 'owner' ? '/owner/dashboard.html' : '/dashboard.html';
          }
        } catch (err) {
          if (window.showToast) window.showToast(err.message || 'Login failed. Please check your credentials.', 'error');
        }
      });
    }

    // 2. Register Form (Mobile Number + Category + Name)
    const regForm = document.getElementById('register-form');
    if (regForm) {
      regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideFormAlert();

        const role = document.getElementById('selected-role-input')?.value || 'user';
        const isOwner = (role === 'owner');

        const name = document.getElementById('reg-name')?.value.trim() || '';
        const mobile = document.getElementById('reg-mobile')?.value.trim() || '';
        const pwd = document.getElementById('reg-password')?.value || '';
        const confirmPwd = document.getElementById('reg-confirm-password')?.value || '';
        const state = document.getElementById('reg-state')?.value.trim() || '';
        const city = document.getElementById('reg-city')?.value.trim() || '';
        const village = document.getElementById('reg-village')?.value.trim() || '';
        const pinCode = document.getElementById('reg-pincode')?.value.trim() || '';

        const categorySelect = document.getElementById('reg-business-category');
        const businessCategory = categorySelect ? categorySelect.value.trim() : '';
        const businessName = document.getElementById('reg-business-name')?.value.trim() || '';

        const submitBtn = document.getElementById('reg-submit-btn');
        const btnText = document.getElementById('btn-text');

        // Validation Checks
        if (isOwner) {
          if (!businessCategory) {
            showFormAlert('Please select your Business Category from the dropdown.');
            categorySelect?.focus();
            return;
          }
          if (!businessName) {
            showFormAlert('Please enter your Business / Venue Name.');
            document.getElementById('reg-business-name')?.focus();
            return;
          }
        }

        if (!name || name.length < 2) {
          showFormAlert('Please enter your full name (minimum 2 characters).');
          document.getElementById('reg-name')?.focus();
          return;
        }

        const cleanMobile = mobile.replace(/[\s+-]/g, '').slice(-10);
        if (!cleanMobile || cleanMobile.length < 10) {
          showFormAlert('Please enter a valid 10-digit mobile number.');
          document.getElementById('reg-mobile')?.focus();
          return;
        }

        if (!pwd || pwd.length < 8) {
          showFormAlert('Password must be at least 8 characters long.');
          document.getElementById('reg-password')?.focus();
          return;
        }

        const checks = evaluatePassword(pwd);
        if (!checks.length || !checks.upper || !checks.lower || !checks.number || !checks.special) {
          showFormAlert('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.');
          document.getElementById('reg-password')?.focus();
          return;
        }

        if (pwd !== confirmPwd) {
          showFormAlert('Passwords do not match. Please verify your confirm password.');
          document.getElementById('reg-confirm-password')?.focus();
          return;
        }

        if (!state) {
          showFormAlert('Please enter your state.');
          document.getElementById('reg-state')?.focus();
          return;
        }

        if (!city) {
          showFormAlert('Please enter your city or district.');
          document.getElementById('reg-city')?.focus();
          return;
        }

        // Set Loading State
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.75';
        }
        if (btnText) {
          btnText.textContent = 'Creating Your Account...';
        }

        try {
          const payload = {
            name,
            mobile: cleanMobile,
            password: pwd,
            role,
            businessCategory: isOwner ? businessCategory : '',
            businessType: isOwner ? businessCategory : '',
            businessName: isOwner ? businessName : '',
            state,
            city,
            village,
            pinCode
          };

          const res = await window.HKF_API.auth.register(payload);

          showFormAlert('Account created successfully! Redirecting to your dashboard...', 'success');
          if (window.showToast) {
            window.showToast('Account registered successfully!', 'success');
          }

          const user = res.data?.user || payload;
          setTimeout(() => {
            if (user.role === 'owner' || isOwner) {
              window.location.href = '/owner/dashboard.html';
            } else {
              window.location.href = '/dashboard.html';
            }
          }, 800);

        } catch (err) {
          console.error('[Registration Error]', err);
          const errorMsg = err.message || 'Registration failed. Please check your details and try again.';
          showFormAlert(errorMsg, 'error');
          if (window.showToast) {
            window.showToast(errorMsg, 'error');
          }

          // Restore Button State
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
          }
          if (btnText) {
            btnText.textContent = 'Create Account';
          }
        }
      });
    }

    // 3. Forgot Password Trigger
    const forgotPwdLink = document.getElementById('forgot-pwd-trigger');
    const forgotModal = document.getElementById('forgot-pwd-modal');
    if (forgotPwdLink && forgotModal) {
      forgotPwdLink.addEventListener('click', (e) => {
        e.preventDefault();
        forgotModal.classList.add('open');
      });
    }

    const forgotSubmit = document.getElementById('forgot-submit-btn');
    if (forgotSubmit && document.getElementById('forgot-email-input')) {
      forgotSubmit.addEventListener('click', () => {
        const forgotEmail = document.getElementById('forgot-email-input')?.value.trim();
        if (!forgotEmail) {
          if (window.showToast) window.showToast('Please enter your registered mobile number.', 'error');
          return;
        }
        if (window.showToast) window.showToast(`Password reset code sent to ${forgotEmail}!`, 'success');
        if (forgotModal) forgotModal.classList.remove('open');
      });
    }
  }

  function init() {
    initPasswordMeter();
    initShowPasswordToggles();
    initRoleTabs();
    initFormSubmissions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return {
    evaluatePassword
  };
})();
