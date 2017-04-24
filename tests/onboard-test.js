var chai = require('chai');
var expect = chai.expect;
var rewire = require('rewire');

var Contractor = require('../model/contractor');

var domainMock = {
  createContractorEmail(contractor) {
    return Promise.resolve({text: "mock text", status: "mock status"});
  }
};
var driveMock = {
  addAndShareDriveFolder(contractor) {
    return Promise.resolve({text: "mock text", status: "mock status"});
  }
};
var gmailMock = {
  sendLoginEmail(contractor) {
    return Promise.resolve({text: "mock text", status: "mock status"});
  },
  sendDriveEmail(contractor) {
    return Promise.resolve({text: "mock text", status: "mock status"});
  }
};
var slackMock = {
  inviteToSlack(contractor) {
    return Promise.resolve({text: "mock text", status: "mock status"});
  }
};
var trelloMock = {
  createTrelloBoard(contractor) {
    return Promise.resolve({text: "mock text", status: "mock status"});
  }
};

describe('runCheckedTasks', () => {
  var onboard = rewire('../routes/onboard');
  onboard.__set__({
    domain: domainMock,
    drive: driveMock,
    gmail: gmailMock,
    slack: slackMock,
    trello: trelloMock
  });
  var contractor = new Contractor('Jon', 'Snow', true, 'jonsnow@gmail.com');

  it('should return text and status for every checked task', () => {
    var checkedTasks = {
      createContractorEmail: 'on',
      createTrelloBoard: 'on',
      sendLoginEmail: 'on',
      addAndShareDriveFolder: 'on',
      sendDriveEmail: 'on',
      inviteToSlack: 'on'
    };
    onboard.runCheckedTasks(checkedTasks, contractor).then((results) => {
      results.forEach((result) => {
        expect(result).to.include.keys('text', 'status');
      });
      expect(results.length).to.equal(Object.keys(checkedTasks).length);
    })
  });

  it('should return text and status for every checked task even if createContractorEmail is not checked', () => {
    var checkedTasks = {
      createTrelloBoard: 'on',
      sendLoginEmail: 'on',
      addAndShareDriveFolder: 'on',
      sendDriveEmail: 'on',
      inviteToSlack: 'on'
    };
    onboard.runCheckedTasks(checkedTasks, contractor).then((results) => {
      results.forEach((result) => {
        expect(result).to.include.keys('text', 'status');
      });
      expect(results.length).to.equal(Object.keys(checkedTasks).length);
    })
  });
});