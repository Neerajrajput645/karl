const router = require("express").Router();
const {
  getReviewByProductId,
  addReviewByProductId,
  updateReviewByProductId,
  deleteReviewByProductId,
  checkMakeReview,
} = require("../../controllers/shopping/rating");
const { ratingImages } = require("../../common/fileUpload");
const { tokenVerify, adminTokenVerify } = require("../../common/tokenVerify");

// routes
router
  .route("/:productId")
  .get(getReviewByProductId)
  .post(tokenVerify, checkMakeReview);

router
  .route("/")
  .post(tokenVerify, ratingImages.array("images"), addReviewByProductId)
  .patch(tokenVerify, ratingImages.array("images"), updateReviewByProductId)
  .delete(adminTokenVerify, deleteReviewByProductId);

module.exports = router;
