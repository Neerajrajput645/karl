const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const Admin = require("../models/adminSchema");
const expressAsyncHandler = require("express-async-handler");

// user & merchant
const tokenVerify = expressAsyncHandler((req, res, next) => {
  const isAuth = req.headers.token;

  if (isAuth) {
    // verify token
    jwt.verify(isAuth, process.env.JWT_SECRET, async (err, data) => {
      if (err) {
        // throw error
        return res.status(400).json({
          Error: true,
          Status: false,
          ResponseStatus: 0,
          StatusCode: `Ex400`,
          Remarks: "Invalid token",
        });
      } else {
        const { _id } = data;
        // success response
        const userFound = await User.findById(_id);
        if (!userFound) {
          return res.status(400).json({
            Error: true,
            Status: false,
            ResponseStatus: 0,
            StatusCode: `Ex400`,
            Remarks: "Invalid token",
          });
        }

        // if user has blocked
        if (!userFound?.status) {
          return res.status(400).json({
            Error: true,
            Status: false,
            ResponseStatus: 0,
            StatusCode: `Ex400`,
            Remarks: "you are blocked",
          });
        }

        req.data = { ...userFound?._doc, _id };
        next();
      }
    });
  } else {
    // throw error
    return res.status(400).json({
      Error: true,
      Status: false,
      ResponseStatus: 0,
      StatusCode: `Ex400`,
      Remarks: "Please provide token",
    });
  }
});

// admin token verify
const adminTokenVerify = expressAsyncHandler((req, res, next) => {
  const isAuth = req.headers.token;

  if (isAuth) {
    // verify token
    jwt.verify(isAuth, process.env.JWT_SECRET, async (err, data) => {
      if (err || !data) {
        // throw error
        return res.status(400).json({
          Error: true,
          Status: false,
          ResponseStatus: 0,
          StatusCode: `Ex400`,
          Remarks: "Invalid token",
        });
      } else {
        const { _id } = data;
        if (!_id) {
          // throw error
          return res.status(400).json({
            Error: true,
            Status: false,
            ResponseStatus: 0,
            StatusCode: `Ex400`,
            Remarks: "Please provide token",
          });
        }
        // success response
        const adminFound = await Admin.findOne({ _id });
        if (!adminFound) {
          return res.status(400).json({
            Error: true,
            Status: false,
            ResponseStatus: 0,
            StatusCode: `Ex400`,
            Remarks: "Invalid token",
          });
        }
        req.data = adminFound;
        next();
      }
    });
  } else {
    // throw error
    return res.status(400).json({
      Error: true,
      Status: false,
      ResponseStatus: 0,
      StatusCode: `Ex400`,
      Remarks: "Please provide token",
    });
  }
});

module.exports = { tokenVerify, adminTokenVerify };
