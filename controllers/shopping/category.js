// const asyncHandler = require("express-async-handler");
// const successHandler = require("../../common/successHandler");
// const Category = require("../../models/shopping/categorySchema");
// const { otherPicResize } = require("../../common/imageResize");
// const deletePreviousImage = require("../../common/deletePreviousImage");
// const { encryptFunc } = require("../../common/encryptDecrypt");

// // category list
// const categoriesList = asyncHandler(async (req, res) => {
//   const categories = await Category.find();

//   // success respond
//   successHandler(req, res, {
//     Remarks: "Fetch all categories.",
//     Data: (categories.reverse()),
//   });
// });

// // add category
// const addCategory = asyncHandler(async (req, res) => {
//   const { name, description, commission } = req.body;
//   otherPicResize(req?.file?.path);
//   const newCategory = new Category({
//     name,
//     description,
//     commission,
//     image: req?.file?.path,
//   });
//   const result = await newCategory.save();

//   // success respond
//   successHandler(req, res, {
//     Remarks: "Category saved success.",
//     Data: result,
//   });
// });

// // remove category
// const removeCategory = asyncHandler(async (req, res) => {
//   const { categoryId } = req.params;
//   const categories = await Category.findById(categoryId);

//   //   throw error if id invalid
//   if (!categories) {
//     res.status(400);
//     throw new Error("Invalid category id.");
//   }

//   deletePreviousImage(categories.image);
//   const result = await Category.findByIdAndDelete(categoryId);

//   // success respond
//   successHandler(req, res, {
//     Remarks: "Category removed success.",
//     Data: result,
//   });
// });

// // update category
// const updateCategory = asyncHandler(async (req, res) => {
//   const { categoryId } = req.params;
//   const categoryFound = await Category.findById(categoryId);

//   // throw error if invalid id
//   if (!categoryFound) {
//     if (req.file) {
//       deletePreviousImage(req?.file?.path);
//     }
//     res.status(400);
//     throw new Error("Invalid category id.");
//   }

//   // delete previous
//   if (req.file) {
//     otherPicResize(req?.file?.path);
//     deletePreviousImage(categoryFound.image);
//   }

//   // update category
//   await Category.findByIdAndUpdate(categoryId, {
//     ...req.body,
//     image: req.file ? req?.file?.path : categoryFound.image,
//   });

//   // success respond
//   successHandler(req, res, { Remarks: "Category updated success." });
// });

// // category by id
// const categoryById = asyncHandler(async (req, res) => {
//   const { categoryId } = req.params;
//   const categories = await Category.findById(categoryId);

//   if (categories) {
//     // success handler
//     successHandler(req, res, {
//       Remarks: "Fetch category by id.",
//       Data: categories,
//     });
//   } else {
//     res.status(400);
//     throw new Error("Invalid category id.");
//   }
// });

// module.exports = {
//   categoriesList,
//   addCategory,
//   removeCategory,
//   updateCategory,
//   categoryById,
// };
