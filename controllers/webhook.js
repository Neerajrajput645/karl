// const asyncHandler = require("express-async-handler");
// const PlaceOrder = require("../models/shopping/placeOrderSchema");
// const { deliverStatus } = require("./shopping/placeOrder");

// // webHook to get shiprocket response status
// // path : /api/webhook
// const webhook = asyncHandler(async (req, res) => {
//   const { awb, current_status, order_id } = req.body;
//   const findOrder = await PlaceOrder.findOne({
//     shipRocketRes: { awb_code: awb, order_id },
//   });

//   switch (current_status) {
//     case "Delivered":
//       req.body = { status: current_status, orderId: findOrder?._id };
//       deliverStatus(req, res);
//       break;

//     default:
//       break;
//   }

//   // res.json({ message: "webhook called success" });
// });

// module.exports = { webhook };
