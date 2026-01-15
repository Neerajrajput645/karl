const express = require("express");
const {
  getTracking,
  getPickUpResponse,
  createShipRocketOrder,
  generateManifests,
  printManifests,
  generateLabel,
  printInvoice,
} = require("../controllers/shiprocket");
const router = express.Router();

router.post("/courier/track/awb", getTracking);
router.post("/manifests/print", printManifests);
router.post("/manifests/generate", generateManifests);

router.post("/orders/print/invoice", printInvoice);
router.post("/courier/generate/label", generateLabel);

router.post("/courier/generate/pickup", getPickUpResponse);
router.post("/orders/create/adhoc", createShipRocketOrder);

module.exports = router;
