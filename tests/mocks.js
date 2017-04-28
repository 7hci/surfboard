const Bluebird = require('bluebird');

const mock = exports;

mock.domain = {
  createContractorEmail() {
    return Bluebird.resolve({ text: 'mock text', status: 'mock status' });
  }
};
mock.drive = {
  addAndShareDriveFolder() {
    return Bluebird.resolve({ text: 'mock text', status: 'mock status' });
  }
};
mock.gmail = {
  sendLoginEmail() {
    return Bluebird.resolve({ text: 'mock text', status: 'mock status' });
  },
  sendWelcomeEmail() {
    return Bluebird.resolve({ text: 'mock text', status: 'mock status' });
  }
};
mock.slack = {
  inviteToSlack() {
    return Bluebird.resolve({ text: 'mock text', status: 'mock status' });
  }
};
mock.trello = {
  createTrelloBoard() {
    return Bluebird.resolve({ text: 'mock text', status: 'mock status' });
  }
};
mock.clicktime = {
  addUserToClickTime() {
    return Bluebird.resolve({ text: 'mock text', status: 'mock status' });
  }
};
mock.auth = {
  getAccessToken() {
    return Bluebird.resolve('mock_token');
  }
};
