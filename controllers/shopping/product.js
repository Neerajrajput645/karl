// const asyncHandler = require("express-async-handler");
// const Merchant = require("../../models/merchantSchema");
// const Rating = require("../../models/shopping/ratingSchema");
// const successHandler = require("../../common/successHandler");
// const Product = require("../../models/shopping/productSchema");
// const { otherPicResize } = require("../../common/imageResize");
// const Category = require("../../models/shopping/categorySchema");
// const deletePreviousImage = require("../../common/deletePreviousImage");
// const { encryptFunc } = require("../../common/encryptDecrypt");

// // product list
// const productList = asyncHandler(async (req, res) => {
//   const { page, ...otherQuery } = req.query;
//   const pageSize = 10;
//   const pageNumber = parseInt(page) || 1;
//   const skip = (pageNumber - 1) * pageSize;

//   const items = otherQuery
//     ? await Product.find({ isPublish: true, ...otherQuery })
//         .populate("merchantId")
//         .populate("subcategoryId")
//         .populate("categoryId")
//         .skip(skip)
//         .limit(pageSize)
//     : await Product.find({ isPublish: true })
//         .populate("merchantId")
//         .populate("subcategoryId")
//         .populate("categoryId")
//         .skip(skip)
//         .limit(pageSize);

//   const allData = await Promise.all(
//     items.map(async (item) => {
//       const reviewFound = await Rating.find({ productId: item._id }).populate(
//         "userId"
//       );
//       const merchantFound = await Merchant.findOne({
//         userId: item?.merchantId?._id,
//       }).populate("userId");

//       // Calculate the total sum of ratings and the total count
//       let totalSum = 0;
//       let totalCount = reviewFound.length;

//       reviewFound.forEach((product) => {
//         totalSum += product.rating;
//       });

//       // Calculate the average rating
//       let averageRating;
//       if (totalCount === 0) {
//         averageRating = 0; // Or any other value you want to set for the default average when no ratings are available
//       } else {
//         averageRating = totalSum / totalCount;
//       }

//       if (averageRating > 5) {
//         averageRating = 5;
//       }

//       const newItem = reviewFound.map((val) => {
//         const { last_name, _id, first_name } = val.userId;
//         return {
//           ...val._doc,
//           userId: { last_name, _id, first_name },
//         };
//       });

//       return {
//         ...item._doc,
//         merchantId: merchantFound,
//         reviews: newItem.slice(0, 3),
//         totalReview: reviewFound.length,
//         averageRating: Math.floor(averageRating),
//       };
//     })
//   );

//   // success handler
//   successHandler(req, res, {
//     Remarks: "Fetch all products",
//     Data: (allData.reverse()),
//   });
// });

// // list by admin
// const productListByAdmin = asyncHandler(async (req, res) => {
//   const items = await Product.find()
//     .populate("merchantId")
//     .populate("subcategoryId")
//     .populate("categoryId");

//   // success handler
//   successHandler(req, res, {
//     Remarks: "Fetch all products",
//     Data: (items.reverse()),
//   });
// });

// // products by merchant
// const productsListMerchant = asyncHandler(async (req, res) => {
//   const { _id } = req.data;
//   const items = await Product.find({ merchantId: _id })
//     .populate("subcategoryId")
//     .populate("categoryId");
//   // success handler
//   successHandler(req, res, {
//     Remarks: "Fetch products list",
//     Data: items.reverse(),
//   });
// });

// // delete product
// const deleteProduct = asyncHandler(async (req, res) => {
//   const { isMerchant } = req.data;
//   const { productId } = req.params;
//   const item = await Product.findById(productId);

//   if (isMerchant) {
//     if (item) {
//       item.productImage.map((val) => {
//         return deletePreviousImage(val);
//       });
//       const result = await Product.findByIdAndDelete(productId);
//       // success respond
//       successHandler(req, res, { Remarks: "Removed product", Data: result });
//     } else {
//       res.status(400);
//       throw new Error("Invalid product id");
//     }
//   } else {
//     res.status(400);
//     throw new Error("you are not a merchant.");
//   }
// });

// // add product
// const addProduct = asyncHandler(async (req, res) => {
//   const { isMerchant, _id } = req.data;
//   if (isMerchant) {
//     const {
//       subcategoryId,
//       categoryId,
//       productName,
//       productDesc,
//       productActualPrice,
//       productSalePrice,
//       tags,
//       stock,
//       color,
//       size,
//     } = req.body;
//     if (
//       !subcategoryId ||
//       !productName ||
//       !productDesc ||
//       !categoryId ||
//       !stock ||
//       !productActualPrice ||
//       !req.files
//     ) {
//       if (req.files) {
//         req.files.map((val) => {
//           return deletePreviousImage(val.path);
//         });
//       }
//       res.status(400);
//       throw new Error("Please all fields");
//     } else {
//       // resize image
//       const urls = req.files.map((val) => {
//         return val.path;
//       });

//       const newProduct = new Product({
//         subcategoryId,
//         productName,
//         productDesc,
//         tags: JSON.parse(tags),
//         color: JSON.parse(color),
//         size: JSON.parse(size),
//         stock: parseInt(stock),
//         categoryId,
//         productActualPrice,
//         productSalePrice,
//         productImage: urls,
//         merchantId: _id,
//       });

//       const result = await Product.create(newProduct);

//       // success handler
//       successHandler(req, res, { Remarks: "Product saved", Data: result });
//     }
//   } else {
//     res.status(400);
//     throw new Error("You are not merchant.");
//   }
// });

// // update product
// const updateProduct = asyncHandler(async (req, res) => {
//   const { isMerchant, _id } = req.data;
//   if (isMerchant) {
//     const { productId } = req.params;
//     const productFound = await Product.findOne({
//       _id: productId,
//       merchantId: _id,
//     });

//     if (!productFound) {
//       res.status(400);
//       throw new Error("Invalid productId");
//     } else {
//       // resize image

//       const urls =
//         req?.files?.length !== 0
//           ? req?.files?.map((val) => {
//               otherPicResize(val.path);
//               return val.path;
//             })
//           : productFound.productImage;

//       const result = await Product.findByIdAndUpdate(productId, {
//         ...req.body,
//         tags: JSON.parse(req.body.tags),
//         color: JSON.parse(req.body.color),
//         size: JSON.parse(req.body.size),
//         dimension: {
//           height: Number(req.body.height),
//           weight: Number(req.body.weight),
//           length: Number(req.body.length),
//           breadth: Number(req.body.breadth),
//         },
//         productImage: urls,
//       });

//       // success handler
//       successHandler(req, res, { Remarks: "Product updated", Data: result });
//     }
//   } else {
//     res.status(400);
//     throw new Error("You are not merchant");
//   }
// });

// // publish product by admin
// const publishProduct = asyncHandler(async (req, res) => {
//   const { isPublish, productId } = req.body;
//   if (!isPublish || !productId) {
//     res.status(400);
//     throw new Error("Please fill all fields");
//   } else {
//     const findProduct = await Product.findById(productId);
//     if (!findProduct) {
//       res.status(400);
//       throw new Error("Please enter valid product id.");
//     }
//     const findCategory = await Category.findById(findProduct.categoryId);

//     const afterCommission =
//       findCategory.commission === 0
//         ? findProduct.productSalePrice
//         : (findProduct.productSalePrice * findCategory.commission) / 100;

//     const result = await Product.findByIdAndUpdate(productId, {
//       $set: {
//         productSalePrice: findProduct?.afterCommission
//           ? Number(afterCommission?.productSalePrice)
//           : Number(afterCommission) + Number(findProduct.productSalePrice),
//         isPublish: isPublish === "1" ? true : false,
//         afterCommission: true,
//       },
//     });

//     successHandler(req, res, {
//       Remarks: `Product ${isPublish === "1" ? "publish" : "unpublish"} `,
//       Data: result,
//     });
//   }
// });

// module.exports = {
//   productList,
//   productsListMerchant,
//   deleteProduct,
//   addProduct,
//   updateProduct,
//   publishProduct,
//   productListByAdmin,
// };
