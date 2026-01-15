const router = require("express").Router();
const { adminTokenVerify } = require("../common/tokenVerify");
const {
  adminLogin,
  adminProfile,
  AddReferToUser,
} = require("../controllers/admin");
const { txnList } = require("../controllers/adminTxn");
const { manageUserWalletMoney } = require("../controllers/wallet");

// =========================  Admin Routes ==========================
router.post("/login", adminLogin);
router.get("/txn-list", adminTokenVerify, txnList);
router.get("/profile", adminTokenVerify, adminProfile);
router.put("/manage-user-wallet", adminTokenVerify, manageUserWalletMoney);
router.post("/add-refer", adminTokenVerify, AddReferToUser);

module.exports = router;
