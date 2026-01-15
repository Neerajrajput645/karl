const router = require("express").Router();
const { tokenVerify } = require("../../common/tokenVerify");
const {
  getWishlist,
  addWishlist,
  deleteWishlist,
} = require("../../controllers/shopping/wishlist");

// routes
router.route("/").get(tokenVerify, getWishlist);
router
  .route("/:productId")
  .post(tokenVerify, addWishlist)
  .delete(tokenVerify, deleteWishlist);

module.exports = router;
