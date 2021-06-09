process.env.NODE_ENV = "test";

const server = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const User = require("../models/user.model");
const Ticket = require("../models/ticket.model");

//Assert
chai.should();
chai.use(chaiHttp);

describe("Tickets", () => {
  beforeEach((done) => {
    //Before each test we empty the database
    Ticket.deleteMany({}, (err) => {
      done();
    });
  });

  describe("/POST", () => {
    it("It should allow ONLY customer add a ticket", (done) => {
      let ticket = {
        subject: "double charge",
        description: "double charge",
        category: "technical",
      };
      chai
        .request(server)
        .post("/api/tickets")
        .set("x-access-token", process.env.JWT_TEST_CUSTOMER)
        .send(ticket)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql(true);
          done();
        });
    });
  });

  describe("/POST", () => {
    it("It should NOT allow admin add a ticket", (done) => {
      let ticket = {
        subject: "double charge",
        description: "double charge",
        category: "technical",
      };
      chai
        .request(server)
        .post("/api/tickets")
        .set("x-access-token", process.env.JWT_TEST_ADMIN)
        .send(ticket)
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
  });

  describe("/POST/:id/comments", () => {
    it("It should allow authorized user make a comment on a ticket", (done) => {
      let ticket = {
        subject: "double charge",
        description: "double charge",
        category: "technical",
        userId: "12345",
      };

      var newTicket = new Ticket(ticket);
      newTicket.save((err) => {
        ticketId = newTicket._id;
        let comment = {
          comment: "thank you for resolving",
          ticketId: ticketId,
          userId: "12345",
        };
        chai
          .request(server)
          .post("/api/tickets/" + ticketId + "/comments")
          .set("x-access-token", process.env.JWT_TEST_ADMIN)
          .send(comment)
          .end((err, res) => {
            res.should.have.status(201);
            done();
          });
      });
    });
  });

  describe("/GET", () => {
    it("It should fetch all tickets", (done) => {
      chai
        .request(server)
        .get("/api/tickets")
        .set("x-access-token", process.env.JWT_TEST_ADMIN)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("status").eql(true);
          done();
        });
    });
  });

  describe("/GET/:id/comments", () => {
    it("It should fetch all comments for a ticket", (done) => {
      let ticket = {
        subject: "double charge",
        description: "double charge",
        category: "technical",
      };

      var newTicket = new Ticket(ticket);
      newTicket.save((err) => {
        ticketId = newTicket._id;
        let comment = {
          comment: "thank you for resolving",
         
        };
        chai
          .request(server)
          .get("/api/tickets/" + ticketId + "/comments")
          .set("x-access-token", process.env.JWT_TEST_ADMIN)
          .send(comment)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("status").eql(true);
            done();
          });
      });
    });
  });

  describe("/PUT/:id/resolve", () => {
    it("It should allow ADMIN resolve a ticket to either closed or in progress", (done) => {
      let resolve = {
        status: "in progress",
      };
      let ticket = {
        subject: "double charge",
        description: "double charge",
        category: "technical",
        userId: "12345",
      };

      var newTicket = new Ticket(ticket);
      newTicket.save((err) => {
        ticketId = newTicket._id;
        chai
          .request(server)
          .put("/api/tickets/" + ticketId + "/resolve")
          .set("x-access-token", process.env.JWT_TEST_ADMIN)
          .send(resolve)
          .end((err, res) => {
            res.should.have.status(204);
            done();
          });
      });
    });
  });

  describe("/GET/exports/records", () => {
    it("It should allow ADMIN export all closed tickets in the last one month", (done) => {
      let ticket = {
        subject: "double charge",
        description: "double charge",
        category: "technical",
      };
      Ticket.create(ticket);
      chai
        .request(server)
        .get("/api/tickets/exports/records")
        .set("x-access-token", process.env.JWT_TEST_ADMIN)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
