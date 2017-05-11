const chai = require('chai');
const chaiPromise = require('chai-as-promised');
const proxyquire = require('proxyquire');
const nock = require('nock');
const mock = require('./mocks');
const config = require('config');
const testTemplate = require('../views/email/test-template');

chai.use(chaiPromise);
const expect = chai.expect;
const gmail = proxyquire('../lib/gmail', { './google-auth': mock.auth });

describe('gmail', () => {
  describe('sendWelcomeEmail', () => {
    before(() => {
      const mockResponse = { id: 'testid' };
      nock(config.get('google.baseUrl'))
        .post('/gmail/v1/users/me/messages/send')
        .query(true)
        .reply(200, mockResponse);
    });
    it('should return a successful status if a message object is returned by API', () => {
      const socket = new mock.Socket();
      return gmail.sendWelcomeEmail(mock.contractor, socket, {})
        .then(() => {
          expect(socket.emitted[0]).to.have.property('status', 'success');
        });
    });
    before(() => {
      nock(config.get('google.baseUrl'))
        .post('/gmail/v1/users/me/messages/send')
        .query(true)
        .reply(404);
    });
    it('should return a failure status if the HTTP request is not successful)', () => {
      const socket = new mock.Socket();
      return gmail.sendWelcomeEmail(mock.contractor, socket, {})
        .then(() => {
          expect(socket.emitted[0]).to.have.property('status', 'failure');
        });
    });
  });
  describe('sendLoginEmail', () => {
    before(() => {
      const mockResponse = { id: 'testid' };
      nock(config.get('google.baseUrl'))
        .post('/gmail/v1/users/me/messages/send')
        .query(true)
        .reply(200, mockResponse);
    });
    it('should return a successful status if a message object is returned by API', () => {
      const socket = new mock.Socket();
      return gmail.sendLoginEmail(mock.contractor, socket, {})
        .then(() => {
          expect(socket.emitted[0]).to.have.property('status', 'success');
        });
    });
    before(() => {
      nock(config.get('google.baseUrl'))
        .post('/gmail/v1/users/me/messages/send')
        .query(true)
        .reply(404);
    });
    it('should return a failure status if the HTTP request is not successful)', () => {
      const socket = new mock.Socket();
      return gmail.sendLoginEmail(mock.contractor, socket, {})
        .then(() => {
          expect(socket.emitted[0]).to.have.property('status', 'failure');
        });
    });
  });
  describe('getMessageFromFile', () => {
    it('should return the retrieved text file with the contractor name inserted', () => {
      expect(gmail.getMessageFromFile(mock.contractor, testTemplate)).to.equal('Hello Jon!');
    });
  });
});
