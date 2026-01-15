const CryptoJS = require("crypto-js");
const CRYPTO_SECRET = process.env.CRYPTO_SECRET;

const encryptFunc = (data) => {
  const encryptData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    CRYPTO_SECRET
  ).toString();
  return encryptData;
};
const decryptFunc = (data) => {
  const decryptData = CryptoJS.AES.decrypt(data, CRYPTO_SECRET);
  const parseDecryptData = JSON.parse(decryptData.toString(CryptoJS.enc.Utf8));
  return parseDecryptData;
};

module.exports = { encryptFunc, decryptFunc };
