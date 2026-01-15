// const asyncHandler = require("express-async-handler");
// const successHandler = require("../../common/successHandler");
// const { otherPicResize } = require("../../common/imageResize");
// const Category = require("../../models/shopping/categorySchema");
// const SubCategory = require("../../models/shopping/subCategorySchema");
// const deletePreviousImage = require("../../common/deletePreviousImage");
// const { encryptFunc } = require("../../common/encryptDecrypt");

// // sub category list
// const subCategoriesList = asyncHandler(async (req, res) => {
//   const subCategories = await SubCategory.find();

//   // success respond
//   successHandler(req, res, {
//     Remarks: "Fetch all sub-categories.",
//     Data: (subCategories.reverse()),
//   });
// });

// // add sub category
// const addSubCategory = asyncHandler(async (req, res) => {
//   const { name, description, categoryId } = req.body;
//   otherPicResize(req?.file?.path);
//   const newSubCategory = new SubCategory({
//     name,
//     description,
//     categoryId,
//     image: req?.file?.path,
//   });
//   const result = await newSubCategory.save();
//   // success respond
//   successHandler(req, res, {
//     Remarks: "SubCategory saved success.",
//     Data: result,
//   });
// });

// // remove sub category
// const removeSubCategory = asyncHandler(async (req, res) => {
//   const { subCategoryId } = req.params;
//   const subCategories = await SubCategory.findById(subCategoryId);

//   //   throw error if id invalid
//   if (!subCategories) {
//     res.status(400);
//     throw new Error("Invalid sub category id.");
//   }

//   deletePreviousImage(subCategories.image);
//   const result = await SubCategory.findByIdAndDelete(subCategoryId);

//   // success respond
//   successHandler(req, res, {
//     Remarks: "Category removed success.",
//     Data: result,
//   });
// });

// // update sub category
// const updateSubCategory = asyncHandler(async (req, res) => {
//   const { subCategoryId } = req.params;
//   const subCategoryFound = await SubCategory.findById(subCategoryId);

//   // throw error if invalid id
//   if (!subCategoryFound) {
//     if (req.file) {
//       deletePreviousImage(req?.file?.path);
//     }
//     res.status(400);
//     throw new Error("Invalid sub category id.");
//   }

//   // delete previous
//   if (req.file) {
//     otherPicResize(req?.file?.path);
//     deletePreviousImage(subCategoryFound.image);
//   }

//   // update category
//   await SubCategory.findByIdAndUpdate(subCategoryId, {
//     ...req.body,
//     image: req.file ? req?.file?.path : subCategoryFound.image,
//   });

//   // success respond
//   successHandler(req, res, { Remarks: "Sub Category updated success." });
// });

// // sub category by category id
// const getSubCategoriesByCategoryId = asyncHandler(async (req, res) => {
//   const { categoryId } = req.params;
//   const categoryFound = await Category.findById(categoryId);

//   if (categoryFound) {
//     const subcategories = await SubCategory.find({ categoryId });
//     // success handler
//     successHandler(req, res, {
//       Remarks: "Fetch sub-categories by categoryId.",
//       Data: (subcategories.reverse()),
//     });
//   } else {
//     res.status(400);
//     throw new Error("Inavlid category id.");
//   }
// });

// // sub category by id
// const subCategoryById = asyncHandler(async (req, res) => {
//   const { subCategoryId } = req.params;
//   const subcategories = await SubCategory.findById(subCategoryId);

//   if (subcategories) {
//     // success handler
//     successHandler(req, res, {
//       Remarks: "Fetch sub category by id.",
//       Data: subcategories,
//     });
//   } else {
//     res.status(400);
//     throw new Error("Invalid sub-category id.");
//   }
// });

// module.exports = {
//   updateSubCategory,
//   removeSubCategory,
//   addSubCategory,
//   subCategoriesList,
//   getSubCategoriesByCategoryId,
//   subCategoryById,
// };
