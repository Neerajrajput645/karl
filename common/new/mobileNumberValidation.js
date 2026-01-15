/**
 * Normalize Indian mobile number to 10 digits
 * @param {string | number} mobile
 * @returns {string} normalized 10-digit mobile number
 * @throws {Error} if mobile format is invalid
 */
function normalizeMobileNumber(mobile) {
  if (!mobile) {
    res.status(400);
    throw new Error("Mobile number is required");
  }

  // Convert to string and trim spaces
  mobile = mobile.toString().trim();

  console.log("Original Mobile:", mobile);

  // ✅ Case 1: 12 digits and starts with '91'
  if (mobile.length === 12 && mobile.startsWith("91")) {
    const normalized = mobile.substring(2);
    console.log("Removed 91:", normalized);
    return normalized;
  }

  // ✅ Case 2: 11 digits and starts with '0'
  if (mobile.length === 11 && mobile.startsWith("0")) {
    const normalized = mobile.substring(1);
    console.log("Removed 0:", normalized);
    return normalized;
  }

  // ✅ Case 3: Already 10 digits
  if (mobile.length === 10) {
    console.log("Already 10 digits:", mobile);
    return mobile;
  }

  // ❌ Invalid format
  res.status(400);
  throw new Error("Invalid mobile number format");
}

module.exports = normalizeMobileNumber;