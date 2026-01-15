const Ip = require("../models/ipSchema");
const asyncHandler = require("express-async-handler");
const successHandler = require("../common/successHandler");


// ip address list
const ipList = asyncHandler(async (req, res) => {
  const all = await Ip.find();
  // success respond
  successHandler(req, res, {
    Remarks: `Fetch all ip address`,
    Data: (all.reverse()),
  });
});

// ip address list
const newIp = asyncHandler(async (req, res) => {
  console.log("step-1");
  const saveNewIp = new Ip({ ...req.body });
  console.log("step-2");
  const result = await saveNewIp.save();
  console.log("step-3");
  successHandler(req, res, { Remarks: `Saved new ip address`, Data: result });
});

// ip address list
const updateIp = asyncHandler(async (req, res) => {
  const { ipId } = req.params;
  const findIp = await Ip.findById(ipId);

  if (!findIp) {
    res.status(400);
    throw new Error("please enter valid ip");
  }

  const result = await Ip.updateOne({ _id: ipId }, { $set: req.body });
  // success respond
  successHandler(req, res, { Remarks: `Updated new ip address`, Data: result });
});

// ip status update
const updateIpStatus = asyncHandler(async (req, res) => {
  const { ipId } = req.params;
  const findIp = await Ip.findById(ipId);

  if (!findIp) {
    res.status(400);
    throw new Error("please enter valid ip");
  }

  const result = await Ip.updateOne({ _id: ipId }, { $set: req.body });
  // success respond
  successHandler(req, res, {
    Remarks: `Status Updated Success`,
    Data: result,
  });
});

// ip address list
const removeIp = asyncHandler(async (req, res) => {
  const { ipId } = req.params;
  const findIp = await Ip.findById(ipId);

  if (!findIp) {
    res.status(400);
    throw new Error("please enter valid ip");
  }

  const result = await Ip.findByIdAndRemove(ipId);
  // success respond
  successHandler(req, res, { Remarks: `Removed ip address`, Data: result });
});

module.exports = { ipList, newIp, updateIp, removeIp, updateIpStatus };
