const express = require('express');
const router = express.Router();
const { createSabPaisaOrder,
  //  initiatePaymentAlternative, sabpaisaCallback, testEncryption
   } = require('../../controllers/subPaisaPayment');

router.post('/initiate', createSabPaisaOrder);
// router.post('/initiate-alt', initiatePaymentAlternative); // Test alternative
// router.post('/test-encryption', testEncryption); // Debug route
// router.post('/callback', sabpaisaCallback);

module.exports = router;