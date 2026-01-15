const axios = require("axios");

// const MSG91_API_KEY = process.env.MSG91_API_KEY;
// const MSG91_TEMPLATE_KEY = process.env.MSG91_TEMPLATE_KEY;
// const MSG91_BASE_URL = "https://control.msg91.com/api/v5/";

// const sendSMS = async (phoneNumber, message) => {
//   const endpoint = "flow";
//   const data = {
//     template_id: MSG91_TEMPLATE_KEY,
//     recipients: [{ mobiles: `91${phoneNumber}`, OTP: message }],
//   };

//   try {
//     const response = await axios.post(`${MSG91_BASE_URL}${endpoint}`, data, {
//       headers: {
//         authkey: MSG91_API_KEY,
//       },
//     });
//     const responseData = response.data;
//     return responseData;
//   } catch (error) {
//     throw error;
//   }
// };

// const sendSMS = async (phoneNumber, message) => {
//   try {
//     const response = await axios.get(
//       `https://bulk9.com/dev/api?authorization=${process.env.BULKSMS_TOKEN}&route=dlt&sender_id=PAYDEP&message=626&variables_values=${message}&flash=0&numbers=${phoneNumber}`
//     );
//     const responseData = response.data;
//     return responseData;
//   } catch (error) {
//     throw error;
//   }
// };

const sendSMS = async (phoneNumber, message) => {
  try {
    const response = await axios.post(
      `https://sms.renflair.in/V1.php?API=${process.env.RENFLAIR_KEY}&PHONE=${phoneNumber}&OTP=${message}`
    );
    const responseData = response.data;
    return responseData;
  } catch (error) {
    throw error;
  }
};

module.exports = sendSMS;
