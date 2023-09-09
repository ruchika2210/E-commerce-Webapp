const User = require("../models/user");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { expressjwt } = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);

  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "Not able to save the user in the database",
      });
    }

    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);

  const { email, encry_password } = req.body;

  if (!errors.isEmpty()) {
    res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // if (!user.authenticate(encry_password)) {
    //   return res.status(401).json({
    //     error: "Email and password do not match",
    //   });
    // }

    // create the token
    const authToken = jwt.sign({ _id: user._id }, process.env.SECRET);
    // put token in the cookie

    res.cookie("token", authToken, { expire: new Date() + 9999 });

    // send response to the front end
    const { _id, email, name, role } = user;
    return res.json({
      authToken,
      user: { _id, name, email, role },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User sign out succesfully",
  });
};

// protected routes

exports.isSignedIn = expressjwt({
  secret: process.env.SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

// custom middleware

// 1.isAuthenticated
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "Access denied",
    });
  }
  next();
};

// 2/isAdmin
exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    res.status(403).json({
      error: "you are not admin, access denied",
    });
  }
  next();
};
