const chai = require('chai');
const chaiPromise = require('chai-as-promised');
const proxyquire = require('proxyquire');
const mock = require('./mocks');

chai.use(chaiPromise);
const expect = chai.expect;
const onboard = proxyquire('../dist/lib/onboard', {
  './domain': mock.domain,
  './drive': mock.drive,
  './gmail': mock.gmail,
  './slack': mock.slack,
  './trello': mock.trello,
  './clicktime': mock.clicktime
});
describe('onboard', () => {
  describe('runCheckedTasks', () => {
    it('should return text and status for every checked task', () => {
      const tasks = {
        createContractorEmail: 'on',
        sendWelcomeEmail: 'on',
        inviteToSlack: 'on',
        addUserToClickTime: 'on'
      };
      const socket = new mock.Socket();
      return onboard.runCheckedTasks(socket, tasks, {}, mock.contractor)
        .then(() => {
          expect(socket.emitted).to.have.lengthOf(Object.keys(tasks).length);
        });
    });

    it('should return text and status for every checked task even if createContractorEmail is not checked', () => {
      const tasks = {
        createTrelloBoard: 'on',
        sendLoginEmail: 'on',
        addAndShareDriveFolder: 'on',
        sendWelcomeEmail: 'on',
        inviteToSlack: 'on'
      };
      const socket = new mock.Socket();
      return onboard.runCheckedTasks(socket, tasks, {}, mock.contractor)
        .then(() => {
          expect(socket.emitted).to.have.lengthOf(Object.keys(tasks).length);
        });
    });
  });
});
