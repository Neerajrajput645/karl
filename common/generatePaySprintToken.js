const jwt = require("jsonwebtoken");
const { generateOrderId } = require("./generateOrderId");
// Generate Token
const generatePaySprintToken = () => {
  const timestamp = Math.floor(Date.now() / 1000);
  const JWT_SECRET_KEY = process.env.PAYSPRINT_JWT_SECRET;
  const payload = {
    timestamp,
    partnerId: "PS001701",
    reqid: generateOrderId(), //(this is a unique intiger for each request)
  };
  return jwt.sign(payload, JWT_SECRET_KEY, { algorithm: "HS256" });
};

module.exports = { generatePaySprintToken };
