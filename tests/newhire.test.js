/* eslint-disable */

jest.mock('log4js', () => require('./mocks/log4js'));
jest.mock('../server/lib/clicktime', () => require('./mocks/clicktime'));
jest.mock('../server/lib/domain', () => require('./mocks/domain'));
jest.mock('../server/lib/drive', () => require('./mocks/drive'));
jest.mock('../server/lib/gmail', () => require('./mocks/gmail'));
jest.mock('../server/lib/slack', () => require('./mocks/slack'));
jest.mock('../server/lib/trello', () => require('./mocks/trello'));

const NewHire = require('./mocks/newhire');
const Socket = require('./mocks/socket');

describe('NewHire', () => {
  describe('instance methods', () => {
    it('should return the full name separated by a space', () => {
      const contractor = new NewHire({
        firstName: 'Jon',
        lastName: 'Snow',
      });
      expect(contractor.getFullName()).toEqual('Jon Snow');
    });
    it('should return a sanitized, lowercase e-mail address', () => {
      const contractor = new NewHire({
        firstName: ' J 6.$;~&*on',
        lastName: 'SNO40"\'\'?w ',
      });

      expect(contractor.getEmail()).toEqual('jon.snow@7hci.com');
    });
    it('should use override if one is given through the constructor', () => {
      const contractor = new NewHire({
        firstName: 'Jonathan',
        lastName: 'Stark',
        override: 'jonsnow',
      });
      expect(contractor.getEmail()).toEqual('jonsnow@7hci.com');
    });
  });
  describe('_runCheckedTasks', () => {
    let newHire;
    beforeEach(() => {
      newHire = new NewHire({
        firstName: 'Jon',
        lastName: 'Snow',
        isResident: true,
        privateEmail: 'danielrearden@gmail.com',
        override: '',
        contractId: 'testid_contract',
        folderId: 'testid_folder'
      })
    });
    it('should return text and status for every checked task', () => {
      const tasks = {
        createContractorEmail: 'on',
        sendWelcomeEmail: 'on',
        inviteToSlack: 'on',
        addUserToClickTime: 'on'
      };
      const socket = new Socket();
      return newHire._runCheckedTasks(socket, tasks, {})
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
      return newHire._runCheckedTasks(socket, tasks, {})
        .then(() => {
          expect(socket.emitted.length).toBe(Object.keys(tasks).length);
        });
    });
  });
});