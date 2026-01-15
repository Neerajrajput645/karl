const router = require("express").Router();
const { tokenVerify, adminTokenVerify } = require("../common/tokenVerify");
const {
   sendMoney,
   cashback,
  getWalletByUser,
  getWalletTxn,
  manageUserWalletMoney
} = require("../controllers/wallet");

// ================= wallet routes =================
router.get("/info", tokenVerify, getWalletByUser);
router.post("/cashback", tokenVerify, cashback);
router.get("/wallet-txn",adminTokenVerify, getWalletTxn);
router.put("/manage-user-wallet", adminTokenVerify, manageUserWalletMoney);

module.exports = router;
