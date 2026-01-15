const generateOrderId = () => {
  const timestamp = Date.now().toString();
  const randomId = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  const orderId = timestamp + randomId;
  return orderId.slice(-10);
};

const GeneratePayuTxnId = () => {
  const timestamp = Date.now(); // Current timestamp in milliseconds
  return `PAYU_${timestamp}`;
};

module.exports = { generateOrderId, GeneratePayuTxnId };
