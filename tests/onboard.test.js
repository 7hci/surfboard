/* eslint-disable */

jest.mock('log4js', () => require('./mocks/log4js'));
jest.mock('../dist/server/lib/clicktime', () => require('./mocks/clicktime'));
jest.mock('../dist/server/lib/domain', () => require('./mocks/domain'));
jest.mock('../dist/server/lib/drive', () => require('./mocks/drive'));
jest.mock('../dist/server/lib/gmail', () => require('./mocks/gmail'));
jest.mock('../dist/server/lib/slack', () => require('./mocks/slack'));
jest.mock('../dist/server/lib/trello', () => require('./mocks/trello'));

const onboard = require('../dist/server/lib/onboard');
const Contractor = require('./mocks/contractor');
const Socket = require('./mocks/socket');

describe('onboard', () => {
  describe('runCheckedTasks', () => {
    it('should return text and status for every checked task', () => {
      const tasks = {
        createContractorEmail: 'on',
        sendWelcomeEmail: 'on',
        inviteToSlack: 'on',
        addUserToClickTime: 'on'
      };
      const socket = new Socket();
      return onboard.runCheckedTasks(socket, tasks, {}, new Contractor())
        .then(() => {
          expect(socket.emitted.length).toBe(Object.keys(tasks).length);
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
      const socket = new Socket();
      return onboard.runCheckedTasks(socket, tasks, {}, new Contractor())
        .then(() => {
          expect(socket.emitted.length).toBe(Object.keys(tasks).length);
        });
    });
  });
});
