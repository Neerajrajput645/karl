const router = require("express").Router();
const {
  createReview,
  reviewList,
  reviewById,
  deleteReview,
  updateReview,
} = require("../../controllers/newControllers/providerReviews");

const { adminTokenVerify, tokenVerify } = require("../../common/tokenVerify");

router.post("/", tokenVerify, createReview);
router.get("/",adminTokenVerify, reviewList);
router.get("/:reviewId", reviewById);
router.put("/:reviewId", tokenVerify, updateReview);
router.delete("/:reviewId", tokenVerify, deleteReview);

module.exports = router;
