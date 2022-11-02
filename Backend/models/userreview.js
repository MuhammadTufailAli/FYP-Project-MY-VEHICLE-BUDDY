const mongoose = require("mongoose");
const userreviewSchema = new mongoose.Schema({
  UserImage: {
    type: String,
    require: true,
  },
  UserName: {
    type: String,
    require: true,
  },
  UserReview: {
    type: String,
    require: true,
  },
  UserRating: {
    type: Number,
    require: true,
  },
});

const UserReviews = mongoose.model("UserReviews", userreviewSchema);
module.exports = UserReviews;
