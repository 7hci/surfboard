const chai = require('chai');
const chaiPromise = require('chai-as-promised');
const nock = require('nock');
const config = require('config');
const slack = require('../lib/slack');
const Contractor = require('../classes/contractor');

chai.use(chaiPromise);
const expect = chai.expect;

describe('slack', () => {
  describe('inviteToSlack', () => {
    before(() => {
      const mockResponse = { ok: true };
      nock(config.get('slack.baseUrl'))
        .get('/users.admin.invite')
        .query(true)
        .reply(200, mockResponse);
    });
    it('should return a successful status if a response object is returned', () => {
      const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
      return expect(slack.inviteToSlack(contractor)).to.eventually.have.property('status', 'success');
    });
    before(() => {
      const mockResponse = { ok: false };
      nock(config.get('slack.baseUrl'))
        .get('/users.admin.invite')
        .query(true)
        .reply(200, mockResponse);
    });
    it('should return a failure status if the API response is ok: false (already invited contractor)', () => {
      const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
      return expect(slack.inviteToSlack(contractor)).to.eventually.have.property('status', 'failure');
    });
  });
});
