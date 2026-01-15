const router = require('express').Router();
const { findName } = require('../../controllers/newControllers/nameFind');
const { tokenVerify } = require('../../common/tokenVerify');
router.get('/find-name/:number', tokenVerify, findName);
module.exports = router;