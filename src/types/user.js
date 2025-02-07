/**
 * @typedef {Object} User
 * @property {string} id - Unique identifier for the user
 * @property {string} email - User's email address
 * @property {string} full_name - User's full name
 * @property {string} avatar_url - URL to user's avatar image
 * @property {string} phone - User's phone number
 * @property {string} address - User's address
 * @property {string} city - User's city
 * @property {string} country - User's country
 * @property {string} role - User's role (admin/customer)
 * @property {string} created_at - Account creation timestamp
 * @property {string} updated_at - Last update timestamp
 */

// User roles and status constants
export const USER_ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
  GUEST: 'guest',
};

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  DELETED: 'deleted',
};

// User validation
export const validateUser = (user) => {
  const errors = {};

  if (!user.email) {
    errors.email = 'Email is required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(user.email)) {
    errors.email = 'Invalid email address';
  }

  if (!user.full_name) {
    errors.full_name = 'Full name is required';
  }

  if (user.phone && !/^\+?[\d\s-]{10,}$/.test(user.phone)) {
    errors.phone = 'Invalid phone number';
  }

  if (user.password && user.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// User profile management
export const getUserDisplayName = (user) => {
  if (!user) return 'Guest';
  return user.full_name || user.email.split('@')[0];
};

export const getAvatarFallback = (user) => {
  if (!user?.full_name) return 'G';
  return user.full_name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Address validation
export const validateAddress = (address) => {
  const errors = {};

  if (!address.street) errors.street = 'Street address is required';
  if (!address.city) errors.city = 'City is required';
  if (!address.country) errors.country = 'Country is required';
  if (!address.postal_code) errors.postal_code = 'Postal code is required';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// User preferences management
export const DEFAULT_USER_PREFERENCES = {
  email_notifications: true,
  sms_notifications: false,
  language: 'en',
  currency: 'USD',
  theme: 'light',
};

export const validateUserPreferences = (preferences) => {
  const validLanguages = ['en', 'fr', 'es'];
  const validCurrencies = ['USD', 'EUR', 'GBP'];
  const validThemes = ['light', 'dark', 'system'];

  return {
    ...DEFAULT_USER_PREFERENCES,
    ...preferences,
    language: validLanguages.includes(preferences.language) 
      ? preferences.language 
      : DEFAULT_USER_PREFERENCES.language,
    currency: validCurrencies.includes(preferences.currency)
      ? preferences.currency
      : DEFAULT_USER_PREFERENCES.currency,
    theme: validThemes.includes(preferences.theme)
      ? preferences.theme
      : DEFAULT_USER_PREFERENCES.theme,
  };
};
