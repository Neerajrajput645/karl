// const asyncHandler = require("express-async-handler");
// const successHandler = require("../../common/successHandler");
// const Wishlist = require("../../models/shopping/wishlistSchema");
// const Product = require("../../models/shopping/productSchema");
// const { encryptFunc } = require("../../common/encryptDecrypt");

// // @desc get all wishlist
// // @path /api/wishlist
// const getWishlist = asyncHandler(async (req, res) => {
//   const userFound = req.data;
//   const item = await Wishlaist.find({ userId: userFound._id }).populate(
//     "productId"
//   );
//   // success handler
//   successHandler(req, res, {
//     Remarks: "Fetch all wishlist",
//     Data: (item.reverse()),
//   });
// });

// // @desc add wishlist
// // @path /api/wishlist/:productId
// const addWishlist = asyncHandler(async (req, res) => {
//   const userFound = req.data;
//   const { productId } = req.params;

//   const productFound = await Product.findById(productId);

//   if (!productFound) {
//     res.status(400);
//     throw new Error("Invalid product id");
//   }

//   const wishlistFound = await Wishlist.findOne({
//     userId: userFound._id,
//     productId,
//   });

//   // If product found in wishlist throw error
//   if (wishlistFound) {
//     res.status(400);
//     throw new Error("Product already added in wishlist.");
//   }
//   const newWishlist = new Wishlist({
//     userId: userFound._id,
//     productId,
//   });
//   await Wishlist.create(newWishlist);
//   // success handler
//   successHandler(req, res, { Remarks: "Added wishlist" });
// });

// // @desc delete wishlist
// // @path /api/wishlist/:productId
// const deleteWishlist = asyncHandler(async (req, res) => {
//   const userFound = req.data;
//   const { productId } = req.params;

//   const productFound = await Product.findById(productId);

//   if (!productFound) {
//     res.status(400);
//     throw new Error("Invalid product id");
//   }

//   await Wishlist.deleteOne({ userId: userFound._id, productId });
//   // success handler
//   successHandler(req, res, { Remarks: "Removed wishlist" });
// });

// module.exports = { getWishlist, addWishlist, deleteWishlist };
