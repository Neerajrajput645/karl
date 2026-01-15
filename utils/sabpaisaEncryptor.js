const crypto = require("crypto");

const encryptData = (data, authKey, authIV) => {
  try {
    console.log("Original data:", data);
    console.log("Key length:", authKey.length, "IV length:", authIV.length);
    
    // SabPaisa requires exact 16-byte key and IV
    const key = Buffer.from(authKey.padEnd(16, '\0')); // Use null padding instead of space
    const iv = Buffer.from(authIV);
    
    console.log("Padded Key:", key.toString('hex'));
    console.log("IV:", iv.toString('hex'));
    
    const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
    cipher.setAutoPadding(true);
    
    let encrypted = cipher.update(data, "utf8", "base64");
    encrypted += cipher.final("base64");
    
    console.log("Encrypted data (base64):", encrypted);
    return encrypted;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error(`Encryption failed: ${error.message}`);
  }
};

const decryptData = (encryptedData, authKey, authIV) => {
  try {
    const key = Buffer.from(authKey.padEnd(16, '\0'));
    const iv = Buffer.from(authIV);
    
    const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
    decipher.setAutoPadding(true);
    
    let decrypted = decipher.update(encryptedData, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
};

module.exports = {
  encryptData,
  decryptData
};