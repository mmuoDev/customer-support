const express = require("express");
const app = express();
let mongoose = require("mongoose");
require("dotenv").config();
const apiRoutes = require("./routes");
const { handleError, ErrorHandler } = require("./helpers/errorHandler");

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Customer Servcie API!!" });
});

app.use("/api", apiRoutes);

// catch 404 routes
app.use((req, res, next) => {
  throw new ErrorHandler(404, "Route not found!");
});

app.use((err, req, res, next) => {
  handleError(err, res);
});

//mongo
const options = { useNewUrlParser: true, useUnifiedTopology: true };
let mongoURL = process.env.MONGO_URL
if (process.env.NODE_ENV == "test") {
  mongoURL = process.env.MONGO_TEST_URL
}
const mongo = mongoose.connect(mongoURL, options);

mongo.then(
  () => {
    console.log("connected");
  },
  (error) => {
    console.error(error);
  }
);
var db = mongoose.connection;

//Check DB Connection
if (!db) console.log("Error connecting db");
else console.log("DB Connected Successfully");

app.set("port", process.env.PORT || 9000);

app.listen(app.get("port"), () => {
  console.log("App listening on port " + process.env.PORT);
});

module.exports = app
