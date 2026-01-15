const axios = require('axios');

const allOps = async () => {
  try {
    console.log("Fetching all operators data...");
    const url = "https://api.techember.in/app/bbps-operators.php";
    const response = await axios.get(url);
    console.log("Operators data fetched successfully!", response.data);
    return response.data.data;
  } catch (err) {
    console.error("Error fetching operators data:", err.message);
    throw err;
  }
};

module.exports = { allOps };
