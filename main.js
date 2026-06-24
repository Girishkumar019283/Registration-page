document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("regForm");
  const nameInput = document.getElementById("name"); // Moved up to use in both places

  // Target the dropdown elements
  const countrySelect = form.querySelector("select[name='country']");
  const stateSelect = form.querySelector("select[name='state']");

  // Listen for changes on country to clear ONLY the state field
  if (countrySelect) {
    countrySelect.addEventListener("change", () => {
      if (stateSelect) {
        stateSelect.value = ""; // Empties only the state field
        clearFieldError(stateSelect); // Clears the state field's error message instantly
      }
    });
  }

  // Listen for changes on state to clear address fields, city, and pin code
  if (stateSelect) {
    stateSelect.addEventListener("change", () => {
      const address1 = document.getElementById("address1");
      const address2 = document.getElementById("address2");
      const city = document.getElementById("city");
      const pin = document.getElementById("pin");

      if (address1) { address1.value = ""; clearFieldError(address1); }
      if (address2) { address2.value = ""; clearFieldError(address2); }
      if (city) { city.value = ""; clearFieldError(city); }
      if (pin) { pin.value = ""; clearFieldError(pin); }
    });
  }

  nameInput.addEventListener("input", () => {
    // Matches anything that is NOT a letter (a-z, A-Z) or a space (\s)
    const hasInvalidChars = /[^a-zA-Z\s]/.test(nameInput.value);

    if (hasInvalidChars) {
      clearFieldError(nameInput);

      // Updated error message to mention special characters
      showError(nameInput, "Numbers and special characters are not allowed.");

      // Automatically strip out all numbers and special characters instantly
      nameInput.value = nameInput.value.replace(/[^a-zA-Z\s]/g, "");
    } else {
      clearFieldError(nameInput);
    }
  });

  // Real-time validation for Pin Code (Numbers only, Max 6 digits)
  const pinInput = document.getElementById("pin");
  if (pinInput) {
    pinInput.addEventListener("input", () => {
      // 1. Remove any non-numeric character instantly
      pinInput.value = pinInput.value.replace(/\D/g, "");

      // 2. Limit the text field to a maximum of 6 characters
      if (pinInput.value.length > 6) {
        pinInput.value = pinInput.value.slice(0, 6);
      }

      // 3. Clear errors dynamically if they have reached exactly 6 digits
      if (pinInput.value.length === 6) {
        clearFieldError(pinInput);
      }
    });
  }

  // Real-time validation for Mobile Number (Numbers only, Max 10 digits)
  const mobileInput = document.getElementById("mobile");
  if (mobileInput) {
    mobileInput.addEventListener("input", () => {
      // 1. Remove any non-numeric character instantly
      mobileInput.value = mobileInput.value.replace(/\D/g, "");

      // 2. Limit the text field to a maximum of 10 characters
      if (mobileInput.value.length > 10) {
        mobileInput.value = mobileInput.value.slice(0, 10);
      }

      // 3. Clear errors dynamically if they have reached exactly 10 digits
      if (mobileInput.value.length === 10) {
        clearFieldError(mobileInput);
      }
    });
  }

  // NEW: Real-time validation for Email Field
  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.addEventListener("input", () => {
      // 1. Instantly remove any spaces typed or pasted by accident
      emailInput.value = emailInput.value.replace(/\s/g, "");

      // 2. Clear error layout instantly if the input matches a valid format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(emailInput.value)) {
        clearFieldError(emailInput);
      }
    });
  }

  form.addEventListener("submit", (event) => {
    // Prevent form from submitting until validation checks pass
    event.preventDefault();

    // Clear any previous error messages
    clearErrors();

    let isValid = true;

    // 1. Name Validation (Letters and spaces only, min 3 characters)
    if (!/^[a-zA-Z\s]{3,50}$/.test(nameInput.value.trim())) {
      showError(nameInput, "Please enter a valid name (minimum 3 letters).");
      isValid = false;
    }

    // 3. Dropdown Validations (Country & State)
    if (!countrySelect || !countrySelect.value) {
      showError(countrySelect, "Please select your country.");
      isValid = false;
    }
    if (!stateSelect || !stateSelect.value) {
      showError(stateSelect, "Please select your state.");
      isValid = false;
    }

    // 4. Pin Code Validation (Exactly 6 digits)
    if (pinInput) {
      const pinRegex = /^\d{6}$/;
      if (!pinRegex.test(pinInput.value.trim())) {
        showError(pinInput, "Please enter a valid 6-digit pin code.");
        isValid = false;
      }
    }

    // 5. Checkbox Validation (Must select at least one course)
    const courses = form.querySelectorAll("input[name='courses']:checked");
    const checkboxGroup = form.querySelector(".checkbox-group");
    if (courses.length === 0) {
      showError(checkboxGroup, "Please select at least one course.");
      isValid = false;
    }

    // 6. Radio Button Validation (Residence status)
    const citizenship = form.querySelector("input[name='citizenship']:checked");
    const radioGroup = form.querySelector(".radio-group");
    if (!citizenship) {
      showError(radioGroup, "Please select your residence status.");
      isValid = false;
    }

    // 7. Mobile Number Validation (Simple 10-digit check)
    if (mobileInput) {
      const mobileRegex = /^[6-9]\d{9}$/; // Validates typical Indian 10-digit formats starting with 6-9
      if (!mobileRegex.test(mobileInput.value.trim())) {
        showError(mobileInput, "Please enter a valid 10-digit mobile number.");
        isValid = false;
      }
    }

    // 8. Email Validation Standard Regex
    if (emailInput) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, "Please enter a valid email address.");
        isValid = false;
      }
    }

    // Final Action if everything passes
    if (isValid) {
      alert("Registration successful! Submitting your form.");
      form.submit(); // Actually submit the form data to the server
    }
  });

  // Helper function to inject error elements into the DOM dynamically
  function showError(element, message) {
    if (!element) return;
    element.classList.add("invalid");

    const errorDiv = document.createElement("span");
    errorDiv.className = "error-msg";
    errorDiv.innerText = message;

    // Append error below target element layout block
    if (element.classList.contains("checkbox-group") || element.classList.contains("radio-group")) {
      element.parentNode.insertBefore(errorDiv, element.nextSibling);
    } else {
      element.insertAdjacentElement("afterend", errorDiv);
    }
  }

  // Helper function to wipe clean any error styles and tags
  function clearErrors() {
    const errorMessages = document.querySelectorAll(".error-msg");
    errorMessages.forEach(msg => msg.remove());

    const invalidInputs = document.querySelectorAll(".invalid");
    invalidInputs.forEach(input => input.classList.remove("invalid"));
  }

  // Helper function: Clears the error for just ONE specific field during typing
  function clearFieldError(element) {
    if (!element) return;
    element.classList.remove("invalid");
    const nextElement = element.nextElementSibling;
    if (nextElement && nextElement.classList.contains("error-msg")) {
      nextElement.remove();
    }
  }

  // Clear fields helper function
  function clearfields() {
    if(document.getElementById("state")) document.getElementById("state").value = "";
    if(document.getElementById("address1")) document.getElementById("address1").value = "";
    if(document.getElementById("address2")) document.getElementById("address2").value = "";
    if(document.getElementById("city")) document.getElementById("city").value = "";
    if(document.getElementById("pin")) document.getElementById("pin").value = "";
  }
});
