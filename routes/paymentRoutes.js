const router = require("express").Router();
const bodyParser = require("body-parser");
const { tokenVerify } = require("../common/tokenVerify");
const {
  createUpiOrder,
  upiTenzWebhook,
  upiTenzStatus,
  checkStatus,
} = require("../controllers/payment");

// =================== Payment Routes =============================
router.post("/upi/create-order", tokenVerify, createUpiOrder);
router.post("/upi/tenz-webhook", bodyParser.json(), upiTenzWebhook);
router.post("/upi/tenz-status", tokenVerify, upiTenzStatus);
router.post("/upi/check-status", tokenVerify, checkStatus);

module.exports = router;
