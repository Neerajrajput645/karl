const router = require("express").Router();
const { affiliateBannerUploads } = require("../common/fileUpload");
const {
  bannerList,
  addBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/affiliateBanner");

router.get("/list", bannerList);
router.delete("/:bannerId", deleteBanner);
router.post("/create", affiliateBannerUploads.single("image"), addBanner);
router.patch(
  "/:bannerId",
  affiliateBannerUploads.single("image"),
  updateBanner
);

module.exports = router;
