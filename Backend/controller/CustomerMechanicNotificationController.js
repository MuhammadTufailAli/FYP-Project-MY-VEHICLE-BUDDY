const CustomerMechanicNotification = require("./../models/CustomerMechanicNotification");
const factory = require("./handlerFactory");

exports.postNotification = factory.createOne(CustomerMechanicNotification);

exports.updateNotification = factory.updateOne(CustomerMechanicNotification);

exports.deleteNotification = factory.deleteOne(CustomerMechanicNotification);

exports.getNotification = async (req, res, next) => {
  try {
    const Notification = await CustomerMechanicNotification.find().populate({
      path: "User",
    });
    res.status(200).json({
      status: "success",
      result: Notification.length,
      data: Notification,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
