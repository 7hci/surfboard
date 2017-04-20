var chai = require('chai');
var expect = chai.expect;
var rewire = require('rewire');
var http = require('http');

var app = require('../app');
var clicktime = require('../helper/clicktime');
var Contractor = require('../model/contractor');

describe('addUserToClickTime', () => {
  it('should return a successful status if a response object is returned', (done) => {
    app.set('port', '5000');
    var server = http.createServer(app);
    server.listen('5000');

    var contractor = new Contractor("Jon", "Snow", true, "danielrearden@google.com");
    clicktime.addUserToClickTime(contractor)
      .then((result) => {
        expect(result.status).to.equal("success");
      })
      .then(() => {
          server.close(done);
        }
      )
      .catch(done, done);
  });
});