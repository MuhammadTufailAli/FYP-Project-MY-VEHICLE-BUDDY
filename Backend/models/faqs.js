const mongoose = require("mongoose");
const faqSchema = new mongoose.Schema({
  Question: {
    type: String,
    require: true,
  },
  Answer: {
    type: String,
    require: true,
  },
});

const FAQs = mongoose.model("FAQs", faqSchema);
module.exports = FAQs;
