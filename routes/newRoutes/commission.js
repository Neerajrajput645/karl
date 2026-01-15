// routes/commissionRoutes.js
const router = require("express").Router();
const { commissionImages } = require("../../common/fileUpload");
const { adminTokenVerify, tokenVerify } = require("../../common/tokenVerify");
const {
  addCommission,
  updateCommission,
  deleteCommission,
  commissionList,
  adminCommission
} = require("../../controllers/newControllers/commission");


// ========================= Commission Routes =========================
router.get("/list", tokenVerify, commissionList);
router.get("/admin/list", adminTokenVerify, adminCommission);
router.post(
  "/create", adminTokenVerify,
  commissionImages.single("icon"),
  addCommission
);
router.put(
  "/update/:commissionId", adminTokenVerify,
  commissionImages.single("icon"),
  updateCommission
);
router.delete("/delete/:commissionId", adminTokenVerify, deleteCommission);

module.exports = router;