const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.model");

const roles = ["customer", "agent", "admin"];
const jwt = require("jsonwebtoken");

module.exports = {
  validate: (req, res, next) => {
    const raw_errors = validationResult(req);

    if (raw_errors.isEmpty()) {
      return next();
    }
    const errors = raw_errors.errors.map((err) => ({ message: err.msg }));

    return res.status(422).json({ status: "error", errors });
  },
  //checkDuplicateEmail checks for duplicate emails
  checkDuplicateEmail: (req, res, next) => {
    userModel
      .findOne({
        email: req.body.email,
      })
      .then((user) => {
        if (user) {
          res
            .status(400)
            .json({ status: "error", message: "Email already exists" });
          return;
        }
        next();
      });
  },
  checkRoleExists: (req, res, next) => {
    if (req.body.role) {
      let role = req.body.role;
      roles.forEach((value, index) => {
        if (role == value.toLowerCase()) {
          return next();
        }
      });
     
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "role does not exist" });
    }
  },
  verifyToken: (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
      res.status(403).send({
        status: "error",
        message: "No token provided!",
      });
      return;
    }
    jwt.verify(token, process.env.API_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          status: "error",
          message: "User is unauthorized!",
        });
      }
      req.userId = decoded.id;
      next();
    });
  },
  isAdmin: (req, res, next) => {
    userModel.findById(req.userId).then((user) => {
      if (user.role != "admin") {
        res.status(403).send({
          status: "error",
          message: "Require Admin Role!",
        });
        return;
      }
    });
  },
};
