const router = require("express").Router();
const { categoryUpload } = require("../../common/fileUpload");
const { adminTokenVerify } = require("../../common/tokenVerify");
const {
  categoriesList,
  addCategory,
  removeCategory,
  updateCategory,
  categoryById,
} = require("../../controllers/shopping/category");

router.get("/list", categoriesList);
router.delete("/:categoryId", adminTokenVerify, removeCategory);
router.get("/view/:categoryId", categoryById);
router.post(
  "/create",
  adminTokenVerify,
  categoryUpload.single("image"),
  addCategory
);
router.patch(
  "/:categoryId",
  adminTokenVerify,
  categoryUpload.single("image"),
  updateCategory
);

module.exports = router;
