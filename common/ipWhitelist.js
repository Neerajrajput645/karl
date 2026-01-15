const axios = require("axios");

const Ip = require("../models/ipSchema");

// IP whitelist middleware
const ipWhitelist = async (req, res, next) => {
  const all = await Ip.find().select("ip");
  const allowlist = all.map((item) => item.ip);
  const ipAddress = await axios.get("https://api64.ipify.org?format=json");
  const ipClient = ipAddress.data.ip;
  if (allowlist.includes(ipClient)) {
    next(); // Proceed to the next middleware/route
  } else {
    res.status(403).send("Access Denied");
  }
};

module.exports = ipWhitelist;
