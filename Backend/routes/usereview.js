var express = require("express");
var router = express.Router();

const userreviewController = require("../controller/userreviewController");

router.route("/adduserreview").post(userreviewController.adduserreview);

router.route("/getusereview").get(userreviewController.getusereview);

module.exports = router;
