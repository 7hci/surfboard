var chai = require('chai');
var expect = chai.expect;
var rewire = require('rewire');
var http = require('http');

var app = require('../app');
var domain = rewire('../helper/domain');
var Contractor = require('../model/contractor');
var mock = require('./mocks');

domain.__set__('auth', mock.auth);

describe('createContractorEmail', () => {
  it('should return a successful status if a user object is returned', (done) => {
    app.set('port', '5000');
    var server = http.createServer(app);
    server.listen('5000');

    var contractor = new Contractor("Jon", "Snow", true, "danielrearden@google.com");
    domain.createContractorEmail(contractor)
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