// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

// Password validation (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Phone number validation
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

// URL validation
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Required field validation
export const isRequired = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
  return value !== undefined && value !== null && value !== '';
};

// Number range validation
export const isInRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

// File size validation (in bytes)
export const isValidFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

// File type validation
export const isValidFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

// Credit card validation
export const isValidCreditCard = (number) => {
  // Remove spaces and dashes
  number = number.replace(/[\s-]/g, '');
  
  // Check if the number contains only digits
  if (!/^\d+$/.test(number)) return false;
  
  // Luhn Algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Form validation helper
export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const value = values[field];
    const fieldRules = rules[field];
    
    if (fieldRules.required && !isRequired(value)) {
      errors[field] = 'This field is required';
    } else if (value) {
      if (fieldRules.email && !isValidEmail(value)) {
        errors[field] = 'Invalid email address';
      }
      if (fieldRules.password && !isValidPassword(value)) {
        errors[field] = 'Password must be at least 8 characters long and contain uppercase, lowercase, and number';
      }
      if (fieldRules.phone && !isValidPhone(value)) {
        errors[field] = 'Invalid phone number';
      }
      if (fieldRules.url && !isValidUrl(value)) {
        errors[field] = 'Invalid URL';
      }
      if (fieldRules.minLength && value.length < fieldRules.minLength) {
        errors[field] = `Must be at least ${fieldRules.minLength} characters`;
      }
      if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
        errors[field] = `Must be no more than ${fieldRules.maxLength} characters`;
      }
      if (fieldRules.matches && value !== values[fieldRules.matches]) {
        errors[field] = `Must match ${fieldRules.matches}`;
      }
    }
  });
  
  return errors;
};

// Example usage of form validation:
/*
const rules = {
  email: { required: true, email: true },
  password: { required: true, password: true },
  confirmPassword: { required: true, matches: 'password' },
  phone: { phone: true },
  website: { url: true },
  bio: { maxLength: 500 }
};

const errors = validateForm(formValues, rules);
*/
