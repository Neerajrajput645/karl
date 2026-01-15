// const asyncHandler = require("express-async-handler");
// const successHandler = require("../common/successHandler");
// const SendToBank = require("../models/sendToBank");
// const User = require("../models/userSchema");
// const Wallet = require("../models/walletSchema");

// const createRequest = asyncHandler(async (req, res) => {
//   const { _id } = req.data;
//   const { amount } = req.body;

//   if (!amount || isNaN(amount) || amount <= 0) {
//     res.status(400);
//     throw new Error("Valid amount is required");
//   }

//   const user = await User.findOne({ _id, status: true });
//   if (!user) {
//     res.status(404);
//     throw new Error("User not found");
//   }

//   const flag = await Wallet.find();
//   console.log("_id", _id, flag);

//   const wallet = await Wallet.findOne({ userId: _id });
//   if (!wallet) {
//     res.status(404);
//     throw new Error("User wallet not found");
//   }

//   if (wallet.balance < amount) {
//     res.status(400);
//     throw new Error("Insufficient wallet balance");
//   }

//   const request = await SendToBank.create({
//     userId: _id,
//     amount,
//     status: "PENDING",
//   });

//   wallet.balance -= amount;
//   await wallet.save();

//   return successHandler(req, res, {
//     remark: "Request submitted successfully",
//     data: request,
//   });
// });

// const allRequests = asyncHandler(async (req, res) => {
//   const { status } = req.query;
//   const allowedStatuses = ["PENDING", "ACCEPT", "DECLINE"];
//   const conditions = {};

//   if (status && allowedStatuses.includes(status.toUpperCase())) {
//     conditions.status = status.toUpperCase();
//   }

//   const requests = await SendToBank.find(conditions)
//     .sort({ createdAt: -1 })
//     .select("-__v");

//   return successHandler(req, res, {
//     remark: "Requests fetched successfully",
//     data: {
//       requests,
//     },
//   });
// });

// const userRequests = asyncHandler(async (req, res) => {
//   const { _id } = req.data;
//   const { status } = req.query;
//   const allowedStatuses = ["PENDING", "ACCEPT", "DECLINE"];
//   const conditions = { userId: _id };

//   if (status && allowedStatuses.includes(status.toUpperCase())) {
//     conditions.status = status.toUpperCase();
//   }
//   const requests = await SendToBank.find(conditions)
//     .sort({
//       createdAt: -1,
//     })
//     .select("-__v");

//   return successHandler(req, res, {
//     remark: "Requests fetched successfully",
//     data: {
//       requests,
//     },
//   });
// });

// const actionRequest = asyncHandler(async (req, res) => {
//   const { status } = req.body;
//   const { requestId } = req.params;

//   const validStatuses = ["ACCEPT", "DECLINE"];
//   const newStatus = status?.toUpperCase();

//   if (!newStatus || !validStatuses.includes(newStatus)) {
//     res.status(400);
//     throw new Error("Invalid or missing status");
//   }

//   const request = await SendToBank.findOne({
//     _id: requestId,
//     status: "PENDING",
//   });
//   if (!request) {
//     res.status(404);
//     throw new Error("Request not found or already processed");
//   }

//   const user = await User.findOne({ _id: request.userId, status: true });
//   if (!user) {
//     res.status(404);
//     throw new Error("User not found");
//   }

//   const wallet = await Wallet.findOne({ userId: user._id });
//   if (!wallet) {
//     res.status(404);
//     throw new Error("User wallet not found");
//   }

//   if (newStatus === "DECLINE") {
//     wallet.balance += request.amount; // Refund amount to wallet
//     await wallet.save();
//   }

//   request.status = newStatus;
//   await request.save();

//   return successHandler(req, res, {
//     remark: `Request ${newStatus.toLowerCase()}ed successfully`,
//     data: request,
//   });
// });

// module.exports = {
//   createRequest,
//   allRequests,
//   userRequests,
//   actionRequest,
// };
