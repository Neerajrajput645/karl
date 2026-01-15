const Review = require("../../models/newModels/providerReview");
const ServiceRequest = require("../../models/newModels/serviceRequest");
const User = require("../../models/userSchema");
const asyncHandler = require("express-async-handler");
const successHandler = require("../../common/successHandler");
const validMongooseId = require("../../common/new/mongoIDvalidation");

// ===============================Create provider review=====================================
const createReview = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  const { rating, review } = req.body;
  const requestId = validMongooseId(res, req.body?.requestId);

  if (!rating || !review || !requestId) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error("Rating must be a number between 1 and 5");
  }

  const user = await User.findOne({ _id, status: true }).lean();
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const serviceRequest = await ServiceRequest.findOne({
    _id: requestId,
    userId: _id,
    status: "COMPLETED",
  }).lean();

  if (!serviceRequest) {
    res.status(404);
    throw new Error("Service request not found or not completed");
  }

  const alreadyReviewed = await Review.exists({
    requestId: requestId.toString(),
  });
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("Review already exists for this request");
  }

  await Review.create({
    providerId: serviceRequest.providerId,
    ratingBy: _id,
    requestId,
    rating,
    review,
  });

  return successHandler(req, res, {
    remark: "Review created successfully",
  });
});

// ===============================Review List (Admin)=====================================
const reviewList = asyncHandler(async (req, res) => {
  let { userId, page = 1, limit = 10 } = req.query;
  const providerId = validMongooseId(res, req.query?.providerId);

  page = Math.max(parseInt(page), 1);
  limit = Math.max(parseInt(limit), 1);
  const offset = (page - 1) * limit;

  const condition = {};
  if (providerId) condition.providerId = providerId;
  else if (userId) condition.userId = userId;

  const count = await Review.countDocuments(condition);
  const reviews = await Review.find(condition)
    .skip(offset)
    .populate("ratingBy", "firstName")
    .limit(limit)
    .lean()
    .sort({ createdAt: -1 });

  const totalPages = Math.ceil(count / limit);

  return successHandler(req, res, {
    remark: reviews.length
      ? "Reviews fetched successfully"
      : "No reviews found",
    data: {
      reviews,
      pagination: {
        total: count,
        totalPages,
        currentPage: page,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    },
  });
});

// ===============================Review by ID=====================================
const reviewById = asyncHandler(async (req, res) => {
  const reviewId = validMongooseId(res, req.params?.reviewId);
  if (!reviewId) {
    res.status(400);
    throw new Error("Review ID is required");
  }
  const review = await Review.findById(reviewId)
    .populate("ratingBy", "firstName")
    .lean();
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }
  return successHandler(req, res, {
    remark: "Review fetched successfully",
    data: review,
  });
});

// =============================== Update review ==================================
const updateReview = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  const reviewId = validMongooseId(res, req.params?.reviewId);
  const { rating, review } = req.body;

  if (!reviewId) {
    res.status(400);
    throw new Error("Review ID is required");
  }

  if (!rating && !review) {
    res.status(400);
    throw new Error("Provide at least one value to update");
  }

  const user = await User.findOne({ _id, status: true }).lean();
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const foundReview = await Review.findOne({
    _id: reviewId,
    ratingBy: user._id,
  });

  if (!foundReview) {
    res.status(404);
    throw new Error("Review not found or not submitted by you");
  }

  if (rating !== undefined) foundReview.rating = rating;
  if (review !== undefined) foundReview.review = review;

  await foundReview.save();

  return successHandler(req, res, {
    remark: "Review updated successfully",
    data: {
      review: foundReview,
    },
  });
});

// ===============================Delete Review=====================================
const deleteReview = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  const reviewId = validMongooseId(res, req.params?.reviewId);

  if (!reviewId) {
    res.status(400);
    throw new Error("Review ID is required");
  }

  const user = await User.findOne({ _id, status: true }).lean();
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const review = await Review.findOne({
    _id: reviewId,
    ratingBy: user._id,
  });
  if (!review) {
    res.status(404);
    throw new Error("Review not found or not submitted by you");
  }

  await Review.deleteOne({ _id: reviewId });

  return successHandler(req, res, {
    remark: "Review deleted successfully",
  });
});

// =============================== Export Controller Functions===============================
module.exports = {
  createReview,
  reviewList,
  reviewById,
  deleteReview,
  updateReview,
};
