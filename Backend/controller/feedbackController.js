const { response } = require('express');
const Feedback = require('../models/feedback');



exports.addfeedback = async (req, res) => {
 let feedback= new Feedback({
  username:req.body.username,
  userfeedback:req.body.userfeedback,
  userimage:req.body.userimage


 })
 feedback=await feedback.save();
 if(!feedback){
  return  res.status(404).send('Feedback not created')

 }
 res.send(feedback)
};


exports.getfeedback = async (req, res, next) => {
  
    const feedback = await Feedback.find();
    if(!feedback) {
        res.status(500).json(err);
    }
    
    res.send(feedback)
  
};
