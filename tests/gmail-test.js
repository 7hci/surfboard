const chai = require('chai');
const proxyquire = require('proxyquire');
const Contractor = require('../model/contractor');
const nock = require('nock');
const mock = require('./mocks');
const path = require('path');
const config = require('config');

const gmail = proxyquire('../controller/gmail', { './google-auth': mock.auth });
const expect = chai.expect;

describe('gmail', () => {
  describe('sendDriveEmail', () => {
    before((done) => {
      const mockResponse = { id: 'testid' };
      nock(config.get('google.baseUrl'))
        .post('/gmail/v1/users/me/messages/send')
        .query(true)
        .reply(200, mockResponse);
      done();
    });
    it('should return a successful status if a message object is returned by API', (done) => {
      const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
      gmail.sendDriveEmail(contractor, {})
        .then((result) => {
          expect(result.status).to.equal('success');
        })
        .then(done, done);
    });
  });
  describe('sendLoginEmail', () => {
    before((done) => {
      const mockResponse = { id: 'testid' };
      nock(config.get('google.baseUrl'))
        .post('/gmail/v1/users/me/messages/send')
        .query(true)
        .reply(200, mockResponse);
      done();
    });
    it('should return a successful status if a message object is returned by API', (done) => {
      const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
      gmail.sendLoginEmail(contractor, {})
        .then((result) => {
          expect(result.status).to.equal('success');
        })
        .then(done, done);
    });
  });
  describe('getMessageFromFile', () => {
    it('should return the retrieved text file with the contractor name inserted', (done) => {
      const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
      gmail.getMessageFromFile(contractor, path.join(__dirname, '..', 'data', 'test.txt'))
        .then((result) => {
          expect(result).to.equal('Hello Jon!');
        })
        .then(done, done);
    });
  });
});
