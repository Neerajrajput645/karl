const router = require("express").Router();
const {
  getOrders,
  createOrder,
  statusByMerchant,
  cancelOrderByUser,
  getOrderList,
  approveByAdmin,
  orderListByMerchant,
  deliverStatus,
} = require("../../controllers/shopping/placeOrder");
const { tokenVerify, adminTokenVerify } = require("../../common/tokenVerify");

router
  .route("/")
  .get(tokenVerify, getOrders)
  .post(tokenVerify, createOrder)
  .patch(tokenVerify, statusByMerchant);
router.put("/deliver", adminTokenVerify, deliverStatus);
router.route("/list").get(adminTokenVerify, getOrderList);
router.route("/cancel").patch(tokenVerify, cancelOrderByUser);
router.route("/list-by-merchant").get(tokenVerify, orderListByMerchant);
router.route("/manage-cancel-request").patch(adminTokenVerify, approveByAdmin);

module.exports = router;
