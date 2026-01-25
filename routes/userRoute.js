const router = require("express").Router();
const { tokenVerify, adminTokenVerify } = require("../common/tokenVerify");
const {combinedHistory} = require("../controllers/services/report.js");
const {
  referList,
  userProfile,
  createMpin,
  verifyMpin,
  forgotMpin,
  verifyOTP,
  updateMpin,
  userList,
  statusUpdate,
  userTypeUpdate,
} = require("../controllers/user");

//  ============= user management routes =================
router.post("/list", adminTokenVerify, userList);
router.get("/profile", tokenVerify, userProfile);
router.get("/refer-list", tokenVerify, referList);
router.patch("/status-update", adminTokenVerify, statusUpdate);
router.patch("/usertype-update", adminTokenVerify, userTypeUpdate);

// ================= mpin routes =================
router.post("/mpin-verify", tokenVerify, verifyMpin);
router.post("/mpin-forgot", tokenVerify, forgotMpin);
router.post("/mpin-update", tokenVerify, updateMpin);
router.post("/mpin-generate", tokenVerify, createMpin);
router.post("/mpin-verify-otp", tokenVerify, verifyOTP);

// ============= combined history route =================
router.get("/combined-history", tokenVerify, combinedHistory);

module.exports = router;
