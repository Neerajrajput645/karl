const CryptoJS = require("crypto-js");
const axios = require("axios");
require("dotenv/config");

const myFunc = async()=>{
    const url = `http://planapi.in/api/Mobile/FastagInfoFetch?apimember_id=${process.env.PLAN_API_USER_ID}&api_password=${process.env.PLAN_API_PASSWORD}&VehicleNo=MP07ZC1955&operator_code=1`;
    console.log(url);
    const response = await axios.get(url);
    console.log(response.data);
}

myFunc();