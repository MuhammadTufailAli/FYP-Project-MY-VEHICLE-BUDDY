var express = require("express");
var router = express.Router();

const faqController = require("../controller/faqController");

router.route("/addfaq").post(faqController.addfaq);

router.route("/getfaq").get(faqController.getfaq);

module.exports = router;
