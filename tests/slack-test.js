const chai = require('chai');
const chaiPromise = require('chai-as-promised');
const nock = require('nock');
const config = require('config');
const slack = require('../lib/slack');
const mock = require('./mocks');
const Contractor = require('../classes/contractor');

chai.use(chaiPromise);
const expect = chai.expect;

describe('slack', () => {
  describe('inviteToSlack', () => {
    before(() => {
      const mockResponse = { ok: true };
      nock(config.get('slack.baseUrl'))
        .get('/users.admin.invite')
        .query(true)
        .reply(200, mockResponse);
    });
    it('should return a successful status if a response object is returned', () => {
      const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
      const socket = new mock.Socket();
      return slack.inviteToSlack(contractor, socket)
        .then(() => {
          expect(socket.emitted[0]).to.have.property('status', 'success');
        });
    });
    before(() => {
      const mockResponse = { ok: false };
      nock(config.get('slack.baseUrl'))
        .get('/users.admin.invite')
        .query(true)
        .reply(200, mockResponse);
    });
    it('should return a failure status if the API response is ok: false (already invited contractor)', () => {
      const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
      const socket = new mock.Socket();
      return slack.inviteToSlack(contractor, socket)
        .then(() => {
          expect(socket.emitted[0]).to.have.property('status', 'failure');
        });
    });
    before(() => {
      nock(config.get('slack.baseUrl'))
        .get('/users.admin.invite')
        .query(true)
        .reply(404);
    });
    it('should return a failure status if the HTTP request is not successful)', () => {
      const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
      const socket = new mock.Socket();
      return slack.inviteToSlack(contractor, socket)
        .then(() => {
          expect(socket.emitted[0]).to.have.property('status', 'failure');
        });
    });
  });
});
