//================Security-Start=====================

//import bcrypt to ash the password
const bcrypt = require("bcrypt");
//json token for the auth verification
const jwt = require("jsonwebtoken");
//hiding the key for the jwt in the env variable
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
//================Security-End=====================

//import the user model
const User = require("../models/User");

//================Auth middlewares=================
exports.signup = (req, res, next) => {
  //hashing the passeword (with bcrypt it's slow and already SALTED so it's A tier secure !)
  bcrypt
    .hash(req.body.password, 15)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() =>
          res.status(201).json({ message: "New Sauce-Addict created!" })
        )
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) =>
      res.status(500).json({
        error,
      })
    );
};

//login user
exports.login = (req, res, next) => {
  //find the user
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error,
        });
      }
      //if the user exists compare password hashes
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error,
            });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, `${process.env.JWT_KEY}`, {
              expiresIn: "2h",
            }),
          });
        })
        .catch((error) =>
          res.status(500).json({
            error,
          })
        );
    })
    .catch((error) =>
      res.status(500).json({
        error,
      })
    );
};
//================End Auth========================
