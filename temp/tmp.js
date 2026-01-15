// const axios = require("axios");

// const fetchDthPlans = async (req, res) => {
//   try {
//     const operatorCode = 27; // Operator code for DTH
//     const apimember_id = "6371";
//     const api_password = "Paisaplus@123#";

//     const url = "https://planapi.in/api/Mobile/DthPlans";

//     const response = await axios.get(url, {
//       params: {
//         apimember_id,
//         api_password,
//         operatorcode: operatorCode,
//       },
//     });

//     console.log("DTH Plans fetched successfully:", JSON.stringify(response.data, null, 2));

//     return {
//       status: "success",
//       data:  JSON.stringify(response.data, null, 2),
//     };
//   } catch (error) {
//     console.error("Error fetching DTH plans:", error.message);
//     return {
//       status: "failed",
//       message: error.response?.data || "Unable to fetch DTH plans",
//     };
//   }
// };

// module.exports = { fetchDthPlans };

const axios = require("axios");
const successHandler = require("../common/successHandler");
const asyncHandler = require("express-async-handler");
const fetchBillPayment = asyncHandler(async () => {
  console.log("Fetch Bill Payment called");
  try {

    //========================================================================================
    const url = `https://api.techember.in/app/recharges/bill-payment.php`;

    // number,
    //   operator,
    //   circle,
    //   amount,
    //   account,
    //   othervalue,
    //   serviceId,
    //   othervalue1,
    //   transactionId,


    const bodyData = {
      operator: {
        name: "Aavantika Gas Ltd",
        category: "gas",
        operator_id: "221",
      },
      amount: "10",
      type: "gas",
      token: process.env.BILLHUB_TOKEN,
      number:"PD03GWB4548",
      // additional_params: additionalParams,
      bill_details: {
        // account,
        // othervalue,
        amount:"10",
        transactionId: `TXN${Date.now()}`,
      },
      op_code: "221",
    };

    const response = await axios.post(url, bodyData);

    console.log("Bill Payment Response:", response.data);
    return "Bill Payment fetched successfully:", successHandler(response.data);
  } catch (error) {

    console.error("Error fetching Bill Payment:", error);
    return ({
      status: "failed",
      message: error.response?.data || "Unable to fetch Bill Payment",
    });
  }
});

fetchBillPayment();

// module.exports = { fetchBillPayment };