const chai = require('chai');
const proxyquire = require('proxyquire');
const Contractor = require('../model/contractor');
const mock = require('./mocks');

const expect = chai.expect;
const onboard = proxyquire('../routes/onboard', {
  '../controller/domain': mock.domain,
  '../controller/drive': mock.drive,
  '../controller/gmail': mock.gmail,
  '../controller/slack': mock.slack,
  '../controller/trello': mock.trello
});

describe('runCheckedTasks', () => {
  it('should return text and status for every checked task', (done) => {
    const request = {
      body: {
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
    const contractor = new Contractor('Jon', 'Snow', true, 'jonsnow@gmail.com');
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
    const request = {
      body: {
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
    const contractor = new Contractor('Jon', 'Snow', true, 'jonsnow@gmail.com');
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
