process.env.NODE_ENV = "test";
const chai = require("chai");
const should = chai.should();
const chaiHttp = require("chai-http");
const server = require("../server.js");
const knex = require("../db/knex.js");

chai.use(chaiHttp);

describe("API Routes", () => {


  before((done) => {
    knex.migrate.rollback()
    .then(() => {
      knex.migrate.latest()
      .then(() => {
        knex.seed.run();
      })
      .then(() => {
        done();
      });
    });
  });

  it("should return 404 for route that doesnt exist", (done) => {
    chai.request(server)
    .get("/sad")
    .end((err, res) => {
      res.should.have.status(404);
      done();
    });
  });

  it("should return 200 when it hits /api/v1/questions", (done) => {
    chai.request(server)
    .get("/api/v1/questions")
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json;
      done();
    });
  });

  it("should return 200 when it hits /api/v1/odds", (done) => {
    chai.request(server)
    .get("/api/v1/odds")
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json;
      done();
    });
  });

  it("should return 200 when it hits /api/v1/odds/:singleSetOdds", (done) => {
    chai.request(server)
    .get("/api/v1/odds/907 N.Y. Mets")
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json;
      done();
    });
  });

  it("should return 404 when it hits /api/v1/odds/:singleSetOdds and the odds do not exist", (done) => {
    chai.request(server)
    .get("/api/v1/odds/900 BLAH BLAH")
    .end((err, res) => {
      res.should.have.status(404);
      res.should.be.json;
      done();
    });
  });

  it("should return 200 when it hits /api/v1/questions/:singleQuestionId", (done) => {
    chai.request(server)
    .get("/api/v1/questions/3")
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json;
      done();
    });
  });

  it("should return 404 when it hits /api/v1/questions/:singleQuestionId and the question does not exist", (done) => {
    chai.request(server)
    .get("/api/v1/questions/1000")
    .end((err, res) => {
      res.should.have.status(404);
      res.should.be.json;
      done();
    });
  });

  it("should return success message when it hits /api/v1/authenticate with proper body", (done) => {
    chai.request(server)
    .post("/api/v1/authenticate")
    .send({
      username: "guy",
      password: "fieri"
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json;
      res.body.success.should.equal(true);
      res.body.username.should.equal("guy");
      res.body.token.length.should.equal(176);
      done();
    });
  });

  it("should return 403 when it hits /api/v1/authenticate without proper body", (done) => {
    chai.request(server)
    .post("/api/v1/authenticate")
    .send({
      username: "abe",
      password: "lincoln"
    })
    .end((err, res) => {
      res.should.have.status(403);
      res.should.be.json;
      res.body.success.should.equal(false);
      res.body.message.should.equal("Invalid Credentials");
      done();
    });
  });

  it("should return 200 when it posts to /api/v1/questions with proper body", (done) => {
    chai.request(server)
    .post("/api/v1/questions")
    .send({
      "question": "Who will WIN this matchup?",
      "starttime": "7:00pm",
      "sport": "MLB",
      "status": "In Progress",
      "optionOne": "950 Yankees",
      "optionTwo": "951 Red Sox",
      "oppOne": "40%",
      "oppTwo": "60%",
      "token": process.env.TOKEN
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json;
      done();
    });
  });

  it("should return 422 when it posts to /api/v1/questions without proper body", (done) => {
    chai.request(server)
    .post("/api/v1/questions")
    .send({
      "qasdfjaksdfj": "Who will WIN this matchup?",
      "token": process.env.TOKEN
    })
    .end((err, res) => {
      res.should.have.status(422);
      res.should.be.json;
      done();
    });
  });

  it("should return error when it hits /api/v1/questions with proper body but no authentication", (done) => {
    chai.request(server)
    .post("/api/v1/questions")
    .send({
      "question": "Who will WIN this matchup?",
      "starttime": "7:00pm",
      "sport": "MLB",
      "status": "In Progress",
      "optionOne": "950 Yankees",
      "optionTwo": "951 Red Sox",
      "oppOne": "40%",
      "oppTwo": "60%",
      "token": "FAKE TOKEN"
    })
    .end((err, res) => {
      res.should.have.status(403);
      res.should.be.json;
      done();
    });
  });

  it("should insert new question when it hits /api/v1/question with proper body and authentication", (done) => {
    chai.request(server)
    .post("/api/v1/questions")
    .send({
      "question": "Who will WIN this matchup?",
      "starttime": "7:00pm",
      "sport": "MLB",
      "status": "In Progress",
      "optionOne": "950 Yankees",
      "optionTwo": "951 Red Sox",
      "oppOne": "40%",
      "oppTwo": "60%",
      "token": process.env.TOKEN
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.res.body.command.should.equal("INSERT");
      res.should.be.json;
      done();
    });
  });

  it("should not make a selection when it hits /api/v1/selection with proper body but improper authentication", (done) => {
    chai.request(server)
    .patch("/api/v1/selection?selection=New York Liberty (8-8)")
    .send({
      "token": "FAKE TOKEN"
    })
    .end((err, res) => {
      res.should.have.status(403);
      res.body.message.should.equal("Invalid authorization token.");
      res.should.be.json;
      done();
    });
  });

  it("should make a selection when it hits /api/v1/selection with proper body and proper authentication", (done) => {
    chai.request(server)
    .patch("/api/v1/selection?selection=New York Liberty (8-8)")
    .send({
      "token": process.env.TOKEN
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.equal(1);
      res.should.be.json;
      done();
    });
  });

  it("should not remove a selection when it hits /api/v1/removeSelection with proper body and improper authentication", (done) => {
    chai.request(server)
    .patch("/api/v1/removeSelection")
    .send({
      token: "FAKE TOKEN"
    })
    .end((err, res) => {
      res.body.message.should.equal("Invalid authorization token.");
      res.should.have.status(403);
      res.should.be.json;
      done();
    });
  });

  it("should remove a matched selection when it hits /api/v1/removeSelection with proper body and proper authentication", (done) => {
    chai.request(server)
    .patch("/api/v1/removeSelection")
    .send({
      "token": process.env.TOKEN
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.equal(1);
      res.should.be.json;
      done();
    });
  });

  it("should not remove an unmatched selection when it hits /api/v1/removeSelection with proper body and proper authentication", (done) => {
    chai.request(server)
    .patch("/api/v1/removeSelection")
    .send({
      "token": process.env.TOKEN
    })
    .end((err, res) => {
      res.should.have.status(422);
      res.body.error.should.equal("There were no selected bets to overwrite to false! A bet must be selected in order to remove a selection!");
      res.should.be.json;
      done();
    });
  });
});


describe("delete Routes", () => {

    var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imd1eSIsInBhc3N3b3JkIjoiZmllcmkiLCJpYXQiOjE0OTk5NzU3MTQsImV4cCI6MTUwMTE4NTcxNH0.eyUx3Sf0cKv7I48fyektD3sZdMkyGdLaZ1J30IE7zTY";

  it("should not delete games that have ended if not authorized", (done) => {
    chai.request(server)
    .delete("/api/v1/deleteFinal")
    .send({
      token: "FAKE TOKEN"
    })
    .end((err, res) => {
      res.should.have.status(403);
      res.should.be.json;
      done();
    });
  });

  it("should delete games that have ended if authorized", (done) => {
    chai.request(server)
    .delete("/api/v1/deleteFinal")
    .send({
      token
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.above(0);
      res.should.be.json;
      done();
    });
  });

  it("should return error if there are no games to delete", (done) => {

    chai.request(server)
    .delete("/api/v1/deleteFinal")
    .send({
      "token": process.env.TOKEN
    })
    .end((err, res) => {
      setTimeout(()=> {
        return;
      }, 3000);
      res.should.have.status(404);
      res.body.error.should.equal("There were no final results to delete!");
      res.should.be.json;
      done();
    });
  });

  it("should not delete odds if unauthorized", (done) => {
    chai.request(server)
    .delete("/api/v1/deleteAllOdds")
    .send({
      token: "FAKE TOKEN"
    })
    .end((err, res) => {
      res.should.have.status(403);
      res.should.be.json;
      done();
    });
  });

  it("should delete odds if authorized", (done) => {
    chai.request(server)
    .delete("/api/v1/deleteAllOdds")
    .send({
      "token": process.env.TOKEN
    })
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.above(0);
      res.should.be.json;
      done();
    });
  });

  it("should return error if there are no odds to delete", (done) => {
    chai.request(server)
    .delete("/api/v1/deleteAllOdds")
    .send({
      "token": process.env.TOKEN
    })
    .end((err, res) => {
      res.should.have.status(404);
      res.body.error.should.equal("There were no odds to delete!");
      res.should.be.json;
      done();
    });
  });
});
