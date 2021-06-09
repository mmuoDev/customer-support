const routes = require("express").Router();
const ticketService = require("../services/ticketService");
const commentService = require("../services/commentService");
const { handleError } = require("../helpers/errorHandler");
const {
  validate,
  verifyToken,
  checkCategoryExists,
  isCustomer,
  isAuthorized,
  isAdmin,
  checkStatusExists,
} = require("../middlewares/validators");
const httpResponse = require("../helpers/httpResponse");

//Add a ticket
routes.post(
  "/",
  checkCategoryExists,
  verifyToken,
  isCustomer,
  validate,
  async (req, res) => {
    try {
      const newTicket = await ticketService.add(
        req.body.subject,
        req.body.description,
        req.body.category,
        req.userId
      );
      httpResponse.send(res, 201, "Ticket added", newTicket);
    } catch (err) {
      handleError(err, res);
    }
  }
);

//Retrieve ticket
routes.get("/:id", verifyToken, isAuthorized, async (req, res) => {
  try {
    const ticket = await ticketService.fetchOne(req.params.id);
    httpResponse.send(res, 201, "Ticket retrieved", ticket);
  } catch (err) {
    handleError(err, res);
  }
});

//Retrieve tickets
routes.get("/", verifyToken, async (req, res) => {
  try {
    const tickets = await ticketService.fetchAll();
    httpResponse.send(res, 200, "Tickets retrieved", tickets);
  } catch (err) {
    handleError(err, res);
  }
});

//Add comments for a ticket
routes.post(
  "/:id/comments",
  verifyToken,
  isAuthorized,
  validate,
  async (req, res) => {
    try {
      const newComment = await commentService.add(
        req.body.comment,
        req.params.id,
        req.userId
      );
      httpResponse.send(res, 201, "Comment added", newComment);
    } catch (err) {
      handleError(err, res);
    }
  }
);

//Retrieve comments for a ticket
routes.get("/:id/comments", verifyToken, validate, async (req, res) => {
  try {
    const comments = await commentService.fetchAllByTicket(req.params.id);
    httpResponse.send(res, 200, "Comments retrieved!", comments);
  } catch (err) {
    handleError(err, res);
  }
});

//Resolve a ticket
routes.put(
  "/:id/resolve",
  verifyToken,
  isAdmin,
  checkStatusExists,
  async (req, res) => {
    try {
      const ticket = await ticketService.resolve(
        req.params.id,
        req.body.status
      );
      httpResponse.send(res, 204, "Ticket resolved!", ticket);
    } catch (err) {
      handleError(err, res);
    }
  }
);

//Export closed ticket
routes.get("/exports/records", verifyToken, isAdmin, async (req, res) => {
  try {
    const tickets = await ticketService.records();
    httpResponse.send(res, 200, "Tickets exported!", tickets);
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = routes;
