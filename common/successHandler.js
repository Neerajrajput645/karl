const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const Admin = require("../models/adminSchema");
const { successLogger } = require("./logger");

const successHandler = async (req, res, data) => {
  const token = req?.headers?.token;

  const getData = () => {
    return new Promise((resolve) => {
      if (!token) return resolve(null); // 🧠 skip if no token
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) return resolve(null); // 🧠 skip on invalid token
        const userFound = await User.findById(decoded._id);
        resolve(userFound);
      });
    });
  };

  const userData = await getData();

  const remarks = userData
    ? `userid: ${userData._id}, name: ${userData.firstName} ${userData.lastName}, phone: ${userData.phone}, ${data.Remarks}`
    : data.Remarks;

  successLogger.log("info", remarks);

  return res.json({
    Error: false,
    Status: true,
    ResponseStatus: 1,
    ...data,
  });
};

module.exports = successHandler;
