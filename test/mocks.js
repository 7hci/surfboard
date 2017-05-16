const Bluebird = require('bluebird');
const Contractor = require('../dist/classes/contractor');

const mock = exports;

mock.domain = {
  createContractorEmail(contractor, socket) {
    return Bluebird.resolve(socket.emit({ text: 'mock text', status: 'mock status' }));
  }
};
mock.drive = {
  addAndShareDriveFolder(contractor, socket) {
    return Bluebird.resolve(socket.emit({ text: 'mock text', status: 'mock status' }));
  }
};
mock.gmail = {
  sendLoginEmail(contractor, socket) {
    return Bluebird.resolve(socket.emit({ text: 'mock text', status: 'mock status' }));
  },
  sendWelcomeEmail(contractor, socket) {
    return Bluebird.resolve(socket.emit({ text: 'mock text', status: 'mock status' }));
  }
};
mock.slack = {
  inviteToSlack(contractor, socket) {
    return Bluebird.resolve(socket.emit({ text: 'mock text', status: 'mock status' }));
  }
};
mock.trello = {
  createTrelloBoard(contractor, socket) {
    return Bluebird.resolve(socket.emit({ text: 'mock text', status: 'mock status' }));
  }
};
mock.clicktime = {
  addUserToClickTime(contractor, socket) {
    return Bluebird.resolve(socket.emit({ text: 'mock text', status: 'mock status' }));
  }
};
mock.auth = {
  getAccessToken() {
    return Bluebird.resolve('mock_token');
  }
};
mock.Socket = function socket() {
  this.emitted = [];
  this.emit = (type, msg) => {
    this.emitted.push(msg);
  };
};
mock.contractor = new Contractor({
  firstName: 'Jon',
  lastName: 'Snow',
  isResident: true,
  email: 'danielrearden@gmail.com',
  override: '',
  contractId: 'testid_contract',
  folderId: 'testid_folder'
});
