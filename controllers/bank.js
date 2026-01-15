// const Bank = require("../models/bankSchema");
// const Service = require("../models/serviceSchema");
// const asyncHandler = require("express-async-handler");
// const successHandler = require("../common/successHandler");
// const { encryptFunc } = require("../common/encryptDecrypt");

// // bank list
// const bankList = asyncHandler(async (req, res) => {
//   const { _id } = req.data;
//   const Data = await Bank.find({ userId: _id });

//   // success response
//   successHandler(req, res, {
//     Remarks: "Fetch all bank accounts",
//     Data: encryptFunc(Data.reverse()),
//   });
// });

// // add bank detail
// const addBankDetail = asyncHandler(async (req, res) => {
//   const findService = await Service.findOne({ name: "BANK_ACCOUNT" });
//   if (findService.status) {
//     const { _id } = req.data;

//     const findB = await Bank.findOne({
//       accountNo: req.body.accountNo,
//       userId: _id,
//     });

//     if (findB) {
//       res.status(400);
//       throw new Error("This account number already added.");
//     } else {
//       const newBankDetail = new Bank({ userId: _id, ...req.body });
//       await newBankDetail.save();
//       // success respond
//       successHandler(req, res, { Remarks: "Bank Detail Saved" });
//     }
//   } else {
//     res.status(400);
//     throw new Error("This service currently block");
//   }
// });

// // delete bank detail
// const deleteBank = asyncHandler(async (req, res) => {
//   const { bankId } = req.params;
//   const { _id } = req.data;

//   const findBank = await Bank.findOne({ userId: _id, _id: bankId });

//   // throw error if invalid bank id
//   if (!findBank) {
//     res.status(400);
//     throw new Error("Invalid bank id.");
//   }

//   await Bank.findByIdAndDelete(bankId);

//   // success respond
//   successHandler(req, res, { Remarks: "Bank detail removed." });
// });

// // update bank
// const updateBankDetail = asyncHandler(async (req, res) => {
//   const { bankId } = req.params;
//   const { _id } = req.data;
//   const findBank = await Bank.findOne({ userId: _id, _id: bankId });

//   // throw error if invalid bank id
//   if (!findBank) {
//     res.status(400);
//     throw new Error("Invalid bank id.");
//   }

//   await Bank.findByIdAndUpdate(bankId, { ...req.body });

//   // success respond
//   successHandler(req, res, { Remarks: "Bank Detail Updated" });
// });

// module.exports = { bankList, addBankDetail, deleteBank, updateBankDetail };
