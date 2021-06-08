const userModel = require("../models/user.model");
const { ErrorHandler } = require("../helpers/errorHandler");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");


  //signups a user
  const signup = async (email, password, role) => {
    try {
      const newUser = await userModel.create({
        email: email,
        password: bcrypt.hashSync(password),
        role: role,
      });
      return newUser
    } catch (err) {
      throw new ErrorHandler(
        500,
        "Unable to register user at this time. Please try again later."
      );
    }
  }

  //logins a user
  const login = async (email, password) => {
    try {
      const user = await userModel.findOne({
        email: email,
      });

      if (!user) return { code: 404, message: "User not found!" };

      let checkPassword = bcrypt.compareSync(password, user.password);

      if (!checkPassword) return { code: 401, message: "Invalid Password" };

      let token = jwt.sign({ id: user.id, role: user.role }, process.env.API_SECRET, {
        expiresIn: 86400, // 24 hours
      });

      const payload = {
        id: user.id,
        email: user.email,
        roles: user.role,
        accessToken: token,
      };

      return { code: 200, message: "Logged in", user: payload };
    } catch (err) {
      throw new ErrorHandler(
        500,
        "Unable to login user at this time, try again later" + err
      );
    }
  }

  module.exports = {
    login,
    signup
}
