/**
 * @typedef {Object} Product
 * @property {string} id - Unique identifier for the product
 * @property {string} name - Name of the product
 * @property {string} description - Detailed description of the product
 * @property {number} price - Current price of the product
 * @property {number} [old_price] - Previous price for showing discounts
 * @property {string} category - Product category
 * @property {string[]} images - Array of image URLs
 * @property {number} stock - Current stock quantity
 * @property {string} sku - Stock keeping unit
 * @property {string[]} sizes - Available sizes
 * @property {string[]} colors - Available colors
 * @property {number} rating - Average product rating
 * @property {number} reviews_count - Number of reviews
 * @property {string} created_at - Creation timestamp
 * @property {string} updated_at - Last update timestamp
 */

/**
 * @typedef {Object} ProductReview
 * @property {string} id - Review identifier
 * @property {string} product_id - Associated product ID
 * @property {string} user_id - User who wrote the review
 * @property {number} rating - Rating value (1-5)
 * @property {string} comment - Review text
 * @property {string} created_at - Review timestamp
 */

/**
 * @typedef {Object} ProductCategory
 * @property {string} id - Category identifier
 * @property {string} name - Category name
 * @property {string} slug - URL-friendly name
 * @property {string} description - Category description
 * @property {string} image - Category image URL
 */

// Product status constants
export const PRODUCT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  OUT_OF_STOCK: 'out_of_stock',
  DISCONTINUED: 'discontinued',
};

// Product category constants
export const PRODUCT_CATEGORIES = {
  CASUAL: 'casual',
  FORMAL: 'formal',
  SPORT: 'sport',
  LIMITED: 'limited-edition',
};

// Product validation
export const validateProduct = (product) => {
  const errors = {};

  if (!product.name) errors.name = 'Name is required';
  if (!product.price || product.price <= 0) errors.price = 'Valid price is required';
  if (!product.category) errors.category = 'Category is required';
  if (!product.description) errors.description = 'Description is required';
  if (!product.images?.length) errors.images = 'At least one image is required';
  if (!product.sizes?.length) errors.sizes = 'At least one size is required';
  if (typeof product.stock !== 'number') errors.stock = 'Stock quantity is required';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Product price calculation
export const calculateDiscountedPrice = (price, discountPercentage) => {
  return price * (1 - discountPercentage / 100);
};

// Stock status check
export const getStockStatus = (stock) => {
  if (stock <= 0) return 'Out of Stock';
  if (stock < 5) return 'Low Stock';
  return 'In Stock';
};
