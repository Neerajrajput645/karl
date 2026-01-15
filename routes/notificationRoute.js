const { tokenVerify, adminTokenVerify } = require("../common/tokenVerify");
const {
  notificationList,
  pushNotification,
  notificationListByUser,
  pushNotificationImage
} = require("../controllers/notification");
const { notificationImage } = require("../common/fileUpload");
const router = require("express").Router();

router.get("/list/admin", adminTokenVerify, notificationList);
router.get("/list", tokenVerify, notificationListByUser);
router.post("/push", adminTokenVerify, pushNotification);
router.post("/push-image", adminTokenVerify,  notificationImage.single("image"), pushNotificationImage);

module.exports = router;
