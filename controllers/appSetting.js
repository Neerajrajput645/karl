const AppSetting = require("../models/appSetting");
const asyncHandler = require("express-async-handler");
const successHandler = require("../common/successHandler");
// const { encryptFunc } = require("../common/encryptDecrypt");
const rechargeApiProviderSchema = require("../models/service/rechargeApiProviderSchema");
const getIpAddress = require("../common/getIpAddress");
const planFetchProviderSchema = require("../models/service/planFetchProviderSchema");
// app setting update
const settingUpdate = asyncHandler(async (req, res) => {
  const result = await AppSetting.findOne();
  await AppSetting.findByIdAndUpdate(result._id, {
    ...req.body,
    logo: req.file?.path,
  });
  successHandler(req, res, { Remarks: "Setting updated success." });
});

// app setting get
const settingGet = asyncHandler(async (req, res) => {
  const result = await AppSetting.findOne();
  successHandler(req, res, {
    Remarks: "Fetch app setting.",
    Data: result,
  });
});
// ADD_RECHARGE_API_PROVIDER POST
const ADD_RECHARGE_API_PROVIDER = asyncHandler(async (req, res) => {
  const { providerCode, providerName } = req.body;
  const Recharge_Code_Find = await rechargeApiProviderSchema.findOne({
    providerCode,
  });
  if (Recharge_Code_Find) {
    res.status(400);
    throw new Error("Provider Code Already Used");
  }
  const newProvider = new rechargeApiProviderSchema({
    providerCode,
    providerName,
    ipAddress: getIpAddress(req),
  });
  await newProvider.save();

  // success respond
  successHandler(req, res, { Remarks: "Provider Add Successfully." });
});
// RECHARGE_API_PROVIDER GET
const GET_RECHARGE_API_PROVIDER = asyncHandler(async (req, res) => {
  const result = await rechargeApiProviderSchema.find();
  successHandler(req, res, {
    Remarks: "Fetch Providers.",
    Data: result,
  });
});
// SELECT_RECHARGE_API_PROVIDER GET
const SELECT_RECHARGE_API_PROVIDER = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  await rechargeApiProviderSchema.updateMany({}, { $set: { isTrue: false } });

  // Set isTrue field to true for the selected provider
  await rechargeApiProviderSchema.findByIdAndUpdate(_id, {
    $set: { isTrue: true },
  });

  // success respond
  successHandler(req, res, { Remarks: "Provider update Successfully." });
});

// ADD_PLAN_API_PROVIDER POST
const ADD_PLAN_API_PROVIDER = asyncHandler(async (req, res) => {
  const { providerCode, providerName } = req.body;
  const Recharge_Code_Find = await planFetchProviderSchema.findOne({
    providerCode,
  });
  if (Recharge_Code_Find) {
    res.status(400);
    throw new Error("Provider Code Already Used");
  }
  const newProvider = new planFetchProviderSchema({
    providerCode,
    providerName,
    ipAddress: getIpAddress(req),
  });
  await newProvider.save();

  // success respond
  successHandler(req, res, { Remarks: "Provider Add Successfully." });
});

// PLAN_API_PROVIDER GET
const GET_PLAN_API_PROVIDER = asyncHandler(async (req, res) => {
  const result = await planFetchProviderSchema.find();
  successHandler(req, res, {
    Remarks: "Fetch Providers.",
    Data: result,
  });
});

// SELECT_PLAN_API_PROVIDER GET
const SELECT_PLAN_API_PROVIDER = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  await planFetchProviderSchema.updateMany({}, { $set: { isTrue: false } });

  // Set isTrue field to true for the selected provider
  await planFetchProviderSchema.findByIdAndUpdate(_id, {
    $set: { isTrue: true },
  });

  // success respond
  successHandler(req, res, { Remarks: "Provider update Successfully." });
});

module.exports = {
  settingUpdate,
  settingGet,
  ADD_RECHARGE_API_PROVIDER,
  GET_RECHARGE_API_PROVIDER,
  SELECT_RECHARGE_API_PROVIDER,
  ADD_PLAN_API_PROVIDER,
  GET_PLAN_API_PROVIDER,
  SELECT_PLAN_API_PROVIDER,
};
