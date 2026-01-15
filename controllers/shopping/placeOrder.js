// const User = require("../../models/userSchema");
// const Wallet = require("../../models/walletSchema");
// const Matrix = require("../../models/matrixSchema");
// const asyncHandler = require("express-async-handler");
// const Transaction = require("../../models/txnSchema");
// const Service = require("../../models/serviceSchema");
// const Cart = require("../../models/shopping/cartSchema");
// const successHandler = require("../../common/successHandler");
// const AdminWallet = require("../../models/adminWalletSchema");
// const Products = require("../../models/shopping/productSchema");
// const Notification = require("../../models/notificationSchema");
// const sendNotification = require("../../common/sendNotification");
// const PlaceOrder = require("../../models/shopping/placeOrderSchema");
// const { createShipRocketOrder } = require("../shiprocket");
// const getIpAddress = require("../../common/getIpAddress");
// const { encryptFunc } = require("../../common/encryptDecrypt");
// const Users = require("../../models/userSchema");

// // @desc get all order by User
// // @path /api/order
// const getOrders = asyncHandler(async (req, res) => {
//   const userFound = req.data;
//   const ordersData = await PlaceOrder.find({ userId: userFound._id })
//     .populate("shippingAddress")
//     .populate("productId");

//   // success handler
//   successHandler(req, res, {
//     Remarks: "Fetch all orders",
//     Data: (ordersData.reverse()),
//   });
// });

// // @desc : Order list by admin
// // @path /api/order/list
// const getOrderList = asyncHandler(async (req, res) => {
//   const ordersData = req.query
//     ? await PlaceOrder.find(req.query)
//         .populate("shippingAddress")
//         .populate("productId")
//         .populate("merchantId")
//     : await PlaceOrder.find()
//         .populate("shippingAddress")
//         .populate("productId")
//         .populate("merchantId");

//   // success handler
//   successHandler(req, res, {
//     Remarks: "Fetch all orders",
//     Data: (ordersData.reverse()),
//   });
// });

// // @desc : Order list by merchant
// // @path /api/order/list-by-merchant
// const orderListByMerchant = asyncHandler(async (req, res) => {
//   const { isMerchant, _id } = req.data;
//   if (isMerchant) {
//     const ordersData = await PlaceOrder.find({ merchantId: _id })
//       .populate("shippingAddress")
//       .populate("productId")
//       .populate("userId");

//     // success handler
//     successHandler(req, res, {
//       Remarks: "Fetch all orders",
//       Data: ordersData.reverse(),
//     });
//   } else {
//     res.status(400);
//     throw new Error("you are not a merchant");
//   }
// });

// // @desc : Create Order
// // @path /api/order
// const createOrder = asyncHandler(async (req, res) => {
//   const userFound = req.data;
//   const { shippingAddressId, paymentMethod, items, txnId, orderId, isCart } =
//     req.body;

//   const FindUser = await Users.findOne({ _id: userFound._id });

//   if (FindUser.shopping) {
//     const transactionFound = await Transaction.findOne({
//       txnId,
//       orderId,
//       txnStatus: "TXN_SUCCESS",
//     });

//     if (transactionFound) {
//       // Get the current date
//       const currentDate = new Date();

//       // Add 24 hours (24 * 60 * 60 * 1000 milliseconds) to the current date
//       const after24Hours = new Date(
//         currentDate.getTime() + 24 * 60 * 60 * 1000
//       );

//       // Convert the date to a string
//       const deliveryDate = after24Hours.toISOString();

//       // Place order
//       items.map(async (data) => {
//         await Products.findByIdAndUpdate(data.productId, {
//           $inc: { stock: -1 },
//         });
//         const findProduct = await Products.findById(data.productId);
//         const newOrder = new PlaceOrder({
//           userId: userFound._id,
//           totalPrice: Number(transactionFound.txnAmount),
//           paymentMethod,
//           shippingAddress: shippingAddressId,
//           productId: data.productId,
//           quantity: data.quantity,
//           size: data.size,
//           color: data.color,
//           txnId,
//           deliveryDate,
//           merchantId: findProduct?.merchantId,
//         });
//         await newOrder.save();
//       });

//       // Empty the cart
//       isCart &&
//         (await Cart.findOneAndUpdate(
//           { userId: userFound._id },
//           { $set: { items: [], total: 0 } }
//         ));

//       // success handler
//       successHandler(req, res, {
//         Remarks: "Placed your order",
//         DeliveryDate: deliveryDate,
//         Data: {
//           orderId,
//           txnId,
//           totalPrice: Number(transactionFound.txnAmount),
//         },
//       });
//     } else {
//       res.status(400);
//       throw new Error("Transaction is failed!");
//     }
//   } else {
//     res.status(400);
//     throw new Error("This service currently block");
//   }
// });

// // @desc : Order status update by merchant
// // @path /api/order
// const statusByMerchant = asyncHandler(async (req, res) => {
//   const { isMerchant } = req.data;
//   if (isMerchant) {
//     const { orderId, status, reason } = req.body;
//     if (!orderId) {
//       res.status(400);
//       throw new Error("All fields are mandatory");
//     }
//     if (status == "canceled requested" && !reason) {
//       res.status(400);
//       throw new Error("Please provide reason");
//     }
//     await PlaceOrder.findByIdAndUpdate(orderId, {
//       $set: { status, actionBy: "Merchant", reason },
//     });
//     // success handler
//     successHandler(req, res, { Remarks: "Order Status Updated" });
//   } else {
//     res.status(400);
//     throw new Error("You are not merchant");
//   }
// });

// // @desc : Cancel order request generate by User
// // @path /api/order/cancel
// const cancelOrderByUser = asyncHandler(async (req, res) => {
//   const { orderId, reason } = req.body;
//   if (!orderId || !reason) {
//     res.status(400);
//     throw new Error("All fields are mandatory");
//   }
//   const findOrder = await PlaceOrder.findById(orderId);
//   if (findOrder && findOrder.status !== "canceled requested") {
//     await PlaceOrder.findByIdAndUpdate(orderId, {
//       $set: { status: "canceled requested", reason, actionBy: "User" },
//     });
//     successHandler(req, res, { Remarks: "order cancel requested" });
//   } else {
//     res.status(400);
//     throw new Error(
//       findOrder ? "Your order already canceled." : "Invalid order id."
//     );
//   }
// });

// // @desc : Order status update by admin about cancel request
// const approveByAdmin = asyncHandler(async (req, res) => {
//   const { _id } = req.data;
//   const { orderId, status } = req.body;
//   if (!orderId || !status) {
//     res.status(400);
//     throw new Error("All fields are mandatory");
//   }
//   const findOrder = await PlaceOrder.findById(orderId);
//   if (findOrder && findOrder.status !== "canceled") {
//     // if cancel request approved then refund initiate
//     if (status == "canceled") {
//       // find transaction & user & service
//       const findTxn = await Transaction.findOne({ txnId: findOrder.txnId });
//       const userFound = await User.findById(findOrder.userId);
//       const findService = await Service.findOne({ name: "Shopping" });

//       // calculate amounts
//       const percent =
//         (findTxn.txnAmount / 100) *
//         (findTxn.isUsePrime ? 25 : findService.percent);

//       // update wallet
//       await Wallet.updateOne(
//         { userId: findOrder.userId },
//         {
//           $inc: {
//             balance: findTxn.txnAmount - percent,
//             goPoints: findTxn.isUsePrime ? 0 : percent,
//             primePoints: findTxn.isUsePrime ? percent : 0,
//           },
//         }
//       );
//       await AdminWallet.updateOne(
//         { adminId: _id },
//         {
//           $inc: {
//             balance: -(findTxn.txnAmount - percent),
//             goPoints: -(findTxn.isUsePrime ? 0 : percent),
//             primePoints: -(findTxn.isUsePrime ? percent : 0),
//           },
//         }
//       );

//       // Push notification
//       const notification = {
//         title: "Refund initiated",
//         body: `Your refund ${findTxn.txnAmount} rupay is refunded into wallet.`,
//       };

//       // save notification

//       const newNotification = new Notification({
//         ...notification,
//         recipient: findOrder.userId,
//       });
//       await newNotification.save();
//       userFound.deviceToken &&
//         sendNotification(notification, userFound.deviceToken);

//       // ----------- Create Txn History ------------- //
//       const subtractBalance = new Transaction({
//         userId: userFound._id,
//         recipientId: userFound._id,
//         txnName: "Refund Initiated",
//         txnDesc: "Your refund credited into your wallet",
//         txnAmount: findTxn.txnAmount,
//         txnType: "credit",
//         txnStatus: "TXN_SUCCESS",
//         txnResource: "Wallet",
//         txnId: Math.floor(Math.random() * Date.now()) + "refund",
//         orderId: Math.floor(Math.random() * Date.now()) + "refund",
//         ipAddress: getIpAddress(req),
//       });
//       await subtractBalance.save(); // wallet balance history
//       const subtractGoPoints = new Transaction({
//         userId: userFound._id,
//         recipientId: userFound._id,
//         txnName: "Refund Initiated",
//         txnDesc: "Your refund Initiated.",
//         txnType: "credit",
//         txnStatus: "TXN_SUCCESS",
//         txnResource: findTxn.isUsePrime ? "PrimePoints" : "GoPoints",
//         txnId: Math.floor(Math.random() * Date.now()) + "refund",
//         orderId: Math.floor(Math.random() * Date.now()) + "refund",
//         txnAmount: percent,
//         ipAddress: getIpAddress(req),
//       });
//       await subtractGoPoints.save(); // go points history
//       await PlaceOrder.findByIdAndUpdate(orderId, {
//         $set: { status, actionBy: "Admin" },
//       });
//       successHandler(req, res, { Remarks: "order status updated" });
//     }

//     // if cancel request rejected
//     await PlaceOrder.findByIdAndUpdate(orderId, {
//       $set: { status, actionBy: "Admin" },
//     });
//     successHandler(req, res, { Remarks: "order status updated" });
//   } else {
//     res.status(400);
//     throw new Error(findOrder ? "Your already refunded." : "Invalid order id.");
//   }
// });

// // @desc : Delivery Status On Delivered Product ---> By ShipRocket
// // @path : /api/order/deliver
// const deliverStatus = async (req, res) => {
//   const { orderId, status } = req.body;
//   const findOrder = await PlaceOrder.findById(orderId);
//   // throw error when invalid order id
//   if (!findOrder) {
//     res.status(400);
//     throw new Error("please provide valid order id");
//   } else {
//     const userFound = await User.findById(findOrder.userId); // find user
//     const walletFound = await Wallet.findById(userFound.wallet); // find user

//     const findTxn = await Transaction.findOne({ txnId: findOrder.txnId }); // find transaction
//     const serviceData = await Service.findOne({ name: "Shopping" }); // find service
//     const discountPercent = (parseInt(findTxn.txnAmount) / 100) * 25; // if use prime
//     const cashbackPercent =
//       (parseInt(findTxn.txnAmount) / 100) * serviceData.percent;
//     if (status === "delivered") {
//       // Repurchsing Logic Process
//       const commision =
//         ((findTxn.isUsePrime ? discountPercent : cashbackPercent) / 100) * 25;
//       const find_parent_id = async (id) => {
//         const a = await Matrix.findOne({ userId: id });
//         return a?.parentId;
//       };
//       let arr = [];
//       const find_upline = async (pr) => {
//         const id = await find_parent_id(pr);
//         if (id) {
//           arr.push(id);
//           await find_upline(id);
//         }
//       };
//       await find_upline(userFound.referalId);
//       const perUp = commision / arr.length;
//       arr &&
//         arr.map(async (item, index) => {
//           const fin = await User.findOne({ referalId: item });
//           if (fin.level <= 10) {
//             await Wallet.updateOne(
//               { userId: fin._id },
//               { $inc: { balance: (Math.round(perUp * 100) / 100).toFixed(2) } }
//             );
//             // create txn History
//             const repurchaseIncom = new Transaction({
//               userId: fin._id,
//               recipientId: fin._id,
//               txnName: "Repurchase Income",
//               txnDesc: `You have get ${(Math.round(perUp * 100) / 100).toFixed(
//                 2
//               )} rupay as repurchase income.`,
//               txnAmount: (Math.round(perUp * 100) / 100).toFixed(2),
//               txnType: "credit",
//               txnStatus: "TXN_SUCCESS",
//               txnResource: "Wallet",
//               txnId:
//                 Math.floor(Math.random() * Date.now()) + "repurchase" + index,
//               orderId:
//                 Math.floor(Math.random() * Date.now()) + "repurchase" + index,
//               ipAddress: getIpAddress(req),
//             });
//             await repurchaseIncom.save();

//             // notification
//             const notification = {
//               title: "Repurchase Income",
//               body: `You have get ${(Math.round(perUp * 100) / 100).toFixed(
//                 2
//               )} rupay as repurchase income.`,
//             };

//             const newNotification = new Notification({
//               ...notification,
//               recipient: fin._id,
//             });
//             await newNotification.save();

//             // send notification
//             fin?.deviceToken &&
//               sendNotification(notification, fin?.deviceToken);
//           }
//         });

//       // Handle CashBack
//       const cbCalculateGoPoints =
//         cashbackPercent >= walletFound?.goPoints
//           ? cashbackPercent - walletFound?.goPoints
//           : cashbackPercent;

//       const cbCalculatePrimePoints =
//         discountPercent >= walletFound.primePoints
//           ? discountPercent - walletFound.primePoints
//           : discountPercent;

//       const cbAmount = findTxn.isUsePrime
//         ? cbCalculatePrimePoints
//         : cbCalculateGoPoints;

//       const addCashBack = new Transaction({
//         userId: userFound._id,
//         recipientId: userFound._id,
//         txnName: "Cashback",
//         txnDesc: `Congratulation...! you got ${cbAmount} cashback`,
//         txnType: "credit",
//         txnStatus: "TXN_SUCCESS",
//         txnResource: "Cashbacks",
//         txnId: Math.floor(Math.random() * Date.now()) + "cashbackgo",
//         orderId: Math.floor(Math.random() * Date.now()) + "cashbackgo",
//         txnAmount: cbAmount,
//         ipAddress: getIpAddress(req),
//       });
//       await Wallet.findByIdAndUpdate(walletFound._id, {
//         $inc: { balance: cbAmount },
//       });
//       await addCashBack.save();

//       // notification
//       const notification = {
//         title: "Received Cashback",
//         body: `Congratulation...! 🎉 You got ${
//           findTxn.isUsePrime ? discountPercent : cashbackPercent
//         } rupees as a cashback.`,
//       };
//       const newNotification = new Notification({
//         ...notification,
//         recipient: userFound._id,
//       });
//       await newNotification.save();

//       // send notification
//       userFound?.deviceToken &&
//         sendNotification(notification, userFound?.deviceToken);
//     }
//     await PlaceOrder.findByIdAndUpdate(orderId, { status });
//     successHandler(req, res, { Remarks: `Order ${status}` }); // success respond
//   }
// };

// module.exports = {
//   getOrders,
//   createOrder,
//   statusByMerchant,
//   cancelOrderByUser,
//   getOrderList,
//   approveByAdmin,
//   orderListByMerchant,
//   deliverStatus,
// };
