const router = require("express").Router();
const { subCategoryUpload } = require("../../common/fileUpload");
const { adminTokenVerify } = require("../../common/tokenVerify");

const {
  subCategoriesList,
  removeSubCategory,
  addSubCategory,
  updateSubCategory,
  getSubCategoriesByCategoryId,
  subCategoryById,
} = require("../../controllers/shopping/subCategory");

router.get("/list", subCategoriesList);
router.get("/view/:subCategoryId", subCategoryById);
router.delete("/:subCategoryId", adminTokenVerify, removeSubCategory);
router.get("/list/:categoryId", getSubCategoriesByCategoryId);
router.post(
  "/create",
  adminTokenVerify,
  subCategoryUpload.single("image"),
  addSubCategory
);
router.patch(
  "/:subCategoryId",
  adminTokenVerify,
  subCategoryUpload.single("image"),
  updateSubCategory
);

module.exports = router;
