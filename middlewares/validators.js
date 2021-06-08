const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const ticketModel = require("../models/ticket.model");

const roles = ["customer", "agent", "admin"];
const categories = ["technical", "help"];
const statuses = ["closed", "in progress"];
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
  //checkRoleExists checks if a user role exists
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
  //checkCategoryExists checks a ticket category exists
  checkCategoryExists: (req, res, next) => {
    if (req.body.category) {
      let cat = req.body.category;
      categories.forEach((value, index) => {
         if (cat == value.toLowerCase()) {
          return next();
        }
      });
     
    } else {
      return res.status(400).json({ status: "error", message: "category does not exist" });
    }
  },
  //checkStatusExists checks a status exists
  checkStatusExists: (req, res, next) => {
    if (req.body.status) {
      let status = req.body.status;
      statuses.forEach((value, index) => {
         if (status == value.toLowerCase()) {
          return next();
        }
      });
     
    } else {
      return res.status(400).json({ status: "error", message: "status does not exist" });
    }
  },
  //verifyToken checks the authenticity of a JWT
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
      req.role = decoded.role
      next()
    });
  },
  //isAdmin checks if a user is an admin
  isAdmin: (req, res, next) => {
    if (req.role != "admin") {
      return res.status(403).send({
        status: "error",
        message: "Require Admin Role!",
      });
    }
    return next();
  },
  //isAuthorized checks if user is authorized to read, update or delete a ticket
  isAuthorized: (req, res, next) => {
    ticketModel
      .findById(req.params.id)
      .then((ticket) => {
        if (!ticket) {
          return res
            .status(400)
            .json({ status: "error", message: "Ticket does not exists" });
        }
        createdBy = ticket.userId
        userId = req.userId
        role = req.role
        if (createdBy == userId || role == "admin") {
          return next();
        }else{
          res.status(401).send({
            status: "error",
            message: "Unauthorized!",
          });
        }
        
      });
  },

  //isCustomer checks if a user is a customer
  isCustomer: (req, res, next) => {
    if (req.role != "customer") {
      res.status(403).send({
        status: "error",
        message: "Require Customer Role!",
      });
      return;
    }
   
    return next();
  },
};
