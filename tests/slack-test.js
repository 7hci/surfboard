let chai = require('chai');
let expect = chai.expect;
let rewire = require('rewire');
let http = require('http');

let app = require('../app');
let slack = require('../controller/slack');
let Contractor = require('../model/contractor');

describe('inviteToSlack', () => {
  it('should return a successful status if a response object is returned', (done) => {
    app.set('port', '5000');
    let server = http.createServer(app);
    server.listen('5000');

    let contractor = new Contractor("Jon", "Snow", true, "danielrearden@google.com");
    slack.inviteToSlack(contractor)
      .then((result) => {
        expect(result.status).to.equal("success");
      })
      .then(() => {
          server.close(done);
        }
      );
  });
});

describe('inviteToSlack', () => {
  it('should return a failure status if the API response is ok: false (already invited contractor)', (done) => {
    app.set('port', '5000');
    let server = http.createServer(app);
    server.listen('5000');

    let contractor = new Contractor("already", "invited", true, "");
    slack.inviteToSlack(contractor)
      .then((result) => {
        expect(result.status).to.equal("failure");
      })
      .then(() => {
          server.close(done);
        }
      );
  });
});