var chai = require('chai');
var expect = chai.expect;
var rewire = require('rewire');
var http = require('http');

var app = require('../app');
var slack = rewire('../helper/slack');
var Contractor = require('../model/contractor');
var mock = require('./mocks');

slack.__set__('auth', mock.auth);

describe('inviteToSlack', () => {
  it('should return a successful status if a response object is returned', (done) => {
    app.set('port', '5000');
    var server = http.createServer(app);
    server.listen('5000');

    var contractor = new Contractor("Jon", "Snow", true, "danielrearden@google.com");
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
    var server = http.createServer(app);
    server.listen('5000');

    var contractor = new Contractor("already", "invited", true, "");
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