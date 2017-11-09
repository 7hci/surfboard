/* eslint-disable */
jest.mock('log4js', () => require('./mocks/log4js'));
const clicktime = require('../server/lib/clicktime');
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

describe('addUserToClickTime', () => {
  it('should emit a successful status if a response object is returned', () => {
    const socket = new Socket();
    return clicktime.addUserToClickTime(newHire, socket)
      .then(() => {
        expect(socket.emitted[0].status).toBe('success');
      });
  }, 15000);
});