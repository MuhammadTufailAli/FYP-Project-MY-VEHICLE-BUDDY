var express = require("express");
var router = express.Router();
const notificationController = require("../controller/ShopOwnerBuyingNotificationController");

router.get("/getNotification/:id", notificationController.getNotification);
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
