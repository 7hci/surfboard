/* eslint-disable */

jest.mock('log4js', () => require('./mocks/log4js'));

const nock = require('nock');
const config = require('config');
const slack = require('../server/lib/slack');
const NewHire = require('./mocks/newhire');
const Socket = require('./mocks/socket');

const newHire = new NewHire({
  firstName: 'Jon',
  lastName: 'Snow',
  privateEmail: 'jonsnow@thenorth.com',
  override: '',
  isResident: true,
  contractId: 'testid_contract',
  folderId: 'testid_folder'
});

describe('slack', () => {
  describe('inviteToSlack', () => {
    it('should return a successful status if a response object is returned', () => {
      const mockResponse = { ok: true };
      nock(config.get('slack.baseUrl'))
        .get('/users.admin.invite')
        .query(true)
        .reply(200, mockResponse);
      const socket = new Socket();
      return slack.inviteToSlack(newHire, socket)
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
      return slack.inviteToSlack(newHire, socket)
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
      return slack.inviteToSlack(newHire, socket)
        .then(() => {
          expect(socket.emitted[0].status).toBe('failure');
        });
    });
  });
});
