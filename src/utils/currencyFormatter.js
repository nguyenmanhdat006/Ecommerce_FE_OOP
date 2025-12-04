/**
 * Formats a number as USD currency
 * @param {number|string} amount - The amount to format
 * @param {Object} options - Optional formatting options
 * @param {string} options.locale - Locale string (default: "en-US")
 * @param {string} options.currency - Currency code (default: "USD")
 * @param {number} options.minimumFractionDigits - Minimum decimal places (default: 2)
 * @param {number} options.maximumFractionDigits - Maximum decimal places (default: 2)
 * @returns {string} - Formatted currency string (e.g., "$1,234.56")
 */
export const formatCurrency = (
  amount,
  options = {}
) => {
  // Handle null, undefined, or invalid values
  if (amount === null || amount === undefined || amount === "" || isNaN(amount)) {
    return "$0.00";
  }

  // Convert to number if it's a string
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  // Check if conversion was successful
  if (isNaN(numAmount)) {
    return "$0.00";
  }

  const {
    locale = "en-US",
    currency = "USD",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numAmount);
};

/**
 * Formats a number as USD currency without the currency symbol (for display purposes)
 * @param {number|string} amount - The amount to format
 * @param {Object} options - Optional formatting options
 * @returns {string} - Formatted number string (e.g., "1,234.56")
 */
export const formatCurrencyNumber = (
  amount,
  options = {}
) => {
  if (amount === null || amount === undefined || amount === "" || isNaN(amount)) {
    return "0.00";
  }

  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return "0.00";
  }

  const {
    locale = "en-US",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numAmount);
};

