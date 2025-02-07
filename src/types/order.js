/**
 * @typedef {Object} Order
 * @property {string} id - Unique identifier for the order
 * @property {string} user_id - Associated user ID
 * @property {OrderItem[]} items - Array of order items
 * @property {string} status - Order status
 * @property {number} subtotal - Order subtotal
 * @property {number} tax - Tax amount
 * @property {number} shipping - Shipping cost
 * @property {number} total - Total order amount
 * @property {Object} shipping_address - Shipping address
 * @property {Object} billing_address - Billing address
 * @property {string} payment_status - Payment status
 * @property {string} payment_method - Payment method
 * @property {string} created_at - Order creation timestamp
 * @property {string} updated_at - Last update timestamp
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} id - Item identifier
 * @property {string} order_id - Associated order ID
 * @property {string} product_id - Product ID
 * @property {number} quantity - Quantity ordered
 * @property {number} price - Price at time of order
 * @property {Object} product - Product details
 */

// Order status constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

// Payment status constants
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Payment method constants
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  PAYPAL: 'paypal',
  BANK_TRANSFER: 'bank_transfer',
  MOBILE_MONEY: 'mobile_money',
};

// Order validation
export const validateOrder = (order) => {
  const errors = {};

  if (!order.user_id) errors.user_id = 'User ID is required';
  if (!order.items?.length) errors.items = 'Order must contain items';
  if (!order.shipping_address) errors.shipping_address = 'Shipping address is required';
  if (!order.payment_method) errors.payment_method = 'Payment method is required';

  // Validate items
  if (order.items?.length) {
    const itemErrors = order.items.map((item, index) => {
      const err = {};
      if (!item.product_id) err.product_id = 'Product ID is required';
      if (!item.quantity || item.quantity < 1) err.quantity = 'Valid quantity is required';
      if (!item.price || item.price < 0) err.price = 'Valid price is required';
      return Object.keys(err).length ? { index, ...err } : null;
    }).filter(Boolean);

    if (itemErrors.length) errors.items = itemErrors;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Order calculations
export const calculateOrderTotals = (items, shippingCost = 0, taxRate = 0.15) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax + shippingCost;

  return {
    subtotal,
    tax,
    shipping: shippingCost,
    total,
  };
};

// Order status management
export const canCancelOrder = (order) => {
  const cancellableStatuses = [ORDER_STATUS.PENDING, ORDER_STATUS.PROCESSING];
  return cancellableStatuses.includes(order.status);
};

export const canRefundOrder = (order) => {
  return order.status === ORDER_STATUS.DELIVERED && 
         order.payment_status === PAYMENT_STATUS.PAID;
};

// Order history formatting
export const formatOrderHistory = (orders) => {
  return orders.map(order => ({
    ...order,
    created_at: new Date(order.created_at).toLocaleDateString(),
    status_label: order.status.charAt(0).toUpperCase() + order.status.slice(1),
    total_formatted: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(order.total),
  }));
};
