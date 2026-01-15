const router = require("express").Router();
const { adminTokenVerify, tokenVerify } = require("../../common/tokenVerify");
const {
  createServiceRequest,
  allServiceRequestsList,
  usersServiceRequestList,
  allProvidersRequest,
  serviceRequestDetails,
  serviceRequestById,
  completeRequest,
  acceptRequest,
  declineRequest,
  deleteServiceRequest,
  cancelRequest,
  // providerServiceList
} = require("../../controllers/newControllers/serviceRequest");

router.post("/", tokenVerify, createServiceRequest);

router.get("/admin", adminTokenVerify, allServiceRequestsList);
router.get("/user", tokenVerify, usersServiceRequestList);

router.get("/provider", tokenVerify, allProvidersRequest);

router.get("/admin/:requestId", adminTokenVerify, serviceRequestDetails);
router.get("/:requestId", tokenVerify, serviceRequestById);
// router.get("/service-provider/list", tokenVerify, providerServiceList);

router.post("/:requestId/accept", tokenVerify, acceptRequest);
router.post("/:requestId/decline", tokenVerify, declineRequest);

router.post("/:requestId/cancel", tokenVerify, cancelRequest);

router.put("/:requestId/complete", tokenVerify, completeRequest);
router.delete("/:requestId/remove", tokenVerify, deleteServiceRequest);

module.exports = router;
