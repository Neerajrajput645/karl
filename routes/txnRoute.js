const router = require("express").Router();
const { tokenVerify, adminTokenVerify } = require("../common/tokenVerify");
const {
  getTransaction,
  txnByUserId,
  getAllTransaction,
} = require("../controllers/txn");


// ========================= Transaction Routes =========================
router.get("/list/all", adminTokenVerify, getAllTransaction);
router.get("/list", tokenVerify, getTransaction);
router.get("/list/:receiverId", tokenVerify, txnByUserId);

module.exports = router;
