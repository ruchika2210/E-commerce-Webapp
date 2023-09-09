const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ProductCartSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: "Product",
  },

  name: String,
  count: Number,
  price: Number,
});

const ProductCart = mongoose.model("ProductCart", ProductCartSchema);

const orderSchema = new mongoose.Schema(
  {
    // products in the cart
    products: [ProductCartSchema],
    transactionId: {},
    amount: { type: Number },
    address: String,
    status: {
      type: String,
      default: "Recieved",
      enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"],
    },
    updated: Date,
    user: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timeStamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, ProductCart };
