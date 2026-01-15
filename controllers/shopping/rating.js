// const asyncHandler = require("express-async-handler");

// const Rating = require("../../models/shopping/ratingSchema");
// const successHandler = require("../../common/successHandler");
// const { otherPicResize } = require("../../common/imageResize");
// const PlaceOrder = require("../../models/shopping/placeOrderSchema");
// const { encryptFunc } = require("../../common/encryptDecrypt");

// // @desc get reviews by product
// // @path /api/rating/:productId
// const getReviewByProductId = asyncHandler(async (req, res) => {
//   const { productId } = req.params;
//   const item = await Rating.find({ productId }).populate("userId");

//   // Calculate the total sum of ratings and the total count
//   let totalSum = 0;
//   let totalCount = item.length;

//   item.forEach((product) => {
//     totalSum += product.rating;
//   });

//   // Calculate the average rating
//   let averageRating;
//   if (totalCount === 0) {
//     averageRating = 0; // Or any other value you want to set for the default average when no ratings are available
//   } else {
//     averageRating = totalSum / totalCount;
//   }

//   if (averageRating > 5) {
//     averageRating = 5;
//   }

//   const newItem = item.map((val) => {
//     const { last_name, _id, first_name } = val.userId;
//     return {
//       ...val._doc,
//       userId: { last_name, _id, first_name },
//     };
//   });

//   // success handler
//   successHandler(req, res, {
//     Remarks: "Fetch reviews of product",
//     Data: ({
//       reviews: newItem.reverse(),
//       totalCount,
//       averageRating: Math.floor(averageRating),
//     }),
//   });
// });

// // @desc check make review
// // @path /api/rating/:productId
// const checkMakeReview = asyncHandler(async (req, res) => {
//   const userFound = req.data;
//   const { productId } = req.params;
//   const orderFound = await PlaceOrder.findOne({
//     userId: userFound._id,
//     productId,
//     status: "delivered",
//   });

//   const ratingFound = await Rating.findOne({
//     userId: userFound._id,
//     productId,
//   });

//   if (!orderFound) {
//     res.status(400);
//     throw new Error("You cann't write review");
//   }

//   // For now

//   // if (ratingFound) {
//   //   res.status(400);
//   //   throw new Error("You already give");
//   // }

//   // success handler
//   successHandler(req, res, { Remarks: "You can write review" });
// });

// // @desc add reviews of product
// // @path /api/rating
// const addReviewByProductId = asyncHandler(async (req, res) => {
//   const userFound = req.data;
//   const { rating, comment, productId } = req.body;

//   const ratingFound = await Rating.findOne({
//     userId: userFound._id,
//     productId,
//   });

//   // For now Comment
//   // if (ratingFound) {
//   //   res.status(400);
//   //   throw new Error("You already give");
//   // }

//   const productImages = req.files.map((item) => {
//     otherPicResize(item.path);
//     return item.path;
//   });

//   const newReview = new Rating({
//     userId: userFound._id,
//     rating: parseInt(rating),
//     comment,
//     productId,
//     productImages,
//   });

//   await Rating.create(newReview);
//   // success handler
//   successHandler(req, res, { Remarks: "Thanks for the review" });
// });

// // @desc update reviews of product
// // @path /api/rating/
// const updateReviewByProductId = asyncHandler(async (req, res) => {
//   const { rating, comment, reviewId } = req.body;
//   const foundReview = await Rating.findById(reviewId);
//   const productImages = req.files?.map((item) => {
//     otherPicResize(item.path);
//     return item.path;
//   });
//   if (req.files) {
//     productImages?.images?.map((item) => {
//       deletePreviousImage(item);
//     });
//   }

//   await Rating.findByIdAndUpdate(reviewId, {
//     $set: {
//       rating: rating && parseInt(rating),
//       comment,
//       productImages: req.files ? productImages : foundReview.productImages,
//     },
//   });
//   // success handler
//   successHandler(req, res, { Remarks: "Updated your review" });
// });

// // @desc delete review of product
// // @path /api/rating/
// const deleteReviewByProductId = asyncHandler(async (req, res) => {
//   const { reviewId } = req.body;

//   await Rating.findByIdAndDelete(reviewId);
//   // success handler
//   successHandler(req, res, { Remarks: "Deleted review" });
// });

// module.exports = {
//   getReviewByProductId,
//   addReviewByProductId,
//   updateReviewByProductId,
//   deleteReviewByProductId,
//   checkMakeReview,
// };
