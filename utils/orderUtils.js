// utils/helpers.js

const generateOrderId = () => {
  // Current timestamp in milliseconds
  const timestamp = Date.now();

  // Random 6-character alphanumeric string
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomStr = "";
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Combine timestamp + random string
  return `SP_ORD${timestamp}${randomStr}`;
};

module.exports = { generateOrderId };