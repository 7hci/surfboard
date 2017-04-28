const chai = require('chai');
const chaiPromise = require('chai-as-promised');
const proxyquire = require('proxyquire');
const Contractor = require('../model/contractor');
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
      const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
      return expect(gmail.sendWelcomeEmail(contractor, {})).to.eventually.have.property('status', 'success');
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
      const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
      return expect(gmail.sendLoginEmail(contractor, {})).to.eventually.have.property('status', 'success');
    });
  });
  describe('getMessageFromFile', () => {
    it('should return the retrieved text file with the contractor name inserted', () => {
      const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
      expect(gmail.getMessageFromFile(contractor, testTemplate)).to.equal('Hello Jon!');
    });
  });
});
