const router = require("express").Router();
const { affiliateImage } = require("../common/fileUpload");
const { adminTokenVerify } = require("../common/tokenVerify");
const {
  affiliateList, 
  affiliateListAdmin,
  removeAffiliate,
  createAffiliate,
  updateAffiliate,
} = require("../controllers/affiliate");


// ========================= Affiliate Routes =============================
router.get("/list", affiliateList);
router.get("/admin-list", adminTokenVerify, affiliateListAdmin)
router.delete("/remove/:affiliateId", adminTokenVerify, removeAffiliate);
router.post(
  "/create",
  adminTokenVerify,
  affiliateImage.single("image"),
  createAffiliate
);
router.patch(
  "/update/:affiliateId",
  adminTokenVerify,
  affiliateImage.single("image"),
  updateAffiliate
);

module.exports = router;
