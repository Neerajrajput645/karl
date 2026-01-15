// const router = require("express").Router();
// const { categoryUpload } = require("../../common/fileUpload");
// const { adminTokenVerify } = require("../../common/tokenVerify");
// const {
//   bussinessCategoriesList,
//   bussinessCategoryById,
//   removeBussinessCategory,
//   updateBussinessCategory,
//   addBussinessCategory,
// } = require("../../controllers/shopping/bussinessCategory");

// router.get("/list", bussinessCategoriesList);
// router.delete(
//   "/:bussinessCategoryId",
//   adminTokenVerify,
//   removeBussinessCategory
// );
// router.get("/view/:bussinessCategoryId", bussinessCategoryById);
// router.post(
//   "/create",
//   adminTokenVerify,
//   categoryUpload.single("image"),
//   addBussinessCategory
// );
// router.patch(
//   "/:bussinessCategoryId",
//   adminTokenVerify,
//   categoryUpload.single("image"),
//   updateBussinessCategory
// );

// module.exports = router;
