var express = require('express');
var router = express.Router();


const feedbackController = require('../controller/feedbackController');

router
  .route('/addfeedback')
  .post(
    feedbackController.addfeedback
  );

router
  .route('/getfeedback')
  .get(feedbackController.getfeedback);

module.exports = router;
