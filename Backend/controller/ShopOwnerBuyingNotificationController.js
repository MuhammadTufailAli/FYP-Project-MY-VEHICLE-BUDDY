const ShopOwnerBuyingNotification = require("./../models/ShopOwnerBuyingNotification");
const factory = require("./handlerFactory");

exports.postNotification = factory.createOne(ShopOwnerBuyingNotification);

exports.deleteNotification = factory.deleteOne(ShopOwnerBuyingNotification);
exports.getNotification = async (req, res, next) => {
  try {
    const Notification = await ShopOwnerBuyingNotification.find({
      refOfShopOwner: req.params.id,
    }).populate({ path: "Product", path: "User" });
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

exports.updateNotification = async (req, res, next) => {
  try {
    const Notification = await ShopOwnerBuyingNotification.updateOne(
      {
        refOfCustomerNotification: req.params.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: Notification,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
