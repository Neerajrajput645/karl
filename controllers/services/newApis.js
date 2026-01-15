const asyncHandler = require("express-async-handler");
const axios = require("axios");
const successHandler = require("../../common/successHandler");
const CryptoJS = require("crypto-js");
require("dotenv").config();
const { generateOrderId } = require("../../common/generateOrderId");
// Check Balance from BillHub
const checkBalance = asyncHandler(async (req, res) => {
    try {
        const token = process.env.BILLHUB_TOKEN;
        const response = await axios.get(`https://api.techember.in/app/get-balance.php?token=${token}`);
        successHandler(req, res, {
            Remarks: "Balance fetched successfully",
            Data: response.data,
        });
    } catch (error) {
        res.status(400);
        throw new Error(error.message || error.response || "Error fetching balance");
    }
});

