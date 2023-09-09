const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 40,
      unique: true,
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
