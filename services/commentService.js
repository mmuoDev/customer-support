const commentModel = require("../models/comment.model");
const { ErrorHandler } = require("../helpers/errorHandler");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");


  //add a comment for a ticket
  const add = async (comment, ticketId, userId) => {
    try {
      const newComment = await commentModel.create({
        comment: comment,
        ticketId: ticketId,
        userId: userId
      });
      return newComment
    } catch (err) {
      throw new ErrorHandler(
        500,
        "Unable to add comment at this time. Please try again later."
      );
    }
  }

  //fetchAllByTicket fetches all comments for a ticket
  const fetchAllByTicket = async (ticketId) => {
    try{
        const tickets = await commentModel.find(
            {
                "ticketId": ticketId
            }
        )
        return tickets
      }catch (err) {
        throw new ErrorHandler(
          500,
          `Unable to fetch comments for ticket ${ticketId}` 
        );
      }
  }


  module.exports = {
    add,
    fetchAllByTicket
 }