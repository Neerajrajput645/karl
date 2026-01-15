const { default: axios } = require("axios");
const PaygicToken = require("../models/paygicTokenSchema");

// const generateAndSavePaygicToken = async () => {
//   try {
//     const response = await axios.post(
//       "https://server.paygic.in/api/v2/createMerchantToken",
//       {
//         mid: process.env.PAYGIC_MID, // Replace with actual MID
//         password: process.env.PAYGIC_PASSWORD, // Replace with actual password
//       }
//     );

//     if (response.data && response.data.status) {
//       const tokenData = {
//         paygictoken: response.data.data.token,
//         expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Token expiry after 30 days
//       };

//       // Save or update token in DB
//       await PaygicToken.findOneAndUpdate({}, tokenData, { upsert: true });
//     } else {
//       console.error("Failed to generate token:", response.data.msg);
//     }
//   } catch (error) {
//     console.error("Error generating token:", error.message);
//   }
// };

// const getPaygicTokenFromDB = async () => {
//   const tokenDoc = await PaygicToken.findOne({});
//   const now = new Date();
//   console.log(tokenDoc, "tokenDoc");

//   if (tokenDoc && now < new Date(tokenDoc.expiresAt)) {
//     console.log("shi hai, Expired nhi hua");
//     return tokenDoc.paygictoken;
//   } else {
//     try {
//       await generateAndSavePaygicToken();
//       const newTokenDoc = await PaygicToken.findOne({});
//       if (newTokenDoc) {
//         return newTokenDoc.paygictoken;
//       } else {
//         throw new Error("Token generation failed");
//       }
//     } catch (error) {
//       console.error("Error generating Paygic token:", error);
//       return null; // Or handle it as per your requirement
//     }
//   }
// };


// const checkAndRenewToken = async () => {
//   const tokenDoc = await PaygicToken.findOne({});
//   const now = new Date();

//   if (!tokenDoc || now >= new Date(tokenDoc.expiresAt)) {
//     console.log("Token expired or not found. Generating a new one...");
//     await generateAndSavePaygicToken();
//   } else {
//     console.log("Token is valid, no renewal needed.");
//   }
// };

const generateAndSavePaygicToken = async () => {
  try {
    const response = await axios.post(
      "https://server.paygic.in/api/v2/createMerchantToken",
      {
        mid: process.env.PAYGIC_MID, // Merchant ID from env
        password: process.env.PAYGIC_PASSWORD, // Password from env
      }
    );

    if (response.data && response.data.status) {
      const tokenData = {
        paygictoken: response.data.data.token,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30-day expiry
      };

      // Save or update token in DB
      await PaygicToken.findOneAndUpdate({}, tokenData, { upsert: true });

      console.log("Token saved successfully:", tokenData.paygictoken);
      return tokenData.paygictoken;
    } else {
      console.error("Failed to generate token:", response.data.msg);
      return null;
    }
  } catch (error) {
    console.error("Error generating token:", error.message);
    return null;
  }
};

const getPaygicTokenFromDB = async () => {
  const tokenDoc = await PaygicToken.findOne({});
  const now = new Date();

  if (tokenDoc && now < new Date(tokenDoc.expiresAt)) {
    console.log("Token is valid.");
    return tokenDoc.paygictoken;
  }

  console.log("Token expired or not found, generating a new one...");
  return generateAndSavePaygicToken();
};

const checkAndRenewToken = async () => {
  const tokenDoc = await PaygicToken.findOne({});
  const now = new Date();

  if (!tokenDoc || now >= new Date(tokenDoc.expiresAt)) {
    console.log("Token expired or not found. Generating a new one...");
    await generateAndSavePaygicToken();
  } else {
    console.log("Token is valid, no renewal needed.");
  }
};

module.exports = {
  generateAndSavePaygicToken,
  getPaygicTokenFromDB,
  checkAndRenewToken,
};
