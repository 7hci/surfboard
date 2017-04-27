const chai = require('chai');
const nock = require('nock');
const config = require('config');
const slack = require('../controller/slack');
const Contractor = require('../model/contractor');

const expect = chai.expect;

describe('slack', () => {
  describe('inviteToSlack', () => {
    before((done) => {
      const mockResponse = { ok: true };
      nock(config.get('slack.baseUrl'))
        .get('/users.admin.invite')
        .query(true)
        .reply(200, mockResponse);
      done();
    });
    it('should return a successful status if a response object is returned', (done) => {
      const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
      slack.inviteToSlack(contractor)
        .then((result) => {
          expect(result.status).to.equal('success');
        })
        .then(() => {
          done();
        }
        );
    });
    before((done) => {
      const mockResponse = { ok: false };
      nock(config.get('slack.baseUrl'))
        .get('/users.admin.invite')
        .query(true)
        .reply(200, mockResponse);
      done();
    });
    it('should return a failure status if the API response is ok: false (already invited contractor)', (done) => {
      const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
      slack.inviteToSlack(contractor)
        .then((result) => {
          expect(result.status).to.equal('failure');
        })
        .then(() => {
          done();
        }
        );
    });
  });
});
