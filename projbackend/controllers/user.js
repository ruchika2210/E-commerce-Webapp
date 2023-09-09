const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user was found in the db",
      });
    }

    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  // todo :get back here for password
  req.profile.salt = "";
  req.profile.encry_password = "";

  return res.json(req.profile);
};

// exports.getAllUsers = (req, res) => {
//   User.find().exec((err, users) => {
//     if (err || !users) {
//       return res.status(400).json({
//         error: "No users",
//       });
//     }
//     res.json(users);
//   });
// };

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, updatedUser) => {
      if (err || !updatedUser) {
        return res
          .status(400)
          .json({ error: "You are not authorised to update this user info" });
      }

      updatedUser.salt = "";
      updatedUser.encry_password = "";
      res.json(updatedUser);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No order in this account",
        });
      }

      res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  const purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  // store in the db
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save purchase list",
        });
      }
      next();
    }
  );
};
