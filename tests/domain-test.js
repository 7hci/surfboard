const chai = require('chai');
const proxyquire = require('proxyquire');
const Contractor = require('../model/contractor');
const mock = require('./mocks');
const nock = require('nock');
const config = require('config');

const expect = chai.expect;
const domain = proxyquire('../controller/domain', { './google-auth': mock.auth });

describe('domain', () => {
  describe('createContractorEmail', () => {
    before((done) => {
      const mockResponse = { id: 'testid' };
      nock(config.get('google.baseUrl'))
        .post('/admin/directory/v1/users')
        .query(true)
        .reply(200, mockResponse);
      done();
    });
    it('should return a successful status if a user object is returned', (done) => {
      const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
      domain.createContractorEmail(contractor, {})
        .then((result) => {
          expect(result.status).to.equal('success');
        })
        .then(() => {
          done();
        }
        );
    }).timeout(10000);
  });
});

