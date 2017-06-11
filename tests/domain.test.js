/* eslint-disable */

jest.mock('log4js', () => require('./mocks/log4js'));
jest.mock('../dist/server/lib/google-auth', () => require('./mocks/google-auth'));

const nock = require('nock');
const config = require('config');
const domain = require('../dist/server/lib/domain');
const Contractor = require('./mocks/contractor');
const Socket = require('./mocks/socket');

describe('domain', () => {
  describe('createContractorEmail', () => {
    it('should return a successful status if a user object is returned', () => {
      const mockResponse = { id: 'testid' };
      nock(config.get('google.baseUrl'))
        .post('/admin/directory/v1/users')
        .query(true)
        .once()
        .reply(200, mockResponse);
      const socket = new Socket();
      return domain.createContractorEmail(new Contractor(), socket, {})
        .then(() => {
          expect(socket.emitted[0].status).toBe('success');
        });
    });
    it('should return a failed status if the HTTP request is not successful', () => {
      nock(config.get('google.baseUrl'))
        .post('/admin/directory/v1/users')
        .query(true)
        .once()
        .reply(404);
      const socket = new Socket();
      return domain.createContractorEmail(new Contractor(), socket, {})
        .then(() => {
          expect(socket.emitted[0].status).toBe('failure');
        });
    });
  });
});
