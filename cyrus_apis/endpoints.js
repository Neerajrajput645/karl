const baseURL = "https://cyrusrecharge.in/api/";

const recharge = baseURL + "recharge.aspx";
const get_operator = baseURL + "GetOperator.aspx";
const plan_fetch = baseURL + "CyrusPlanFatchAPI.aspx";
const recharge_status = baseURL + "rechargestatus.aspx";
const dth_info_fetch = baseURL + "CyrusROfferAPI.aspx";

// bbps
const bbps_bill_payment = baseURL + "recharge.aspx";
const bbps_bill_info = baseURL + "BillFetch_Cyrus_BA.aspx";
const bbps_bill_fetch = baseURL + "BillFetch_Cyrus_BA.aspx";

module.exports = {
  plan_fetch,
  get_operator,
  recharge,
  recharge_status,
  dth_info_fetch,
  bbps_bill_payment,
  bbps_bill_info,
  bbps_bill_fetch,
};
