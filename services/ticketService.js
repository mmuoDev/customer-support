const ticketModel = require("../models/ticket.model");
const { ErrorHandler } = require("../helpers/errorHandler");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const json2csv = require("json2csv").parse;
const fs = require("fs");
const moment = require("moment");
const path = require("path");

//add a ticket
const add = async (subject, description, category, userId) => {
  try {
    const newTicket = await ticketModel.create({
      subject: subject,
      description: description,
      category: category,
      userId: userId,
      status: "open",
    });
    return newTicket;
  } catch (err) {
    throw new ErrorHandler(
      500,
      "Unable to add ticket at this time. Please try again later."
    );
  }
};

//fetchOne fetches one ticket
const fetchOne = async (ticketId) => {
  try {
    const ticket = await ticketModel.findById(ticketId);
    return ticket;
  } catch (err) {
    throw new ErrorHandler(500, `Unable to fetch ticket with id ${ticketId}`);
  }
};

//fetchAll fetches all tickets
const fetchAll = async () => {
  try {
    const tickets = await ticketModel.find({});
    return tickets;
  } catch (err) {
    throw new ErrorHandler(500, "Unable to fetch tickets");
  }
};

//resolve allows admin update a ticket to closed or in progress
const resolve = async (ticketId, status) => {
  try {
    const ticket = await ticketModel.findByIdAndUpdate(
      ticketId,
      { status: status },
      { useFindAndModify: false }
    );
    return ticket;
  } catch (err) {
    throw new ErrorHandler(500, "Unable to resolve ticket");
  }
};

const records = async () => {
  try {
    var d = new Date();
    d.setMonth(d.getMonth() - 1); //1 month ago
    const tickets = await ticketModel.find({
      updatedAt: { $gte: d },
      status: "closed",
    });
    let csv;
    const fields = ["subject", "description"];
    csv = json2csv(tickets, { fields });
    const dateTime = moment().format("YYYYMMDDhhmmss");
    const filePath = path.join(
      __dirname,
      "..",
      "public",
      "exports",
      "csv-" + dateTime + ".csv"
    );
    fs.writeFile(filePath, csv, function (err) {
      if (err) {
        throw new ErrorHandler(500, "Unable to write to file");
      }
    });
    //return tickets
  } catch (err) {
    console.log("err", err);
    throw new ErrorHandler(500, "Unable to export records");
  }
};

module.exports = {
  add,
  fetchOne,
  fetchAll,
  resolve,
  records,
};
