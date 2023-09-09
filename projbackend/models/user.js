const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },

    lastName: {
      type: String,
      maxlength: 20,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    userinfo: {
      type: String,
      trim: true,
    },

    // TODO:come back here

    encry_password: {
      type: String,
      required: true,
    },

    salt: String,
    role: {
      type: Number,
      default: 0,
    },

    purchases: {
      type: Array,
      default: [],
    },
  },
  { timeStamps: true }
);

// virtual Fields
userSchema
  .virtual("password")
  .set(function (password) {
    // Storing the password in the secret variable defined with _varname
    this._password = password;
    this.salt = uuidv4();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

// hashing the password
userSchema.methods = {
  authenticate: function (plainPassword) {
    return this.securePassword(plainPassword) === this.encry_password;
  },
  securePassword: function (plainPassword) {
    if (!plainPassword) return "";
    try {
      return createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
};
module.exports = mongoose.model("User", userSchema);
