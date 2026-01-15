const { tokenVerify } = require("../common/tokenVerify");
const { BUS_SOURCE_LIST } = require("../controllers/bus/busBooking");

const router = require("express").Router();

// routes

router.get("/bus-source-list", tokenVerify, BUS_SOURCE_LIST);

module.exports = router;
