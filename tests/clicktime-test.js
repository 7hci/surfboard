const chai = require('chai');
const chaiPromise = require('chai-as-promised');
const clicktime = require('../lib/clicktime');
const Contractor = require('../classes/contractor');
const mock = require('./mocks');

chai.use(chaiPromise);
const expect = chai.expect;

describe('addUserToClickTime', () => {
  it('should emit a successful status if a response object is returned', () => {
    const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
    const socket = new mock.Socket();
    return clicktime.addUserToClickTime(contractor, socket)
      .then(() => {
        expect(socket.emitted[0]).to.have.property('status', 'success');
      });
  }).timeout(5000);
});
