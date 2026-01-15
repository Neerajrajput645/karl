const router = require("express").Router();
const { tokenVerify } = require("../common/tokenVerify");
const {
  bankList,
  addBankDetail,
  deleteBank,
  updateBankDetail,
} = require("../controllers/bank");

router.get("/list", tokenVerify, bankList);
router.delete("/:bankId", tokenVerify, deleteBank);
router.post("/create", tokenVerify, addBankDetail);
router.patch("/:bankId", tokenVerify, updateBankDetail);

module.exports = router;
