// const router = require("express").Router();
// const { adminTokenVerify } = require("../../common/tokenVerify");
// const {
//   createCategory,
//   categoryListAdmin,
//   categoryList,
//   categoryListById,
//   categoryUpdate,
//   categoryDelete,
// } = require("../../controllers/newControllers/serviceCategory");
// const { serviceCategoryImages } = require("../../common/fileUpload");

// //=========================== Routes =====================================
// router.post("/", serviceCategoryImages.single("image"), createCategory);
// router.get("/", categoryList);
// router.get("/admin", categoryListAdmin);
// router.get("/:categoryId", categoryListById);
// router.put(
//   "/:categoryId",
//   serviceCategoryImages.single("image"),
//   categoryUpdate
// );
// router.delete("/:categoryId", categoryDelete);

// // ============================= Export ===================================
// module.exports = router;
