let chai = require('chai');
let expect = chai.expect;
let rewire = require('rewire');
let http = require('http');

let app = require('../app');
let gmail = rewire('../controller/gmail');
let Contractor = require('../model/contractor');
let mock = require('./mocks');

gmail.__set__('googleAuth', mock.auth);

describe('sendDriveEmail', () => {
  it('should return a successful status if a message object is returned by API', (done) => {
    app.set('port', '5000');
    let server = http.createServer(app);
    server.listen('5000');

    let contractor = new Contractor("Jon", "Snow", true, "danielrearden@google.com");
    gmail.sendDriveEmail(contractor, {})
      .then((result) => {
        expect(result.status).to.equal("success");
        server.close();
      })
      .then(done, done);
  });
});

describe('sendLoginEmail', () => {
  it('should return a successful status if a message object is returned by API', (done) => {
    app.set('port', '5000');
    let server = http.createServer(app);
    server.listen('5000');

    let contractor = new Contractor("Jon", "Snow", true, "danielrearden@google.com");
    gmail.sendLoginEmail(contractor, {})
      .then((result) => {
        expect(result.status).to.equal("success");
        server.close();
      })
      .then(done, done);
  });
});