const chai = require('chai');
const proxyquire = require('proxyquire');
const http = require('http');
const app = require('../app');
const Contractor = require('../model/contractor');
const mock = require('./mocks');

const gmail = proxyquire('../controller/gmail', { './google-auth': mock.auth });

const expect = chai.expect;

describe('sendDriveEmail', () => {
  it('should return a successful status if a message object is returned by API', (done) => {
    app.set('port', '5000');
    const server = http.createServer(app);
    server.listen('5000');

    const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
    gmail.sendDriveEmail(contractor, {})
      .then((result) => {
        expect(result.status).to.equal('success');
        server.close();
      })
      .then(done, done);
  });
});

describe('sendLoginEmail', () => {
  it('should return a successful status if a message object is returned by API', (done) => {
    app.set('port', '5000');
    const server = http.createServer(app);
    server.listen('5000');

    const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
    gmail.sendLoginEmail(contractor, {})
      .then((result) => {
        expect(result.status).to.equal('success');
        server.close();
      })
      .then(done, done);
  });
});
