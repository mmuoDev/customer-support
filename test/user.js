process.env.NODE_ENV = 'test';

const server = require("../app");
const chai = require("chai")
const chaiHttp = require("chai-http")
const User = require('../models/user.model')
var bcrypt = require("bcryptjs");

//Assert
chai.should();
chai.use(chaiHttp);

describe("Users", () => {
    beforeEach((done) => { //Before each test we empty the database
        User.deleteMany({}, (err) => {
           done();
        });
    });

    describe("/POST", () => {
        it("It should add a user", (done) => {
            let user = {
                email: "test@gmail.com",
                password: "password",
                role: "admin"
            }
            chai.request(server)
            .post("/api/signup")
            .send(user)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a("object");
                res.body.should.have.property("status").eql(true);
            done();
          });

        })
    })

    describe("/POST", () => {
        it("It should allow Users login", (done) => {
            //add a test user
            let user = {
                email: "test@gmail.com",
                password: bcrypt.hashSync("password"),
                role: "admin"
            }
            User.create(user);

            let auth = {
                email: "test@gmail.com",
                password: "password",
            }
            chai.request(server)
            .post("/api/login")
            .send(auth)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property("status").eql(true);
            done();
            
          });

        })
    })
});