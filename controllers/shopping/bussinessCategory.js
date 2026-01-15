// const asyncHandler = require("express-async-handler");
// const successHandler = require("../../common/successHandler");
// const deletePreviousImage = require("../../common/deletePreviousImage");
// const BussinessCategory = require("../../models/shopping/bussinessCategory");
// const { encryptFunc } = require("../../common/encryptDecrypt");

// const bussinessCategoriesList = asyncHandler(async (req, res) => {
//   const result = await BussinessCategory.find();
//   // success respond
//   successHandler(req, res, {
//     Remarks: "Fetch all bussiness categories.",
//     Data: (result),
//   });
// });

// const addBussinessCategory = asyncHandler(async (req, res) => {
//   const { name, description, commission } = req.body;
//   const newBussinessCategory = new BussinessCategory({
//     name,
//     description,
//     commission,
//     image: req?.file?.path,
//   });
//   const result = await newBussinessCategory.save();

//   // success respond
//   successHandler(req, res, {
//     Remarks: "Bussiness Category saved success.",
//     Data: result,
//   });
// });

// const removeBussinessCategory = asyncHandler(async (req, res) => {
//   const { bussinessCategoryId } = req.params;
//   const categories = await BussinessCategory.findById(bussinessCategoryId);

//   if (!categories) {
//     res.status(400);
//     throw new Error("Invalid bussiness category id.");
//   }

//   deletePreviousImage(categories.image);
//   const result = await BussinessCategory.findByIdAndDelete(bussinessCategoryId);

//   // success respond
//   successHandler(req, res, {
//     Remarks: "Bussiness Category removed success.",
//     Data: result,
//   });
// });

// const updateBussinessCategory = asyncHandler(async (req, res) => {
//   const { bussinessCategoryId } = req.params;
//   const result = await BussinessCategory.findById(bussinessCategoryId);

//   if (!result) {
//     if (req.file) {
//       deletePreviousImage(req?.file?.path);
//     }
//     res.status(400);
//     throw new Error("Invalid bussiness category id.");
//   }

//   // delete previous
//   if (req.file) {
//     deletePreviousImage(result.image);
//   }

//   // update category
//   await BussinessCategory.findByIdAndUpdate(bussinessCategoryId, {
//     ...req.body,
//     image: req.file ? req?.file?.path : result.image,
//   });

//   // success respond
//   successHandler(req, res, { Remarks: "Bussiness Category updated success." });
// });

// const bussinessCategoryById = asyncHandler(async (req, res) => {
//   const { bussinessCategoryId } = req.params;
//   const result = await BussinessCategory.findById(bussinessCategoryId);

//   if (result) {
//     // success handler
//     successHandler(req, res, {
//       Remarks: "Fetch bussiness category by id.",
//       Data: result,
//     });
//   } else {
//     res.status(400);
//     throw new Error("Invalid bussiness category id.");
//   }
// });

// module.exports = {
//   bussinessCategoriesList,
//   bussinessCategoryById,
//   removeBussinessCategory,
//   updateBussinessCategory,
//   addBussinessCategory,
// };
