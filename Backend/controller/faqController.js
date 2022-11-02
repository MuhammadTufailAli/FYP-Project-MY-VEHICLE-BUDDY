const { response } = require("express");
const FAQs = require("../models/faqs");

exports.addfaq = async (req, res) => {
  let faq = new FAQs({
    Question: req.body.Question,
    Answer: req.body.Answer,
  });
  faq = await faq.save();
  if (!faq) {
    return res.status(404).send("FAQ not created");
  }
  res.send(faq);
};

exports.getfaq = async (req, res, next) => {
  const faq = await FAQs.find();
  if (!faq) {
    res.status(500).json(err);
  }

  res.send(faq);
};
