const router = require("express").Router();
const { tokenVerify, adminTokenVerify } = require("../common/tokenVerify");
const { userDocuments } = require("../common/fileUpload");
const {
  kycStatus,
  submitKyc,
  approveKyc,
//   checkKyc,
  kycList,
  doKyc,
  sendKycOTP,
  verifyKycOTP,
  newkycList
} = require("../controllers/kyc");

router.post(
  "/submit-doc",
  tokenVerify,
  userDocuments.fields([
    { name: "photo" },
    { name: "pan" },
    { name: "aadhaarFront" },
    { name: "aadhaarBack" },
    { name: "otherDoc" },
  ]),
  submitKyc
);
// router.post("/check", tokenVerify, checkKyc);
router.post("/do-kyc", tokenVerify, doKyc);
router.post("/send-kyc-otp", tokenVerify, sendKycOTP);
router.post("/verify-kyc-otp", tokenVerify, verifyKycOTP);
router.get("/status", tokenVerify, kycStatus);
router.get("/list", adminTokenVerify, kycList);
router.get("/new-kyc-list", adminTokenVerify, newkycList);
router.post("/manage", adminTokenVerify, approveKyc);

module.exports = router;
