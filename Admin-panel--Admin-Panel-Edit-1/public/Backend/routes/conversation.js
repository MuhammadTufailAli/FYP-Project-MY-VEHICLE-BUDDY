var express = require('express');
var router = express.Router();

const loginController = require('../controller/loginController');
const conversationController = require('../controller/conversationController');

router
  .route('/')
  .post(loginController.protect, conversationController.addConversation)
  .get(loginController.protect, conversationController.getUserConversation);

router
  .route('/find/:firstUserId/:secondUserId')
  .get(loginController.protect, conversationController.getUserConversation2);
module.exports = router;
