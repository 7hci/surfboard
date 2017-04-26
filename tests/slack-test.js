const chai = require('chai');
const http = require('http');
const app = require('../app');
const slack = require('../controller/slack');
const Contractor = require('../model/contractor');

const expect = chai.expect;

describe('inviteToSlack', () => {
  it('should return a successful status if a response object is returned', (done) => {
    app.set('port', '5000');
    const server = http.createServer(app);
    server.listen('5000');

    const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
    slack.inviteToSlack(contractor)
      .then((result) => {
        expect(result.status).to.equal('success');
      })
      .then(() => {
        server.close(done);
      }
      );
  });

  it('should return a failure status if the API response is ok: false (already invited contractor)', (done) => {
    app.set('port', '5000');
    const server = http.createServer(app);
    server.listen('5000');

    const contractor = new Contractor('already', 'invited', true, '');
    slack.inviteToSlack(contractor)
      .then((result) => {
        expect(result.status).to.equal('failure');
      })
      .then(() => {
        server.close(done);
      }
      );
  });
});
