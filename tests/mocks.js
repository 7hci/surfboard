let Bluebird = require('bluebird');

let mock = exports;

mock.domain = {
  createContractorEmail(contractor) {
    return Bluebird.resolve({text: "mock text", status: "mock status"});
  }
};
mock.drive = {
  addAndShareDriveFolder(contractor) {
    return Bluebird.resolve({text: "mock text", status: "mock status"});
  }
};
mock.gmail = {
  sendLoginEmail(contractor) {
    return Bluebird.resolve({text: "mock text", status: "mock status"});
  },
  sendDriveEmail(contractor) {
    return Bluebird.resolve({text: "mock text", status: "mock status"});
  }
};
mock.slack = {
  inviteToSlack(contractor) {
    return Bluebird.resolve({text: "mock text", status: "mock status"});
  }
};
mock.trello = {
  createTrelloBoard(contractor) {
    return Bluebird.resolve({text: "mock text", status: "mock status"});
  }
};

mock.auth = {
  getAccessToken(credentials) {
    return Bluebird.resolve("mock_token");
  }
};