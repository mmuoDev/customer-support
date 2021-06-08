const ticketModel = require("../models/ticket.model");
const { ErrorHandler } = require("../helpers/errorHandler");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");


  //add a ticket
  const add = async (subject, description, category, userId) => {
    try {
      const newTicket = await ticketModel.create({
        subject: subject,
        description: description,
        category: category,
        userId: userId,
        status: "open"
      });
      return newTicket
    } catch (err) {
      throw new ErrorHandler(
        500,
        "Unable to add ticket at this time. Please try again later."
      );
    }
  }

  //fetchOne fetches one ticket
  const fetchOne = async (ticketId) => {
      try{
        const ticket = await ticketModel.findById(ticketId)
        return ticket
      }catch (err) {
        throw new ErrorHandler(
          500,
          `Unable to fetch ticket with id ${ticketId}`
        );
      }
     
  }

  //fetchAll fetches all tickets
  const fetchAll = async () => {
    try{
        const tickets = await ticketModel.find({})
        return tickets
      }catch (err) {
        throw new ErrorHandler(
          500,
          "Unable to fetch tickets"
        );
      }
  }

  //resolve allows admin update a ticket to closed or in progress
  const resolve = async (ticketId, status) => {
    try{
      const ticket = await ticketModel.findByIdAndUpdate(ticketId, 
        {status: status},
        { useFindAndModify: false }
      )
      return ticket
    }catch (err) {
      throw new ErrorHandler(
        500,
        "Unable to resolve ticket"
      );
    }
  }

  const records = async () => {
    try{
      var d = new Date();
      d.setMonth(d.getMonth() - 1); //1 month ago
      const tickets = await ticketModel.find(
        {
          "updatedAt":{$gte:d}, "status": "closed"
        }
      )
      data = await tickets.toArray()
      const json2csvParser = new Json2csvParser({ header: true });
const csvData = json2csvParser.parse(data);

fs.writeFile("bezkoder_mongodb_fs.csv", csvData, function(error) {
  if (error) throw error;
  console.log("Write to bezkoder_mongodb_fs.csv successfully!");
});
      return tickets
    }catch (err) {
      console.log("err", err)
      throw new ErrorHandler(
        500,
        "Unable to export records"
      );
    }
  }

  
  module.exports = {
   add,
   fetchOne,
   fetchAll,
   resolve,
   records
}
