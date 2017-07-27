/* eslint-disable */

jest.mock('log4js', () => require('./mocks/log4js'));
jest.mock('../server/lib/google-auth', () => require('./mocks/google-auth'));

const nock = require('nock');
const config = require('config');
const domain = require('../server/lib/domain');
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
      return domain.createContractorEmail(newHire, socket, {})
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
      return domain.createContractorEmail(newHire, socket, {})
        .then(() => {
          expect(socket.emitted[0].status).toBe('failure');
        });
    });
  });
});
