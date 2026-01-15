const router = require("express").Router();
const { homeBannerImages } = require("../../common/fileUpload");
const {
    getHomePopImage,
    getHomePopImagesAdmin,
    updateHomePopImage,
} = require("../../controllers/newControllers/homePopImage");
const { adminTokenVerify, tokenVerify } = require("../../common/tokenVerify");

// ========================= Home Pop Image Routes ==========================
router.get("/", tokenVerify, getHomePopImage);
router.get("/admin/list", adminTokenVerify, getHomePopImagesAdmin);
router.put("/update", adminTokenVerify, homeBannerImages.single("image"), updateHomePopImage);

module.exports = router;
