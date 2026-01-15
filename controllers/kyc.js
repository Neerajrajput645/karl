// const Txn = require("../models/txnSchema");
// const KYC = require("../models/kycSchema");
// const newKYC = require("../models/newKycSchema");
// const User = require("../models/userSchema");
// const Wallet = require("../models/walletSchema");
// const sendEmail = require("../common/sendEmail");
// const Service = require("../models/serviceSchema");
// const asyncHandler = require("express-async-handler");
// const getIpAddress = require("../common/getIpAddress");
// const successHandler = require("../common/successHandler");
// const Notification = require("../models/notificationSchema");
// const sendNotification = require("../common/sendNotification");
// const deletePreviousImage = require("../common/deletePreviousImage");
// const { encryptFunc } = require("../common/encryptDecrypt");
// const axios = require("axios");

// // check kyc
// // const checkKyc = asyncHandler(async (req, res) => {
// //   const userFound = req.data;
// //   const { txnAmount } = req.body;

// //   if (Number(txnAmount) > 0) {
// //     const currentDate = new Date();
// //     const financialYearStart = new Date(currentDate.getFullYear(), 3, 1);
// //     const financialYearEnd = new Date(currentDate.getFullYear() + 1, 2, 31);

// //     const all = await Txn.find({
// //       userId: userFound._id,
// //       txnName: "Add",
// //       txnStatus: "TXN_SUCCESS",
// //       $expr: {
// //         $and: [
// //           { $gte: ["$txnDate", financialYearStart] },
// //           { $lte: ["$txnDate", financialYearEnd] },
// //         ],
// //       },
// //     });

// //     const sum = all.reduce((acc, item) => acc + item.txnAmount, 0);

// //     if (
// //       sum + txnAmount > process.env.ADD_LIMIT_WITHOUT_KYC &&
// //       !userFound.isVerified
// //     ) {
// //       res.status(400);
// //       throw new Error("Please complete your kyc to increase your limit");
// //     }

// //     successHandler(req, res, { Remarks: "You can add" });
// //   } else {
// //     res.status(400);
// //     throw new Error("TxnAmount Should be positive");
// //   }
// // });

// // kyc status
// const kycStatus = asyncHandler(async (req, res) => {
//   const { _id } = req.data;
//   const { role } = req.query;
//   const found = await KYC.findOne({ userId: _id, role });
//   if (found) {
//     const statusManage = () => {
//       switch (found.status) {
//         case "Approve":
//           return 1;

//         case "Pending":
//           return 3;

//         case "Reject":
//           return 4;

//         default:
//           return 1;
//       }
//     };
//     // success handler
//     successHandler(req, res, {
//       Remarks: "Fetch kyc status",
//       ResponseStatus: statusManage(),
//       Data: (found),
//     });
//   } else {
//     successHandler(req, res, {
//       Remarks: "You don't have started the process",
//       ResponseStatus: 5,
//       Data: (found),
//     });
//   }
// });

// // kyc list by Admin
// const kycList = asyncHandler(async (req, res) => {
//   const found = await KYC.find().populate("userId");
//   // success handler
//   successHandler(req, res, {
//     Remarks: "Fetch kyc list",
//     Data: (found),
//   });
// });

// // submit kyc
// const submitKyc = asyncHandler(async (req, res) => {
//   const findService = await Service.findOne({ name: "KYC_VERIFY" });
//   if (findService.status) {
//     const { _id } = req.data;
//     const { role } = req.body.role;
//     try {
//       const kycFound = await KYC.findOne({ userId: _id, role });
//       if (kycFound && kycFound.status === "Pending") {
//         const otherDocPath = req.files["otherDoc"]?.[0]?.path;
//         await KYC.findByIdAndUpdate(kycFound._id, {
//           $set: { otherDoc: otherDocPath },
//         });
//         // success handler
//         successHandler(req, res, {
//           Remarks: "Other documents submitted",
//           ResponseStatus: 3,
//         });
//       } else {
//         // submit kyc documents
//         const panPath = req.files["pan"]?.[0]?.path;
//         const photoPath = req.files["photo"]?.[0]?.path;
//         const aadhaarBackPath = req.files["aadhaarBack"]?.[0]?.path;
//         const aadhaarFrontPath = req.files["aadhaarFront"]?.[0]?.path;

//         const newKyc = new KYC({
//           photo: photoPath,
//           pan: panPath,
//           aadhaarFront: aadhaarFrontPath,
//           aadhaarBack: aadhaarBackPath,
//           userId: _id,
//           role,
//           status: "Pending",
//         });
//         await newKyc.save();
//         // success handler
//         successHandler(req, res, {
//           Remarks: "Documents submitted",
//           ResponseStatus: 3,
//         });
//       }
//     } catch (error) {
//       // remove uploaded files
//       const keys = Object.keys(req.files);
//       keys.map((item) => {
//         deletePreviousImage(req.files[item]?.[0].path);
//       });
//       res.status(400);
//       throw new Error(error);
//     }
//   } else {
//     res.status(400);
//     throw new Error("This service currently block");
//   }
// });

// // approve or disapprove
// const approveKyc = asyncHandler(async (req, res) => {
//   // status should be (Approve, Reject, Pending)
//   const { kycId, status, reason } = req.body;
//   const kycFound = await KYC.findById(kycId);

//   if (!kycId || !status) {
//     res.status(400);
//     throw new Error("All fields are mandatory.");
//   } else {
//     if (kycFound) {
//       const foundData = await User.findById(kycFound.userId);

//       const statusManage = () => {
//         switch (status) {
//           case "Approve":
//             return 1;

//           case "Pending":
//             return 3;

//           case "Reject":
//             return 4;

//           default:
//             return 1;
//         }
//       };

//       if (status === "Reject" && !reason) {
//         res.status(400);
//         throw new Error("Please provide reason to reject.");
//       }
//       await KYC.findByIdAndUpdate(kycId, { $set: { status, reason } });

//       // send email
//       sendEmail(foundData, "USER_KYC_STATUS", status);

//       // notification
//       const notification = {
//         title: "KYC Status",
//         body: `Your kyc is ${status} ${
//           status === "Reject" && `due to ` + reason
//         }`,
//       };

//       const newNotification = new Notification({
//         ...notification,
//         recipient: foundData._id,
//       });
//       await newNotification.save();

//       // send notification
//       foundData?.deviceToken &&
//         sendNotification(notification, foundData?.deviceToken);

//       if (status === "Approve") {
//         await User.findByIdAndUpdate(foundData._id, {
//           $set: { isVerified: true },
//         });
//         await Wallet.updateOne(
//           { userId: foundData._id },
//           { $inc: { goPoints: 5 } }
//         );
//         const txnStatus = new Txn({
//           userId: foundData._id,
//           recipientId: foundData._id,
//           txnName: "Go Points",
//           txnDesc: "Congratulation...! Your kyc complete bonus 5 Go Points.",
//           txnAmount: 5,
//           txnType: "credit",
//           txnId: Math.floor(Math.random() * Date.now()) + "primebonus",
//           orderId: Math.floor(Math.random() * Date.now()) + "primebonus",
//           txnStatus: "TXN_SUCCESS",
//           txnResource: "GoPoints",
//           ipAddress: getIpAddress(req),
//         });
//         await txnStatus.save();
//       }

//       // success handler
//       successHandler(req, res, {
//         Remarks: `${status} kyc`,
//         ResponseStatus: statusManage(),
//       });
//     } else {
//       res.status(400);
//       throw new Error("Invalid kyc doc id");
//     }
//   }
// });
// // approve or disapprove
// const doKyc = asyncHandler(async (req, res) => {
//   // status should be (Approve, Reject, Pending)
//   const { kycId, status, reason } = req.body;
//   const kycFound = await KYC.findById(kycId);

//   if (!kycId || !status) {
//     res.status(400);
//     throw new Error("All fields are mandatory.");
//   } else {
//     if (kycFound) {
//       const foundData = await User.findById(kycFound.userId);

//       const statusManage = () => {
//         switch (status) {
//           case "Approve":
//             return 1;

//           case "Pending":
//             return 3;

//           case "Reject":
//             return 4;

//           default:
//             return 1;
//         }
//       };

//       if (status === "Reject" && !reason) {
//         res.status(400);
//         throw new Error("Please provide reason to reject.");
//       }
//       await KYC.findByIdAndUpdate(kycId, { $set: { status, reason } });

//       // send email
//       sendEmail(foundData, "USER_KYC_STATUS", status);

//       // notification
//       const notification = {
//         title: "KYC Status",
//         body: `Your kyc is ${status} ${
//           status === "Reject" && `due to ` + reason
//         }`,
//       };

//       const newNotification = new Notification({
//         ...notification,
//         recipient: foundData._id,
//       });
//       await newNotification.save();

//       // send notification
//       foundData?.deviceToken &&
//         sendNotification(notification, foundData?.deviceToken);

//       if (status === "Approve") {
//         await User.findByIdAndUpdate(foundData._id, {
//           $set: { isVerified: true },
//         });
//         await Wallet.updateOne(
//           { userId: foundData._id },
//           { $inc: { goPoints: 5 } }
//         );
//         const txnStatus = new Txn({
//           userId: foundData._id,
//           recipientId: foundData._id,
//           txnName: "Go Points",
//           txnDesc: "Congratulation...! Your kyc complete bonus 5 Go Points.",
//           txnAmount: 5,
//           txnType: "credit",
//           txnId: Math.floor(Math.random() * Date.now()) + "primebonus",
//           orderId: Math.floor(Math.random() * Date.now()) + "primebonus",
//           txnStatus: "TXN_SUCCESS",
//           txnResource: "GoPoints",
//           ipAddress: getIpAddress(req),
//         });
//         await txnStatus.save();
//       }

//       // success handler
//       successHandler(req, res, {
//         Remarks: `${status} kyc`,
//         ResponseStatus: statusManage(),
//       });
//     } else {
//       res.status(400);
//       throw new Error("Invalid kyc doc id");
//     }
//   }
// });

// const sendKycOTP = asyncHandler(async (req, res) => {
//   const { Aadhaarid } = req.body;
//   if (!Aadhaarid) {
//     res.status(400);
//     throw new Error("All fields are mandatory.");
//   } else {
//     // const formData = new URLSearchParams();
//     // formData.append("Aadhaarid", Aadhaarid);
//     // formData.append("ApiMode", process.env.API_MODE);
    
//     const data = {
//         Aadhaarid:Aadhaarid,
//         ApiMode:1
//     };

//     const response = await axios.post(
//       `https://planapi.in/Api/Ekyc/AdharVerification`,
//       data,
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           TokenID: process.env.PLAN_TOKEN_ID,
//           ApiUserID: process.env.PLAN_API_USER_ID,
//           ApiPassword: process.env.PLAN_API_PASSWORD_hash ,
//         },
//       }
//     );
//     // if error
//     if (response.data.status !== "success") {
//       res.status(400);
//       throw new Error(response?.data?.response.message || response?.data.msg);
//     }
//     // success respond
//     successHandler(req, res, {
//       Remarks: response?.data?.response.message,
//       Data: response?.data,
//     });
//   }
// });
// const verifyKycOTP = asyncHandler(async (req, res) => {
//   const { Aadhaarid, OTP, ReqId } = req.body;
//   const { _id } = req.data;
//   if (!Aadhaarid || !OTP || !ReqId) {
//     res.status(400);
//     throw new Error("All fields are mandatory.");
//   } else {
      
//     const data = {
//         Aadhaarid:Aadhaarid,
//         OTP:OTP,
//         ReqId:ReqId,
//         ApiMode:1
//     };
      
//     // const formData = new URLSearchParams();
//     // formData.append("Aadhaarid", Aadhaarid);
//     // formData.append("OTP", OTP);
//     // formData.append("ReqId", ReqId);
//     // formData.append("ApiMode", process.env.API_MODE);

//     const response = await axios.post(
//       `https://planapi.in/Api/Ekyc/AdharVerificationSubmitOtp`,
//       data,
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//           TokenID: process.env.PLAN_TOKEN_ID,
//           ApiUserID: process.env.PLAN_API_USER_ID,
//           ApiPassword: process.env.PLAN_API_PASSWORD_hash ,
//         },
//       }
//     );

//     // if error
//     if (response.data.status?.toLowerCase() != "success") {
//       res.status(400);
//       throw new Error(response?.data?.response.message || response?.data.msg);
//     }

//     // Update Kyc Status in UserProfile API
//     await User.findByIdAndUpdate(_id, {
//       $set: { isVerified: true },
//     });
//     const newKycRes = new newKYC({
//       userId: _id,
//       zipurl: response.data.response.zip_file,
//       sharecode: response.data.response.share_code,
//       aadhaarNo: Aadhaarid,
//     });
//     await newKycRes.save();
//     // success respond
//     successHandler(req, res, {
//       Remarks: "KYC Verification Complete",
//       Data: response?.data,
//     });
//   }
// });

// const newkycList = asyncHandler(async (req, res) => {
//   const found = await newKYC.find().populate("userId");
//   // success handler
//   successHandler(req, res, {
//     Remarks: "Fetch kyc list",
//     Data: (found),
//   });
// });

// module.exports = {
//   kycStatus,
//   submitKyc,
// //   checkKyc,
//   approveKyc,
//   kycList,
//   doKyc,
//   sendKycOTP,
//   verifyKycOTP,
//   newkycList,
// };
