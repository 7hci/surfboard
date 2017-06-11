/* eslint-disable */
jest.mock('log4js', () => require('./mocks/log4js'));
const clicktime = require('../dist/server/lib/clicktime');
const Contractor = require('./mocks/contractor');
const Socket = require('./mocks/socket');

describe('addUserToClickTime', () => {
  it('should emit a successful status if a response object is returned', () => {
    const socket = new Socket();
    return clicktime.addUserToClickTime(new Contractor(), socket)
      .then(() => {
        expect(socket.emitted[0].status).toBe('success');
      });
  }, 15000);
});