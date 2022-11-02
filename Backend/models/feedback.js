const mongoose = require('mongoose');
const feedbackSchema = new mongoose.Schema(
    {
      username: {
        type: String,
        require:true
      },
      userfeedback: {
        type: String,
        require:true,
        
      },
      userimage: {
        type: String,
        require:true,
        
      },
    },
    
  );
  
  const Feedback = mongoose.model('Feedback', feedbackSchema); 
  module.exports = Feedback;