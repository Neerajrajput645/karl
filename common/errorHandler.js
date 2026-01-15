const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const { errorLogger } = require("./logger");

const errorHandler = async (err, req, res, next) => {
  const token = req?.headers?.token;

  // Safely get user data if token exists and is valid
  const getData = () => {
    return new Promise((resolve) => {
      if (!token) return resolve(null); // 🧠 Skip if no token

      jwt.verify(token, process.env.JWT_SECRET, async (verifyErr, decoded) => {
        if (verifyErr) return resolve(null); // 🧠 Skip on invalid/malformed token
        const userFound = await User.findById(decoded._id);
        resolve(userFound);
      });
    });
  };

  const userData = await getData();

  const remarks = userData
    ? `userid: ${userData._id}, name: ${userData.firstName} ${userData.lastName}, phone: ${userData.phone}, ${err.message.replace("Error: ", "")}`
    : err.message.replace("Error: ", "");

  const StatusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Log error details
  errorLogger.log("error", remarks);

  // Send clean structured error response
  return res.status(StatusCode).json({
    Error: true,
    Status: false,
    ResponseStatus: 0,
    StatusCode: `Ex${StatusCode}`,
    Remarks: err.message,
  });
};

module.exports = errorHandler;
