/* eslint-disable */

jest.mock('log4js', () => require('./mocks/log4js'));

const nock = require('nock');
const config = require('config');
const slack = require('../dist/server/lib/slack');
const Contractor = require('./mocks/contractor');
const Socket = require('./mocks/socket');

describe('slack', () => {
  describe('inviteToSlack', () => {
    it('should return a successful status if a response object is returned', () => {
      const mockResponse = { ok: true };
      nock(config.get('slack.baseUrl'))
        .get('/users.admin.invite')
        .query(true)
        .reply(200, mockResponse);
      const socket = new Socket();
      return slack.inviteToSlack(new Contractor(), socket)
        .then(() => {
          expect(socket.emitted[0].status).toBe('success');
        });
    });
    it('should return a failure status if the API response is ok: false (already invited contractor)', () => {
      const mockResponse = { ok: false };
      nock(config.get('slack.baseUrl'))
        .get('/users.admin.invite')
        .query(true)
        .reply(200, mockResponse);
      const socket = new Socket();
      return slack.inviteToSlack(new Contractor(), socket)
        .then(() => {
          expect(socket.emitted[0].status).toBe('failure');
        });
    });
    it('should return a failure status if the HTTP request is not successful)', () => {
      nock(config.get('slack.baseUrl'))
        .get('/users.admin.invite')
        .query(true)
        .reply(404);
      const socket = new Socket();
      return slack.inviteToSlack(new Contractor(), socket)
        .then(() => {
          expect(socket.emitted[0].status).toBe('failure');
        });
    });
  });
});
