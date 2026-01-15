const router = require("express").Router();
const { homeBannerImages } = require("../../common/fileUpload");
const {
  getHomeBanners,
  getHomeBannersAdmin,
  createHomeBanner,
  updateHomeBanner,
  deleteHomeBanner,
} = require("../../controllers/newControllers/homeBanner");
const { adminTokenVerify, tokenVerify } = require("../../common/tokenVerify");

// ========================= Home Banner Routes ==========================
router.get("/list", tokenVerify, getHomeBanners);
router.get("/admin/list", adminTokenVerify, getHomeBannersAdmin);
router.post("/create", adminTokenVerify, homeBannerImages.single("image"), createHomeBanner);
router.put("/:bannerId", adminTokenVerify, homeBannerImages.single("image"), updateHomeBanner);
router.delete("/:bannerId", adminTokenVerify, deleteHomeBanner);

module.exports = router;
