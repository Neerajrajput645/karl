// const mongoose = require("mongoose");
// const asyncHandler = require("express-async-handler");
// const successHandler = require("../../common/successHandler");
// const deletePreviousImage = require("../../common/deletePreviousImage");
// const Service = require("../../models/newModels/services");
// const ServiceCategory = require("../../models/newModels/serviceCategory");

// // ==================================== Create Service Category ====================================
// const createCategory = asyncHandler(async (req, res) => {
//   const { name, description, services } = req.body;

//   if (
//     !name?.trim() ||
//     !description?.trim() ||
//     !Array.isArray(services) ||
//     services.length === 0
//   ) {
//     res.status(400);
//     throw new Error("Please enter all required values");
//   }

//   const validServices = await Service.find({
//     _id: { $in: services },
//     status: true,
//   });

//   if (validServices.length !== services.length) {
//     res.status(400);
//     throw new Error("Some provided services are invalid or inactive");
//   }

//   await ServiceCategory.create({
//     name: name.trim(),
//     description: description.trim(),
//     services,
//     image: req.file?.path || null,
//   });

//   return successHandler(req, res, {
//     remark: "Service category added successfully",
//   });
// });

// // ==================================== Service Category List (Admin) ====================================
// const categoryListAdmin = asyncHandler(async (req, res) => {
//   const response = await ServiceCategory.find({}).lean();
//   return successHandler(req, res, {
//     remark: "Service list fetched successfully (Admin)",
//     data: response,
//   });
// });

// // ==================================== Service Category List (User) ====================================
// const categoryList = asyncHandler(async (req, res) => {
//   const response = await ServiceCategory.find({ status: true })
//     .select("-__v -createdAt -updatedAt -status")
//     .lean();

//   return successHandler(req, res, {
//     remark: response.length
//       ? "Service list fetched successfully"
//       : "No service categories available",
//     data: response,
//   });
// });

// // ==================================== Service Category by ID ====================================
// const categoryListById = asyncHandler(async (req, res) => {
//   const { categoryId } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(categoryId)) {
//     res.status(400);
//     throw new Error("Invalid category ID");
//   }

//   const response = await ServiceCategory.findById(categoryId)
//     .populate("services", "name description image status")
//     .lean();

//   if (!response) {
//     res.status(404);
//     throw new Error("Service category not found");
//   }

//   return successHandler(req, res, {
//     remark: "Service category found successfully",
//     data: response,
//   });
// });

// // ==================================== Update Service Category ====================================
// const categoryUpdate = asyncHandler(async (req, res) => {
//   const { categoryId } = req.params;
//   const { name, description, services, status } = req.body;
//   const imageFile = req.file?.path;

//   if (!mongoose.Types.ObjectId.isValid(categoryId)) {
//     res.status(400);
//     throw new Error("Invalid category ID");
//   }

//   if (
//     !name?.trim() &&
//     !description?.trim() &&
//     !services &&
//     typeof status === "undefined" &&
//     !imageFile
//   ) {
//     res.status(400);
//     throw new Error("Please enter at least one field to update");
//   }

//   const category = await ServiceCategory.findById(categoryId);
//   if (!category) {
//     res.status(404);
//     throw new Error("Service category not found");
//   }

//   if (services) {
//     const validServices = await Service.find({
//       _id: { $in: services },
//       status: true,
//     });

//     if (validServices.length !== services.length) {
//       res.status(400);
//       throw new Error("Some provided services are invalid or inactive");
//     }

//     category.services = services;
//   }

//   if (name?.trim()) category.name = name.trim();
//   if (description?.trim()) category.description = description.trim();
//   if (typeof status !== "undefined") category.status = status;

//   if (imageFile) {
//     const oldImage = category.image;
//     category.image = imageFile;

//     try {
//       if (oldImage) await deletePreviousImage(oldImage);
//     } catch (err) {
//       console.error("Error deleting old image:", err.message);
//     }
//   }

//   await category.save();

//   return successHandler(req, res, {
//     remark: "Category updated successfully",
//   });
// });

// // ==================================== Delete Service Category ====================================
// const categoryDelete = asyncHandler(async (req, res) => {
//   const { categoryId } = req.params;

//   if (!mongoose.Types.ObjectId.isValid(categoryId)) {
//     res.status(400);
//     throw new Error("Invalid category ID");
//   }

//   const category = await ServiceCategory.findById(categoryId);

//   if (!category) {
//     res.status(404);
//     throw new Error("Service category not found");
//   }

//   const oldImage = category.image;

//   await category.deleteOne();

//   if (oldImage) {
//     try {
//       await deletePreviousImage(oldImage);
//     } catch (err) {
//       console.error("Error deleting old image:", err.message);
//     }
//   }

//   return successHandler(req, res, {
//     remark: "Category deleted successfully",
//   });
// });

// module.exports = {
//   createCategory,
//   categoryListAdmin,
//   categoryList,
//   categoryListById,
//   categoryUpdate,
//   categoryDelete,
// };
