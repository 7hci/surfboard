const chai = require('chai');
const chaiPromise = require('chai-as-promised');
const clicktime = require('../dist/lib/clicktime');
const mock = require('./mocks');

chai.use(chaiPromise);
const expect = chai.expect;

describe('addUserToClickTime', () => {
  it('should emit a successful status if a response object is returned', () => {
    const socket = new mock.Socket();
    return clicktime.addUserToClickTime(mock.contractor, socket)
      .then(() => {
        expect(socket.emitted[0]).to.have.property('status', 'success');
      });
  }).timeout(10000);
});
