const router = require("express").Router();
const { tokenVerify } = require("../common/tokenVerify");
const {
  shippingList,
  addShipping,
  deleteShipping,
  updateShipping,
} = require("../controllers/shipping");

router.get("/list", tokenVerify, shippingList);
router.post("/create", tokenVerify, addShipping);
router.patch("/:shippingId", tokenVerify, updateShipping);
router.delete("/:shippingId", tokenVerify, deleteShipping);

module.exports = router;
