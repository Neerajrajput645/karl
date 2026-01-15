// const axios = require("axios");
// const moment = require("moment");
// const Transaction = require("../models/txnSchema");
// const Merchant = require("../models/merchantSchema");
// const asyncHandler = require("express-async-handler");
// const successHandler = require("../common/successHandler");
// const PlaceOrder = require("../models/shopping/placeOrderSchema");

// const {
//   assign_awb_endpoint,
//   SHIPROCKET_TOKEN,
//   create_order_endpoint,
//   generate_pickup_endpoint,
//   track_awb_endpoint,
//   generate_manifests_endpoint,
//   print_manifests_endpoint,
//   generate_label_endpoint,
//   print_invoice_endpoint,
// } = require("../endpoints/shiprocket");

// // create order in shiprocket
// // @path : /api/shiprocket/orders/create/adhoc
// const createShipRocketOrder = asyncHandler(async (req, res) => {
//   const { orderId, length, weight, height, breadth } = req.body;
//   const findOrder = await PlaceOrder.findById(orderId)
//     .populate("shippingAddress")
//     .populate("userId")
//     .populate("productId");

//   if (findOrder) {
//     const findMerchant = await Merchant.findOne({
//       userId: findOrder.productId.merchantId,
//     });

//     if (findMerchant) {
//       const findTxn = await Transaction.findOne({ orderId });
//       const payload = JSON.stringify({
//         order_id: orderId,
//         order_date: moment().format("YYYY-MM-DD HH:mm"),
//         pickup_location: "Primary",
//         channel_id: "",
//         comment: `Reseller: ${findMerchant?.businessName}`,
//         billing_customer_name: findOrder?.shippingAddress?.firstName,
//         billing_last_name: findOrder?.shippingAddress?.lastName,
//         billing_address: findOrder?.shippingAddress?.houseNo,
//         billing_address_2: findOrder?.shippingAddress?.area,
//         billing_city: findOrder?.shippingAddress?.city,
//         billing_pincode: findOrder?.shippingAddress?.postalCode,
//         billing_state: findOrder?.shippingAddress?.state,
//         billing_country: "India",
//         billing_email: findOrder?.shippingAddress?.email,
//         billing_phone: findOrder?.shippingAddress?.phone,
//         shipping_is_billing: true,
//         shipping_customer_name: findOrder?.shippingAddress?.firstName,
//         shipping_last_name: findOrder?.shippingAddress?.lastName,
//         shipping_address: findOrder?.shippingAddress?.houseNo,
//         shipping_address_2: findOrder?.shippingAddress?.area,
//         shipping_city: findOrder?.shippingAddress?.city,
//         shipping_pincode: findOrder?.shippingAddress?.postalCode,
//         shipping_country: "India",
//         shipping_state: findOrder?.shippingAddress?.state,
//         shipping_email: findOrder?.shippingAddress?.email,
//         shipping_phone: findOrder?.shippingAddress?.phone,
//         order_items: [
//           {
//             name: findOrder?.productId?.productName,
//             sku: findOrder?.productId?._id,
//             units: findOrder?.quantity,
//             selling_price: Number(findOrder?.productId?.productSalePrice),
//             discount: "",
//             tax: "",
//             hsn: 0,
//           },
//         ],
//         payment_method: "Prepaid",
//         shipping_charges: 0,
//         giftwrap_charges: 0,
//         transaction_charges: 0,
//         total_discount: 0,
//         sub_total: findOrder?.totalPrice,
//         length: Number(length),
//         breadth: Number(breadth),
//         height: Number(height),
//         weight: Number(weight),
//       });

//       const config = {
//         method: "post",
//         maxBodyLength: Infinity,
//         url: create_order_endpoint,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: SHIPROCKET_TOKEN,
//         },
//         data: payload,
//       };

//       axios(config)
//         .then(async (response) => {
//           await PlaceOrder.findByIdAndUpdate(orderId, {
//             $set: { shipRocketRes: response.data },
//           });


//           // generate awb
//           const data = JSON.stringify({
//             shipment_id: response.data.shipment_id,
//           });
//           var awb_config = {
//             method: "post",
//             maxBodyLength: Infinity,
//             url: assign_awb_endpoint,
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: SHIPROCKET_TOKEN,
//             },
//             data: data,
//           };
//           axios(awb_config)
//             .then(async (awb_response) => {
//               if (awb_response.data.awb_assign_status === 1) {
//                 await PlaceOrder.findByIdAndUpdate(orderId, {
//                   $set: {
//                     status: "order confirmed",
//                     shipRocketRes: {
//                       awb_code: awb_response.data.response.data.awb_code,
//                       courier_company_id:
//                         awb_response.data.response.data.courier_company_id,
//                       courier_name:
//                         awb_response.data.response.data.courier_name,
//                     },
//                   },
//                 }); // update order
//                 res.status(awb_response.data.status_code).json({
//                   Error: false,
//                   Status: false,
//                   ResponseStatus: 1,
//                   StatusCode: `Ex${awb_response.data.status_code}`,
//                   Remarks: "order confirmed",
//                 });
//               } else {
//                 res.status(awb_response.data.status_code).json({
//                   Error: true,
//                   Status: false,
//                   ResponseStatus: 0,
//                   StatusCode: `Ex${awb_response.data.status_code}`,
//                   Remarks: awb_response.data.message,
//                 });
//               }
//             })
//             .catch(function (error) {
//               res.status(error.response.data.status_code).json({
//                 Error: true,
//                 Status: false,
//                 ResponseStatus: 0,
//                 StatusCode: `Ex${error?.response?.data?.status_code}`,
//                 Remarks: error.response.data,
//               });
//             });
//         })
//         .catch((error) => {
//           res.status(error?.response?.data?.status_code).json({
//             Error: true,
//             Status: false,
//             ResponseStatus: 0,
//             StatusCode: `Ex${error?.response?.data.status_code}`,
//             Remarks: error?.response?.data,
//           });
//         });
//     } else {
//       res.status(400);
//       throw new Error("merchant doesn't exist");
//     }
//   } else {
//     res.status(400);
//     throw new Error("invalid order id");
//   }
// });

// // get a successful pickup response
// // @path : /api/shiprocket/courier/generate/pickup
// const getPickUpResponse = asyncHandler(async (req, res) => {
//   var data = JSON.stringify({
//     shipment_id: req.body.shipment_id,
//   });

//   var config = {
//     method: "post",
//     maxBodyLength: Infinity,
//     url: generate_pickup_endpoint,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: SHIPROCKET_TOKEN,
//     },
//     data: data,
//   };

//   axios(config)
//     .then(function (response) {
//       if (response.data.awb_assign_status === 1) {
//         successHandler(req, res, {
//           Remarks: "success full genrated pichup",
//           Data: response.data,
//         });
//       } else {
//         res.status(400).json({
//           Error: true,
//           Status: false,
//           ResponseStatus: 0,
//           StatusCode: `Ex${400}`,
//           Remarks: response.data.message,
//         });
//       }
//     })
//     .catch(function (error) {
//       res.status(error?.response?.data?.status_code).json({
//         Error: true,
//         Status: false,
//         ResponseStatus: 0,
//         StatusCode: `Ex${error?.response?.data.status_code}`,
//         Remarks: error?.response?.data,
//       });
//     });
// });

// // To get the tracking
// // @path : /api/shiprocket/courier/track/awb
// const getTracking = asyncHandler(async (req, res) => {
//   var config = {
//     method: "get",
//     maxBodyLength: Infinity,
//     url: `${track_awb_endpoint}${req.body.awbCode}`,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: SHIPROCKET_TOKEN,
//     },
//   };

//   axios(config)
//     .then(function (response) {
//       if (response.data.tracking_data.track_status === 1) {
//         successHandler(req, res, {
//           Remarks: "success get tracking status",
//           Data: response.data,
//         });
//       } else {
//         res.status(422).json({
//           Error: true,
//           Status: false,
//           ResponseStatus: 0,
//           StatusCode: `Ex${422}`,
//           Remarks: response.data.tracking_data,
//         });
//       }
//     })
//     .catch(function (error) {
//       res.status(error?.response?.data?.status_code).json({
//         Error: true,
//         Status: false,
//         ResponseStatus: 0,
//         StatusCode: `Ex${error?.response?.data.status_code}`,
//         Remarks: error?.response?.data,
//       });
//     });
// });

// // To generate Maifest
// // @path : /api/shiprocket/manifests/generate
// const generateManifests = asyncHandler(async (req, res) => {
//   var data = JSON.stringify({
//     shipment_id: [req.body.shipment_id],
//   });

//   var config = {
//     method: "post",
//     maxBodyLength: Infinity,
//     url: generate_manifests_endpoint,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: SHIPROCKET_TOKEN,
//     },
//     data: data,
//   };

//   axios(config)
//     .then(function (response) {
//       if (response.data.status === 1) {
//         successHandler(req, res, {
//           Remarks: "success full genrated manifiests",
//           Data: response.data,
//         });
//       } else {
//         res.status(400).json({
//           Error: true,
//           Status: false,
//           ResponseStatus: 0,
//           StatusCode: `Ex${400}`,
//           Remarks: response.data.message,
//         });
//       }
//     })
//     .catch(function (error) {
//       res.status(error?.response?.data?.status_code).json({
//         Error: true,
//         Status: false,
//         ResponseStatus: 0,
//         StatusCode: `Ex${error?.response?.data.status_code}`,
//         Remarks: error?.response?.data,
//       });
//     });
// });

// // To print Maifest
// // @path : /api/shiprocket/manifests/print
// const printManifests = asyncHandler(async (req, res) => {
//   var data = JSON.stringify({
//     order_ids: [req.body.shiprocketOrderId],
//   });

//   var config = {
//     method: "post",
//     maxBodyLength: Infinity,
//     url: print_manifests_endpoint,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: SHIPROCKET_TOKEN,
//     },
//     data: data,
//   };

//   axios(config)
//     .then(function (response) {
//       successHandler(req, res, {
//         Remarks: "success full genrated manifiests",
//         Data: response.data,
//       });
//     })
//     .catch(function (error) {
//       res.status(error?.response?.data?.status_code).json({
//         Error: true,
//         Status: false,
//         ResponseStatus: 0,
//         StatusCode: `Ex${error?.response?.data.status_code}`,
//         Remarks: error?.response?.data,
//       });
//     });
// });

// // To generate label
// // @path : /api/shiprocket/courier/generate/label
// const generateLabel = asyncHandler(async (req, res) => {
//   var data = JSON.stringify({
//     shipment_id: [req.body.shipment_id],
//   });

//   var config = {
//     method: "post",
//     maxBodyLength: Infinity,
//     url: generate_label_endpoint,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: SHIPROCKET_TOKEN,
//     },
//     data: data,
//   };

//   axios(config)
//     .then(function (response) {
//       if (response.data.label_created === 1) {
//         successHandler(req, res, {
//           Remarks: "success full genrated label",
//           Data: response.data,
//         });
//       } else {
//         res.status(400).json({
//           Error: true,
//           Status: false,
//           ResponseStatus: 0,
//           StatusCode: `Ex${400}`,
//           Remarks: response.data,
//         });
//       }
//     })
//     .catch(function (error) {
//       res.status(400).json({
//         Error: true,
//         Status: false,
//         ResponseStatus: 0,
//         StatusCode: `Ex${400}`,
//         Remarks: error?.response?.data,
//       });
//     });
// });

// // To print invoice
// // @path : /api/shiprocket/orders/print/invoice
// const printInvoice = asyncHandler(async (req, res) => {
//   var data = JSON.stringify({
//     ids: [req.body.shiprocketOrderId],
//   });

//   var config = {
//     method: "post",
//     maxBodyLength: Infinity,
//     url: print_invoice_endpoint,
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: SHIPROCKET_TOKEN,
//     },
//     data: data,
//   };

//   axios(config)
//     .then(function (response) {
//       successHandler(req, res, {
//         Remarks: "success fully printed invoice",
//         Data: response.data,
//       });
//     })
//     .catch(function (error) {
//       res.status(400).json({
//         Error: true,
//         Status: false,
//         ResponseStatus: 0,
//         StatusCode: `Ex${400}`,
//         Remarks: error?.response?.data,
//       });
//     });
// });

// module.exports = {
//   createShipRocketOrder,
//   getPickUpResponse,
//   getTracking,
//   generateManifests,
//   printManifests,
//   generateLabel,
//   printInvoice,
// };
