const mongoose = require("mongoose");

const CustomerBuyingNotification = new mongoose.Schema({
  // we will use referincing here to get product
  refOfProduct: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: [true, "Order must belong to a Product"],
  },
  refOfCustomer: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Order must belong to a Customer"],
  },
  refOfShopOwner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Order must be bought from ShopOwner"],
  },
  price: {
    type: Number,
    require: [true, "Order must have a price. "],
  },
  quantity: {
    type: Number,
    require: [true, "Order must have a quantity "],
  },
  paymentMethod: {
    type: String,
    require: [true, "Order must have a payment method "],
  },
  status: {
    type: String,
    require: [true, "Order must have a payment method "],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

CustomerBuyingNotification.pre(/^find/, function (next) {
  this.populate({
    path: "refOfProduct",
  });
  this.populate({
    path: "refOfShopOwner",
  });

  next();
});

const customerBuyingNotification = mongoose.model(
  "CustomerBuyingNotification",
  CustomerBuyingNotification
);

module.exports = customerBuyingNotification;
