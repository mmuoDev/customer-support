const routes = require("express").Router();
const userService = require("../services/userService");
const { handleError } = require("../helpers/errorHandler");
const {
  validate,
  checkDuplicateEmail,
  checkRoleExists,
} = require("../middlewares/validators");
const httpResponse = require("../helpers/httpResponse");

routes.post(
  "/signup",
  checkDuplicateEmail,
  checkRoleExists,
  validate,
  async (req, res) => {
    try {
      const newUser = await userService.signup(
        req.body.email,
        req.body.password,
        req.body.role
      );
      httpResponse.send(res, 201, "User created", newUser);
    } catch (err) {
      handleError(err, res);
    }
  }
);

routes.post("/login", async (req, res) => {
  try {
    const { code, message, user } = await userService.login(
      req.body.email,
      req.body.password
    );
    httpResponse.send(res, code, message, { user });
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = routes;
