// const Shipping = require("../models/shippingSchema");
// const asyncHandler = require("express-async-handler");
// const successHandler = require("../common/successHandler");
// const { encryptFunc } = require("../common/encryptDecrypt");

// shipping address list by User
// const shippingList = asyncHandler(async (req, res) => {
//   const { _id } = req.data;
//   const dataFound = await Shipping.find({ userId: _id });

//   // success respond
//   successHandler(req, res, {
//     Remarks: "Fetch All Shipping Address",
//     Data: encryptFunc(dataFound.reverse()),
//   });
// });

// // add shipping address
// const addShipping = asyncHandler(async (req, res) => {
//   const { _id } = req.data;

//   const newAddress = new Shipping({ userId: _id, ...req.body });
//   await newAddress.save();

//   // successHandler
//   successHandler(req, res, { Remarks: "Added shipping address." });
// });

// // remove shipping address
// const deleteShipping = asyncHandler(async (req, res) => {
//   const { shippingId } = req.params;
//   const { _id } = req.data;
//   const findShipping = await Shipping.findOne({ _id: shippingId, userId: _id });

//   //   throw error if shipping id invalid
//   if (!findShipping) {
//     res.status(400);
//     throw new Error("Please enter valid shipping id.");
//   }

//   await Shipping.findByIdAndDelete(shippingId);
//   // success respond
//   successHandler(req, res, { Remarks: "Removed Shipping Address" });
// });

// // update shipping address
// const updateShipping = asyncHandler(async (req, res) => {
//   const { shippingId } = req.params;
//   const { _id } = req.data;
//   const findShipping = await Shipping.findOne({ _id: shippingId, userId: _id });

//   //   throw error if shipping id invalid
//   if (!findShipping) {
//     res.status(400);
//     throw new Error("Please enter valid shipping id.");
//   }

//   await Shipping.findByIdAndUpdate(shippingId, { ...req.body });

//   // successHandler
//   successHandler(req, res, { Remarks: "Update Shipping Address" });
// });

// module.exports = { shippingList, addShipping, deleteShipping, updateShipping };
