const mongoose = require("mongoose");

const TicketSchema = mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, "Please provide a subject"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    category: {
      type: String,
      required: [true, "Please provide a ticket category"],
    },
    userId: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", TicketSchema);
