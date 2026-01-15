const router = require("express").Router();
const { tokenVerify, adminTokenVerify } = require("../../common/tokenVerify");
const {
  planFetch,
  rechargeRequest,
  fetchDthPlans,
  rechargeHistory,
  dthRequest,
  dthHistory,
  handleFailedRecharge,
  commission,
  rechargeHistoryByAdmin,
  dthHistoryByAdmin,
  Get_Operator_Circle_By_Phone,
  Get_Recharge_Operator_Percent,
  BillhubComplainRaise,
  Recharge_Status_Verify,
  fetchDthOperator,
  Recharge_All_Status_Verify,
  Update_Recharge_Commission,
  fetchDthOperators,
  fetchDthOpDetails,
  userReferralList,
  lastRecharge,
  getCircleAndOperators,
} = require("../../controllers/services/recharge");

const {
  billPayment,
  billPaymentHistory,
  createRefundBillPayment,
  getRefundBillRequest,
  handleFailedPayments,
  bbpsHistory,
  googlePlayPayment,
  BBPS_OPERATOR_LIST_FETCH,
  BBPS_BILL_FETCH,
  BILL_PAYMENT,
} = require("../../controllers/services/bbps");

router.get("/plan_fetch", tokenVerify, planFetch);
router.get("/last-recharge", tokenVerify, lastRecharge);
router.get("/dth_request", tokenVerify, dthRequest);
router.get("/dth_history", tokenVerify, dthHistory);
router.get("/fetch_dth_plans", tokenVerify, fetchDthPlans);
router.get("/fetch_dth_operator", tokenVerify, fetchDthOperator);
router.get("/fetch_dth_operators", fetchDthOperators);
router.get("/commission_list", tokenVerify, commission);
router.get("/get_circle_operators", tokenVerify, getCircleAndOperators);
router.get("/recharge_request", tokenVerify, rechargeRequest);
router.get("/recharge_status_verify", adminTokenVerify, Recharge_Status_Verify);
router.get("/recharge_all_status_verify",adminTokenVerify,Recharge_All_Status_Verify);
router.get("/recharge_history", tokenVerify, rechargeHistory);
router.get("/operator_by_phone", tokenVerify, Get_Operator_Circle_By_Phone);
router.get("/admin/dth_history", adminTokenVerify, dthHistoryByAdmin);
router.post("/admin/recharge_history",adminTokenVerify,rechargeHistoryByAdmin);
router.post("/accept_recharge_refund_request",adminTokenVerify,handleFailedRecharge);

// bbps
router.post("/admin/bbps-history", bbpsHistory);
router.post("/bbps/bill-payment", tokenVerify, billPayment);
router.post("/bbps/new-bill-payment", tokenVerify, BILL_PAYMENT);
router.post("/bbps/google-play", tokenVerify, googlePlayPayment);
router.get("/bbps/bill-history", tokenVerify, billPaymentHistory);
router.post("/bbps/bill-create-refund", tokenVerify, createRefundBillPayment);
router.get("/bbps/bill-refund-request", adminTokenVerify, getRefundBillRequest);
router.post("/bbps/bill-refund-manage", adminTokenVerify, handleFailedPayments);
router.get("/bbps/operator-list", tokenVerify, BBPS_OPERATOR_LIST_FETCH);
router.post("/bbps/new-bill-fetch", tokenVerify, BBPS_BILL_FETCH);

module.exports = router;
