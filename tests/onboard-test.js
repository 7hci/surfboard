let chai = require('chai');
let expect = chai.expect;
let rewire = require('rewire');

let Contractor = require('../model/contractor');
let mock = require('./mocks');

let onboard = rewire('../routes/onboard');
onboard.__set__({
  domain: mock.domain,
  drive: mock.drive,
  gmail: mock.gmail,
  slack: mock.slack,
  trello: mock.trello
});

describe('runCheckedTasks', () => {
  it('should return text and status for every checked task', (done) => {
    let request = {
      body : {
        createContractorEmail: 'on',
        sendDriveEmail: 'on',
        inviteToSlack: 'on',
        addUserToClickTime: 'on'
      },
      session: {
        tokens: {
          access_token: 'mock_token'
        }
      }
    };
    let contractor = new Contractor('Jon', 'Snow', true, 'jonsnow@gmail.com');
    onboard.runCheckedTasks(request, contractor)
      .then((results) => {
      results.forEach((result) => {
        expect(result).to.include.keys('text', 'status');
      });
      expect(results.length).to.equal(Object.keys(request.body).length);
    })
      .then(done, done);
  });

  it('should return text and status for every checked task even if createContractorEmail is not checked', (done) => {
    let request = {
      body : {
        createTrelloBoard: 'on',
        sendLoginEmail: 'on',
        addAndShareDriveFolder: 'on',
        sendDriveEmail: 'on',
        inviteToSlack: 'on'
      },
      session: {
        tokens: {
          access_token: 'mock_token'
        }
      }
    };
    let contractor = new Contractor('Jon', 'Snow', true, 'jonsnow@gmail.com');
    onboard.runCheckedTasks(request, contractor)
      .then((results) => {
      results.forEach((result) => {
        expect(result).to.include.keys('text', 'status');
      });
      expect(results.length).to.equal(Object.keys(request.body).length);
    })
      .then(done, done);
  });
});