const router = require("express").Router();

const { tokenVerify } = require("../../common/tokenVerify");
const {
  getCart,
  addCart,
  removeProductFromCart,
} = require("../../controllers/shopping/cart");

// routes
router.route("/").get(tokenVerify, getCart).post(tokenVerify, addCart);
router.route("/:cartItemId").delete(tokenVerify, removeProductFromCart);

module.exports = router;
