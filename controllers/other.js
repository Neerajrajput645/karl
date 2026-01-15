// const asyncHandler = require("express-async-handler");

// const User = require("../models/userSchema");
// const Transaction = require("../models/txnSchema");
// const successHandler = require("../common/successHandler");
// const PrimeBenefit = require("../models/primeBenefitSchema");

// // @desc earn more points
// // @path /api/earn-more-points
// const earnMorePoints = asyncHandler(async (req, res) => {
//   const userFound = req.data;

//   const addMoneyFound = await Transaction.find({
//     userId: userFound._id,
//     txnName: "Add",
//   });

//   const sendMoneyFound = await Transaction.find({
//     userId: userFound._id,
//     txnName: "Send",
//   });

//   const referralFound = await User.findOne({ referBy: userFound.referalId });

//   const Data = [
//     {
//       name: "Share to friend",
//       desc: "Earn 10 GoPoints on every refer.",
//       status: referralFound ? 1 : 0,
//       points: 10,
//     },
//     {
//       name: "KYC verification",
//       desc: "Complete you kyc & get 5 GoPoints",
//       status: userFound.isVerified ? 1 : 0,
//       points: 5,
//     },
//     {
//       name: "Add money to wallet",
//       desc: "Add minimum 100 rupees to wallet & get 5 GoPoints",
//       status: addMoneyFound.length !== 0 ? 1 : 0,
//       points: 5,
//     },
//     {
//       name: "First send money",
//       desc: "Send minimum 100 rupees to freind & get 2 GoPoints",
//       status: sendMoneyFound.length !== 0 ? 1 : 0,
//       points: 2,
//     },
//     {
//       name: "First mobile recharge",
//       desc: "Create your first mobile recharge & get 10 GoPoints",
//       status: 0,
//       points: 10,
//     },
//     {
//       name: "Book flight ticket",
//       desc: "Book your first flight ticket & get 10 GoPoints",
//       status: 0,
//       points: 10,
//     },
//   ];

//   // success handler
//   successHandler(req, res, { Remarks: "Earn More Points", Data });
// });

// prime benefits list
// const primeBenefitsList = asyncHandler(async (req, res) => {
//   const data = await PrimeBenefit.find();
//   successHandler(req, res, { Remarks: "All Prime benafits", Data: data });
// });

// prime benefits add
// const primeBenefitsCreate = asyncHandler(async (req, res) => {
//   const { name, amount } = req.body;

//   if (Number(amount) > 0) {
//     if (!name || !amount) {
//       res.status(400);
//       throw new Error("All field are mandatory");
//     }

//     const newBenefit = new PrimeBenefit({ ...req.body });
//     await newBenefit.save();
//     successHandler(req, res, { Remarks: "Create Prime Benefit" });
//   } else {
//     res.status(400);
//     throw new Error("Amount Should be positive");
//   }
// });

// prime benefits add
// const primeBenefitsUpdate = asyncHandler(async (req, res) => {
//   const { benefitId, ...other } = req.body;
//   const findBenefit = await PrimeBenefit.findById(benefitId);

//   if (!findBenefit) {
//     res.status(400);
//     throw new Error("Invalid benefit id");
//   }

//   await PrimeBenefit.findByIdAndUpdate(benefitId, { ...other });
//   successHandler(req, res, { Remarks: "Updated Prime Benefit" });
// });

// module.exports = {
//   earnMorePoints,
// };
