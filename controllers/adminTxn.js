const User = require("../models/userSchema");
const Admin = require("../models/adminSchema");
const AdminTxn = require("../models/adminTxnSchema");
const asyncHandler = require("express-async-handler");
const successHandler = require("../common/successHandler");
const { encryptFunc } = require("../common/encryptDecrypt");

// txn list Admin
const txnList = asyncHandler(async (req, res) => {
  const { _id } = req.data;
  const { type } = req.query;
  const txnFound =
    type != "undefined"
      ? await AdminTxn.find({ adminId: _id, txnResource: type })
      : await AdminTxn.find({ adminId: _id });

  const result = await Promise.all(
    txnFound.map(async (item) => {
      const data =
        item.type === "credit"
          ? await Admin.findOne({ _id: item.recipientId })
          : await User.findOne({ _id: item.recipientId });

      return {
        ...item._doc,
        recipientId: item.type === "credit" ? item.recipientId : data,
      };
    })
  );

  // success respond
  successHandler(req, res, {
    Remarks: "Txn List",
    Data: (result.reverse()),
  });
});

module.exports = { txnList };
