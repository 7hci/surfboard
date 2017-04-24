var chai = require('chai');
var expect = chai.expect;
var rewire = require('rewire');
var http = require('http');

var app = require('../app');
var gmail = rewire('../helper/gmail');
var Contractor = require('../model/contractor');
var mock = require('./mocks');

gmail.__set__('auth', mock.auth);

describe('sendDriveEmail', () => {
  it('should return a successful status if a message object is returned by API', (done) => {
    app.set('port', '5000');
    var server = http.createServer(app);
    server.listen('5000');

    var contractor = new Contractor("Jon", "Snow", true, "danielrearden@google.com");
    gmail.sendDriveEmail(contractor, {})
      .then((result) => {
        expect(result.status).to.equal("success");
        server.close();
      })
      .then(() => {
          done();
        }
      )
  });
});