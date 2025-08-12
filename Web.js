document.addEventListener("DOMContentLoaded", () => {
  // Utility: toast notifications
  const showToast = (message) => {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.display = 'block';
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toast.style.display = 'none';
    }, 2500);
  };

  // Helper to create/return error element next to a field
  const getErrorEl = (inputEl) => {
    const container = inputEl.parentElement;
    let err = container.querySelector('.error-text');
    if (!err) {
      err = document.createElement('div');
      err.className = 'error-text';
      container.appendChild(err);
    }
    return err;
  };

  // PAGE: Find Blood
  const findBloodForm = document.getElementById('find-blood-form') || document.querySelector('form');
  const cityInput = document.getElementById("city");
  const stateInput = document.getElementById("state");
  const messageInput = document.getElementById("message");
  const firstNameInput = document.getElementById('first_name');
  const lastNameInput = document.getElementById('last_name');
  const ageInput = document.getElementById('age');
  const genderSelect = document.getElementById('gender');
  const bloodGroupSelect = document.getElementById('blood_group');
  const phoneInput = document.getElementById('phone');
  const emailInput = document.getElementById('email');
  const submitBtn = document.getElementById('submit-btn');
  const resultsContainer = document.getElementById("search-results");
  const resultsList = document.getElementById("results-list");

  const onFindBloodPage = cityInput && stateInput && findBloodForm && !document.getElementById('donor-form');

  const validators = {
    first_name: (v) => v.trim().length >= 2 || 'First name must be at least 2 characters.',
    last_name: (v) => v.trim().length >= 2 || 'Last name must be at least 2 characters.',
    age: (v) => {
      const n = Number(v);
      if (!Number.isFinite(n)) return 'Age is required.';
      if (n < 18) return 'Minimum age is 18.';
      if (n > 65) return 'Maximum age is 65.';
      return true;
    },
    gender: (v) => (v ? true : 'Please select a gender.'),
    blood_group: (v) => (v ? true : 'Please select a blood group.'),
    phone: (v) => (/^\d{10}$/.test(v) ? true : 'Phone must be 10 digits.'),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? true : 'Enter a valid email.'),
    city: (v) => (v.trim().length >= 3 ? true : 'City must be at least 3 characters.'),
    state: (v) => (v.trim().length >= 3 ? true : 'State must be at least 3 characters.'),
    message: () => true,
  };

  const validateInput = (inputEl) => {
    if (!inputEl) return true;
    const name = inputEl.name || inputEl.id;
    const value = inputEl.value;
    const rule = validators[name];
    if (!rule) return true;
    const result = rule(value);
    const isValid = result === true;
    const errEl = getErrorEl(inputEl);
    if (isValid) {
      inputEl.classList.remove('invalid-input');
      errEl.textContent = '';
    } else {
      inputEl.classList.add('invalid-input');
      errEl.textContent = result;
    }
    return isValid;
  };

  const updateSubmitState = () => {
    if (!onFindBloodPage || !submitBtn) return;
    const allInputs = [
      firstNameInput,
      lastNameInput,
      ageInput,
      genderSelect,
      bloodGroupSelect,
      phoneInput,
      emailInput,
      cityInput,
      stateInput,
    ];
    const allValid = allInputs.every((el) => validateInput(el));
    submitBtn.disabled = !allValid;
  };

  if (onFindBloodPage) {
    // Attach live validation
    [
      firstNameInput,
      lastNameInput,
      ageInput,
      genderSelect,
      bloodGroupSelect,
      phoneInput,
      emailInput,
      cityInput,
      stateInput,
      messageInput,
    ].forEach((el) => {
      if (!el) return;
      const evt = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(evt, () => {
        validateInput(el);
        updateSubmitState();
      });
    });

    // Reset behavior
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        setTimeout(() => {
          [
            firstNameInput,
            lastNameInput,
            ageInput,
            genderSelect,
            bloodGroupSelect,
            phoneInput,
            emailInput,
            cityInput,
            stateInput,
            messageInput,
          ].forEach((el) => {
            if (!el) return;
            el.classList.remove('invalid-input');
            const err = el.parentElement && el.parentElement.querySelector('.error-text');
            if (err) err.textContent = '';
          });
          if (resultsContainer) resultsContainer.style.display = 'none';
          if (resultsList) resultsList.innerHTML = '';
          if (submitBtn) submitBtn.disabled = true;
        }, 0);
      });
    }

    // Submit handling
    findBloodForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      updateSubmitState();
      if (submitBtn && submitBtn.disabled) {
        showToast('Please fix validation errors.');
        return;
      }

      const originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.textContent = 'Searching...';
        submitBtn.disabled = true;
      }

      // Simulate API call delay
      await new Promise((r) => setTimeout(r, 800));

      const mockResults = [
        { name: "John Doe", bloodType: "A+", contact: "123-456-7890" },
        { name: "Jane Smith", bloodType: "O-", contact: "987-654-3210" },
        { name: "Mike Johnson", bloodType: "B+", contact: "456-789-1234" },
      ];

      if (resultsList && resultsContainer) {
        resultsList.innerHTML = "";
        mockResults.forEach((result) => {
          const listItem = document.createElement("li");
          listItem.textContent = `${result.name} - Blood Type: ${result.bloodType} - Contact: ${result.contact}`;
          resultsList.appendChild(listItem);
        });
        resultsContainer.style.display = "block";
      }

      if (submitBtn) {
        submitBtn.textContent = originalText;
        updateSubmitState();
      }
      showToast('Search completed.');
    });

    // Initialize submit state on load
    updateSubmitState();
  }

  // PAGE: Donor Registration
  const donorForm = document.getElementById('donor-form');
  const donorFirst = document.getElementById('first_name');
  const donorLast = document.getElementById('last_name');
  const donorEmail = document.getElementById('email');
  const donorPhone = document.getElementById('phone');
  const donorCity = document.getElementById('city');
  const donorState = document.getElementById('state');
  const donorZipcode = document.getElementById('zipcode');
  const donorCountry = document.getElementById('country');
  const donorAddress1 = document.getElementById('address1');
  const isDonorPage = donorForm && donorFirst && donorLast && donorEmail && donorPhone;

  // PAGE: Registration
  const regForm = document.querySelector('form[action="#"][novalidate]') || document.getElementById('registration-form');
  const regFirst = document.getElementById('first');
  const regLast = document.getElementById('last');
  const regEmail = document.getElementById('email');
  const regPassword = document.getElementById('password');
  const regRepassword = document.getElementById('repassword');
  const regMobile = document.getElementById('mobile');
  const regGender = document.getElementById('gender');
  const isRegistrationPage = regFirst && regLast && regEmail && regPassword && regRepassword && regMobile && regGender && !donorForm;

  const donorSubmitBtn = document.querySelector('#donor-form button[type="submit"]');
  const regSubmitBtn = document.querySelector('#registration-form button[type="submit"], .main form button[type="submit"]');

  const donorValidators = {
    first_name: (v) => v.trim().length >= 2 || 'First name must be at least 2 characters.',
    last_name: (v) => v.trim().length >= 2 || 'Last name must be at least 2 characters.',
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? true : 'Enter a valid email.'),
    phone: (v) => (/^\d{10}$/.test(v) ? true : 'Phone must be 10 digits.'),
    city: (v) => (v.trim().length >= 2 ? true : 'City must be at least 2 characters.'),
    state: (v) => (v ? true : 'Please select a state.'),
    zipcode: (v) => (/^\d{5}(-\d{4})?$/.test(v) ? true : 'Enter a valid zipcode.'),
    country: (v) => (v ? true : 'Please select a country.'),
    address1: (v) => (v.trim().length >= 5 ? true : 'Address must be at least 5 characters.'),
  };

  const regValidators = {
    first: (v) => v.trim().length >= 2 || 'First name must be at least 2 characters.',
    last: (v) => v.trim().length >= 2 || 'Last name must be at least 2 characters.',
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? true : 'Enter a valid email.'),
    password: (v) => (/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])\S{8,}$/.test(v) ? true : 'Password must contain a number, a letter, a symbol, and be 8+ chars.'),
    repassword: (v) => (v === (regPassword ? regPassword.value : '') ? true : 'Passwords do not match.'),
    mobile: (v) => (/^\d{10}$/.test(v) ? true : 'Contact must be 10 digits.'),
    gender: (v) => (v ? true : 'Please select gender.'),
  };

  const validateDonor = (el) => {
    if (!el) return true;
    const name = el.name || el.id;
    const rule = donorValidators[name];
    if (!rule) return true;
    const result = rule(el.value);
    const ok = result === true;
    const err = getErrorEl(el);
    if (ok) {
      el.classList.remove('invalid-input');
      err.textContent = '';
    } else {
      el.classList.add('invalid-input');
      err.textContent = result;
    }
    return ok;
  };

  const updateDonorSubmit = () => {
    if (!isDonorPage || !donorSubmitBtn) return;
    const allOk = [donorFirst, donorLast, donorEmail, donorPhone, donorCity, donorState, donorZipcode, donorCountry, donorAddress1].every(validateDonor);
    donorSubmitBtn.disabled = !allOk;
  };

  const validateReg = (el) => {
    if (!el) return true;
    const name = el.name || el.id;
    const rule = regValidators[name];
    if (!rule) return true;
    const result = rule(el.value);
    const ok = result === true;
    const err = getErrorEl(el);
    if (ok) {
      el.classList.remove('invalid-input');
      err.textContent = '';
    } else {
      el.classList.add('invalid-input');
      err.textContent = result;
    }
    return ok;
  };

  const updateRegSubmit = () => {
    if (!isRegistrationPage || !regSubmitBtn) return;
    const allOk = [regFirst, regLast, regEmail, regPassword, regRepassword, regMobile, regGender].every(validateReg);
    regSubmitBtn.disabled = !allOk;
  };

  if (isDonorPage) {
    [donorFirst, donorLast, donorEmail, donorPhone, donorCity, donorState, donorZipcode, donorCountry, donorAddress1].forEach((el) => {
      if (!el) return;
      el.addEventListener('input', () => {
        validateDonor(el);
        updateDonorSubmit();
      });
      if (el.tagName === 'SELECT') {
        el.addEventListener('change', () => {
          validateDonor(el);
          updateDonorSubmit();
        });
      }
    });

    if (donorForm) {
      donorForm.setAttribute('novalidate', '');
      donorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateDonorSubmit();
        if (donorSubmitBtn && donorSubmitBtn.disabled) {
          showToast('Please fix validation errors.');
          return;
        }
        const btnText = donorSubmitBtn ? donorSubmitBtn.textContent : '';
        if (donorSubmitBtn) {
          donorSubmitBtn.textContent = 'Submitting...';
          donorSubmitBtn.disabled = true;
        }
        setTimeout(() => {
          if (donorSubmitBtn) {
            donorSubmitBtn.textContent = btnText;
            updateDonorSubmit();
          }
          showToast('Donor registration submitted successfully.');
        }, 1000);
      });
    }

    // Initialize state
    updateDonorSubmit();
  }

  if (isRegistrationPage) {
    [regFirst, regLast, regEmail, regPassword, regRepassword, regMobile, regGender].forEach((el) => {
      if (!el) return;
      el.addEventListener('input', () => {
        if (el === regPassword || el === regRepassword) {
          // re-validate both when one changes
          validateReg(regPassword);
          validateReg(regRepassword);
        } else {
          validateReg(el);
        }
        updateRegSubmit();
      });
      if (el.tagName === 'SELECT') {
        el.addEventListener('change', () => {
          validateReg(el);
          updateRegSubmit();
        });
      }
    });

    if (regForm) {
      regForm.setAttribute('novalidate', '');
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateRegSubmit();
        if (regSubmitBtn && regSubmitBtn.disabled) {
          showToast('Please fix validation errors.');
          return;
        }
        const btnText = regSubmitBtn ? regSubmitBtn.textContent : '';
        if (regSubmitBtn) {
          regSubmitBtn.textContent = 'Registering...';
          regSubmitBtn.disabled = true;
        }
        setTimeout(() => {
          if (regSubmitBtn) {
            regSubmitBtn.textContent = btnText;
            updateRegSubmit();
          }
          showToast('Registration submitted.');
        }, 800);
      });
    }

    // Initialize state
    updateRegSubmit();
  }

  // PAGE: Login
  const loginForm = document.getElementById('loginForm');
  const loginUsername = document.getElementById('username');
  const loginPassword = document.getElementById('password');
  const loginSubmit = loginForm ? loginForm.querySelector('button[type="submit"]') : null;
  const isLoginPage = !!(loginForm && loginUsername && loginPassword);

  const validateLoginField = (el) => {
    if (!el) return true;
    const name = el.name || el.id;
    let res = true;
    if (name === 'username') {
      res = el.value.trim().length >= 3 || 'Username must be at least 3 characters.';
    } else if (name === 'password') {
      res = el.value.trim().length >= 6 || 'Password must be at least 6 characters.';
    }
    const ok = res === true;
    const err = getErrorEl(el);
    if (ok) {
      el.classList.remove('invalid-input');
      err.textContent = '';
    } else {
      el.classList.add('invalid-input');
      err.textContent = res;
    }
    return ok;
  };

  const updateLoginSubmit = () => {
    if (!isLoginPage || !loginSubmit) return;
    const allOk = [loginUsername, loginPassword].every(validateLoginField);
    loginSubmit.disabled = !allOk;
  };

  if (isLoginPage) {
    [loginUsername, loginPassword].forEach((el) => {
      if (!el) return;
      el.addEventListener('input', () => {
        validateLoginField(el);
        updateLoginSubmit();
      });
    });

    loginForm.setAttribute('novalidate', '');
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      updateLoginSubmit();
      if (loginSubmit && loginSubmit.disabled) {
        showToast('Please fix validation errors.');
        return;
      }
      const btnText = loginSubmit ? loginSubmit.textContent : '';
      if (loginSubmit) {
        loginSubmit.textContent = 'Logging in...';
        loginSubmit.disabled = true;
      }
      setTimeout(() => {
        if (loginSubmit) {
          loginSubmit.textContent = btnText;
          updateLoginSubmit();
        }
        showToast('Logged in (demo).');
      }, 700);
    });

    // Initialize state
    updateLoginSubmit();
  }
});