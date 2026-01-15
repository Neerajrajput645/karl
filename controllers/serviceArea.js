// const asyncHandler = require("express-async-handler");
// const ServiceArea = require("../models/serviceAreaSchema");
// const successHandler = require("../common/successHandler");
// const { encryptFunc } = require("../common/encryptDecrypt");

// // Create Service Area
// // @path /api/service-area
// const createServiceArea = asyncHandler(async (req, res) => {
//   const { pinCode, deliveryCharge } = req.body;
//   const found = await ServiceArea.findOne({ pinCode });

//   if (found) {
//     res.status(400);
//     throw new Error("Already exist.");
//   } else {
//     const newPinCode = await ServiceArea({ pinCode, deliveryCharge });
//     await newPinCode.save();
//     successHandler(req, res, { Remarks: "Added pincode to open service" });
//   }
// });

// // Create Service Area
// // @path /api/service-area
// const deleteServiceArea = asyncHandler(async (req, res) => {
//   const { pinCodeId } = req.params;
//   const found = await ServiceArea.findById(pinCodeId);

//   if (!found) {
//     res.status(400);
//     throw new Error("Please enter valid id");
//   } else {
//     await ServiceArea.findByIdAndRemove(pinCodeId);
//     successHandler(req, res, { Remarks: "Remove pincode from open service" });
//   }
// });

// // Create Service Area
// // @path /api/service-area
// const updateServiceArea = asyncHandler(async (req, res) => {
//   const { pinCodeId } = req.body;
//   const found = await ServiceArea.findById(pinCodeId);
//   if (!found) {
//     res.status(400);
//     throw new Error("Please enter valid id");
//   } else {
//     await ServiceArea.findByIdAndUpdate(pinCodeId, req.body);
//     successHandler(req, res, { Remarks: "update pincode from open service" });
//   }
// });

// // Get Service Area
// // @path /api/service-area
// const getServiceArea = asyncHandler(async (req, res) => {
//   const found = await ServiceArea.find();

//   successHandler(req, res, {
//     Remarks: "Get All Service Areas",
//     Data: encryptFunc(found),
//   });
// });

// // Check Service Area
// // @path /api/service-area
// const checkServiceArea = asyncHandler(async (req, res) => {
//   const { pinCode } = req.body;
//   const found = await ServiceArea.findOne({ pinCode, status: true });

//   // Get the current date
//   const currentDate = new Date();

//   // Add 24 hours (24 * 60 * 60 * 1000 milliseconds) to the current date
//   const after24Hours = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

//   // Convert the date to a string
//   const deliveryDate = after24Hours.toISOString();

//   if (!pinCode) {
//     res.status(400);
//     throw new Error("Please provide pin code");
//   }

//   if (!found) {
//     res.status(400);
//     throw new Error("Sorry, At this pincode service will start soon.");
//   }

//   successHandler(req, res, {
//     Remarks: "Here service is available",
//     Data: found,
//     deliveryDate,
//   });
// });

// module.exports = {
//   checkServiceArea,
//   getServiceArea,
//   deleteServiceArea,
//   createServiceArea,
//   updateServiceArea,
// };
