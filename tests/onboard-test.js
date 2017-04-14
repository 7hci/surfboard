var chai = require('chai');
var expect = chai.expect;
var rewire = require('rewire');

var Contractor = require('../model/contractor');
var mock = require('./mocks');

var onboard = rewire('../routes/onboard');
onboard.__set__({
  domain: mock.domain,
  drive: mock.drive,
  gmail: mock.gmail,
  slack: mock.slack,
  trello: mock.trello
});

describe('runCheckedTasks', () => {
  it('should return text and status for every checked task', (done) => {
    var checkedTasks = {
      createContractorEmail: 'on',
      createTrelloBoard: 'on',
      sendLoginEmail: 'on',
      addAndShareDriveFolder: 'on',
      sendDriveEmail: 'on',
      inviteToSlack: 'on'
    };
    var contractor = new Contractor('Jon', 'Snow', true, 'jonsnow@gmail.com');
    onboard.runCheckedTasks(checkedTasks, contractor)
      .then((results) => {
      results.forEach((result) => {
        expect(result).to.include.keys('text', 'status');
      });
      expect(results.length).to.equal(Object.keys(checkedTasks).length);
    })
      .then(done())
      .catch(done, done);
  });

  it('should return text and status for every checked task even if createContractorEmail is not checked', (done) => {
    var checkedTasks = {
      createTrelloBoard: 'on',
      sendLoginEmail: 'on',
      addAndShareDriveFolder: 'on',
      sendDriveEmail: 'on',
      inviteToSlack: 'on'
    };
    var contractor = new Contractor('Jon', 'Snow', true, 'jonsnow@gmail.com');
    onboard.runCheckedTasks(checkedTasks, contractor)
      .then((results) => {
      results.forEach((result) => {
        expect(result).to.include.keys('text', 'status');
      });
      expect(results.length).to.equal(Object.keys(checkedTasks).length);
    })
      .then(done())
      .catch(done, done);
  });
});