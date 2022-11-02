const { response } = require("express");
const UserReview = require("../models/userreview");

exports.adduserreview = async (req, res) => {
  let userreview = new UserReview({
    UserName: req.body.UserName,
    UserImage: req.body.UserImage,
    UserReview: req.body.UserReview,
    UserRating: req.body.UserRating,
  });
  userreview = await userreview.save();
  if (!userreview) {
    return res.status(404).send("Review not created");
  }
  res.send(userreview);
};

exports.getusereview = async (req, res, next) => {
  const userreview = await UserReview.find();
  if (!userreview) {
    res.status(500).json(err);
  }

  res.send(userreview);
};
