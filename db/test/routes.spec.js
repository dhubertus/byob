process.env.NODE_ENV = 'test';
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server.js');
const knex = require('../db/knex.js');

chai.use(chaiHttp);

describe('Client Routes', () => {

  it('should return 404 for route that doesnt exist', (done) => {
    chai.request(server)
    .get('/sad')
    .end((err, res) => {
      res.should.have.status(404);
      done();
    });
  });

  it('should return 200 when it hits /api/v1/odds', (done) => {
    chai.request(server)
    .get('/api/v1/odds')
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.html;
      done();
    });
  });

  it('should return 200 when it hits /api/v1/questions/:singleQuestion', (done) => {
    chai.request(server)
    .get('/api/v1/questions/:singleQuestion')
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.html;
      done();
    });
  });


});
