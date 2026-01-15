const router = require("express").Router();
const { tokenVerify} = require("../common/tokenVerify");
const { userSignUp,logout } = require("../controllers/auth");

// ========================= Auth Routes ==========================
router.post("/user-register", userSignUp); 
router.post("/logout", tokenVerify, logout); 

module.exports = router;
