const chai = require('chai');
const chaiPromise = require('chai-as-promised');
const proxyquire = require('proxyquire');
const Contractor = require('../model/contractor');
const mock = require('./mocks');

chai.use(chaiPromise);
const expect = chai.expect;
const onboard = proxyquire('../routes/onboard', {
  '../lib/domain': mock.domain,
  '../lib/drive': mock.drive,
  '../lib/gmail': mock.gmail,
  '../lib/slack': mock.slack,
  '../lib/trello': mock.trello,
  '../lib/clicktime': mock.clicktime
});
describe('onboard', () => {
  describe('runCheckedTasks', () => {
    it('should return text and status for every checked task', () => {
      const request = {
        body: {
          createContractorEmail: 'on',
          sendWelcomeEmail: 'on',
          inviteToSlack: 'on',
          addUserToClickTime: 'on'
        },
        session: {
          tokens: {
            access_token: 'mock_token'
          }
        }
      };
      const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@gmail.com');
      return expect(onboard.runCheckedTasks(request, contractor))
        .to.eventually.have.lengthOf(Object.keys(request.body).length);
    });

    it('should return text and status for every checked task even if createContractorEmail is not checked', () => {
      const request = {
        body: {
          createTrelloBoard: 'on',
          sendLoginEmail: 'on',
          addAndShareDriveFolder: 'on',
          sendWelcomeEmail: 'on',
          inviteToSlack: 'on'
        },
        session: {
          tokens: {
            access_token: 'mock_token'
          }
        }
      };
      const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@gmail.com');
      return expect(onboard.runCheckedTasks(request, contractor))
        .to.eventually.have.lengthOf(Object.keys(request.body).length);
    });
  });
});
