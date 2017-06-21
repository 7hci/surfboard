/* eslint-disable */

jest.mock('log4js', () => require('./mocks/log4js'));
jest.mock('../server/lib/google-auth', () => require('./mocks/google-auth'));

const nock = require('nock');
const config = require('config');
const gmail = require('../server/lib/gmail');
const testTemplate = require('../server/views/email/test-template');
const Contractor = require('./mocks/contractor');
const Socket = require('./mocks/socket');

describe('gmail', () => {
  describe('sendWelcomeEmail', () => {
    it('should return a successful status if a message object is returned by API', () => {
      const mockResponse = { id: 'testid' };
      nock(config.get('google.baseUrl'))
        .post('/gmail/v1/users/me/messages/send')
        .query(true)
        .reply(200, mockResponse);
      const socket = new Socket();
      return gmail.sendWelcomeEmail(new Contractor(), socket, {})
        .then(() => {
          expect(socket.emitted[0].status).toBe('success');
        });
    });
    it('should return a failure status if the HTTP request is not successful)', () => {
      nock(config.get('google.baseUrl'))
        .post('/gmail/v1/users/me/messages/send')
        .query(true)
        .reply(404);
      const socket = new Socket();
      return gmail.sendWelcomeEmail(new Contractor(), socket, {})
        .then(() => {
          expect(socket.emitted[0].status).toBe('failure');
        });
    });
  });
  describe('sendLoginEmail', () => {
    it('should return a successful status if a message object is returned by API', () => {
      const mockResponse = { id: 'testid' };
      nock(config.get('google.baseUrl'))
        .post('/gmail/v1/users/me/messages/send')
        .query(true)
        .reply(200, mockResponse);
      const socket = new Socket();
      return gmail.sendLoginEmail(new Contractor(), socket, {})
        .then(() => {
          expect(socket.emitted[0].status).toBe('success');
        });
    });
    it('should return a failure status if the HTTP request is not successful)', () => {
      nock(config.get('google.baseUrl'))
        .post('/gmail/v1/users/me/messages/send')
        .query(true)
        .reply(404);
      const socket = new Socket();
      return gmail.sendLoginEmail(new Contractor(), socket, {})
        .then(() => {
          expect(socket.emitted[0].status).toBe('failure');
        });
    });
  });
  describe('getMessageFromFile', () => {
    it('should return the retrieved text file with the contractor name inserted', () => {
      expect(gmail.getMessageFromFile(new Contractor(), testTemplate)).toBe('Hello Jon!');
    });
  });
});
