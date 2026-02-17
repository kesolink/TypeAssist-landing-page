// Currency formatting utilities for TypeAssist

/**
 * Format amount in Nigerian Naira
 * @param {number} amount - Amount to format
 * @returns {string} Formatted Naira string (e.g., "₦100,000")
 */
export const formatNaira = (amount) => {
  return `₦${amount.toLocaleString('en-NG')}`;
};

/**
 * Format amount in USDT
 * @param {number} amount - Amount to format
 * @returns {string} Formatted USDT string (e.g., "70 USDT")
 */
export const formatUSDT = (amount) => {
  return `${amount} USDT`;
};

/**
 * Format currency based on type
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency type ('NGN', 'naira', 'USDT', 'usdt')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency) => {
  const currencyLower = currency.toLowerCase();
  if (currencyLower === 'ngn' || currencyLower === 'naira') {
    return formatNaira(amount);
  }
  return formatUSDT(amount);
};
