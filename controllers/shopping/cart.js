// const asyncHandler = require("express-async-handler");
// const Cart = require("../../models/shopping/cartSchema");
// const successHandler = require("../../common/successHandler");
// const Product = require("../../models/shopping/productSchema");
// const { encryptFunc } = require("../../common/encryptDecrypt");

// // @desc get cart
// // @path /api/cart
// const getCart = asyncHandler(async (req, res) => {
//   const userFound = req.data;
//   const cartData = await Cart.findOne({ userId: userFound._id }).populate(
//     "items.productId"
//   );
//   // success handler
//   successHandler(req, res, {
//     Remarks: "Fetch cart details",
//     Data: (cartData),
//   });
// });

// // @desc add to cart
// // @path /api/cart
// const addCart = asyncHandler(async (req, res) => {
//   const userFound = req.data;
//   const { productId, quantity, color, size } = req.body;
//   const cartData = await Cart.findOne({ userId: userFound._id });

//   if (!productId || !quantity || !color || !size) {
//     res.status(400);
//     throw new Error("Please fill all fields");
//   }

//   if (cartData) {
//     // Check if the product already exists in the cart
//     const existingItem = cartData.items.find(
//       (item) =>
//         item.productId.toString() === productId &&
//         item.size === size &&
//         item.color === color
//     );

//     if (existingItem) {
//       const newQuantity = existingItem.quantity + parseInt(quantity);
//       if (newQuantity === 0) {
//         // If the new quantity is zero, remove the item from the cart
//         await Cart.findByIdAndUpdate(
//           {
//             _id: cartData._id,
//             "items.productId": productId,
//             "items.color": color,
//             "items.size": size,
//           },
//           {
//             $pull: { items: { productId, color, size } },
//           }
//         );
//       } else {
//         // If the new quantity is not zero, update the quantity
//         await Cart.findOneAndUpdate(
//           {
//             _id: cartData._id,
//             "items.productId": productId,
//             "items.color": color,
//             "items.size": size,
//           },
//           {
//             $set: { "items.$.quantity": newQuantity },
//           }
//         );
//       }
//     } else {
//       // If the product doesn't exist, add a new item to the cart
//       await Cart.findByIdAndUpdate(cartData._id, {
//         $addToSet: {
//           items: { productId, quantity: parseInt(quantity), color, size },
//         },
//       });
//     }
//   } else {
//     // if cart does not exist
//     const newCart = new Cart({
//       userId: userFound._id,
//       items: [
//         {
//           productId: productId,
//           color,
//           size,
//           quantity: 1,
//         },
//       ],
//     });
//     await newCart.save();
//   }
//   // Calculate the total amount
//   const updatedCart = await Cart.findOne({ userId: userFound._id }).populate(
//     "items.productId"
//   );
//   let totalAmount = 0;
//   for (const item of updatedCart.items) {
//     const product = item.productId;
//     const itemQuantity = item.quantity;
//     const itemPrice = product.productSalePrice
//       ? product.productSalePrice
//       : product.productActualPrice;
//     const itemAmount = itemQuantity * parseInt(itemPrice);
//     totalAmount += itemAmount;
//   }

//   await Cart.findByIdAndUpdate(updatedCart._id, {
//     $set: { total: totalAmount },
//   });

//   const cartG = await Cart.findById(updatedCart._id);

//   // success handler
//   successHandler(req, res, {
//     Remarks: "Added item to cart",
//     Data: cartG,
//   });
// });

// // @desc remove product from cart
// // @path /api/cart/:cartItemId
// const removeProductFromCart = asyncHandler(async (req, res) => {
//   try {
//     const userFound = req.data;
//     const { cartItemId } = req.params;

//     // Find the cart by its ID
//     const cart = await Cart.findOne({ userId: userFound._id });

//     if (!cart) {
//       return res.status(404).json({ error: "Cart not found" });
//     }

//     // Remove the product from items array by its ID
//     cart.items = cart.items.filter(
//       (item) => item._id.toString() !== cartItemId
//     );

//     // Calculate the updated total price
//     let totalPrice = 0;
//     for (const item of cart.items) {
//       const product = await Product.findById(item.productId);
//       if (product) {
//         totalPrice +=
//           item.quantity *
//           parseInt(
//             product.productSalePrice
//               ? product.productSalePrice
//               : product.productActualPrice
//           );
//       }
//     }

//     // Update the total price
//     cart.total = totalPrice;

//     // Save the updated cart
//     await cart.save();

//     const cartFound = await Cart.findOne({ userId: userFound._id });

//     // success handler
//     successHandler(req, res, {
//       Remarks: "Removed product from cart",
//       Data: cartFound,
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });

// module.exports = { getCart, addCart, removeProductFromCart };
