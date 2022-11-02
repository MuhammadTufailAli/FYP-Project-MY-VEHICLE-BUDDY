var express = require("express");
var router = express.Router();
const notificationController = require("../controller/CustomerMechanicNotificationController");
router.get("/getNotification", notificationController.getNotification);
router.post("/PostNotification", notificationController.postNotification);
router.patch(
  "/updateNotification/:id",
  notificationController.updateNotification
);

router.delete(
  "/deleteNotification/:id",
  notificationController.deleteNotification
);

module.exports = router;
