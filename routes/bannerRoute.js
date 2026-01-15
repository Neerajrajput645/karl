const router = require("express").Router();
const { bannerUploads } = require("../common/fileUpload");
const { adminTokenVerify } = require("../common/tokenVerify");
const {
  bannerList,
  addBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/banner");

router.get("/list", bannerList);
router.delete("/:bannerId", adminTokenVerify, deleteBanner);
router.post(
  "/create",
  adminTokenVerify,
  bannerUploads.single("image"),
  addBanner
);
router.patch(
  "/:bannerId",
  adminTokenVerify,
  bannerUploads.single("image"),
  updateBanner
);

module.exports = router;
