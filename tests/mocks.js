var Promise = require('bluebird');

var mock = exports;

mock.domain = {
  createContractorEmail(contractor) {
    return Promise.resolve({text: "mock text", status: "mock status"});
  }
};
mock.drive = {
  addAndShareDriveFolder(contractor) {
    return Promise.resolve({text: "mock text", status: "mock status"});
  }
};
mock.gmail = {
  sendLoginEmail(contractor) {
    return Promise.resolve({text: "mock text", status: "mock status"});
  },
  sendDriveEmail(contractor) {
    return Promise.resolve({text: "mock text", status: "mock status"});
  }
};
mock.slack = {
  inviteToSlack(contractor) {
    return Promise.resolve({text: "mock text", status: "mock status"});
  }
};
mock.trello = {
  createTrelloBoard(contractor) {
    return Promise.resolve({text: "mock text", status: "mock status"});
  }
};

mock.auth = {
  getAccessToken() {
    return Promise.resolve("mock_token");
  }
};