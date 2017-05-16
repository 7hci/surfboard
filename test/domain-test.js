const chai = require('chai');
const chaiPromise = require('chai-as-promised');
const proxyquire = require('proxyquire');
const mock = require('./mocks');
const nock = require('nock');
const config = require('config');

chai.use(chaiPromise);
const expect = chai.expect;
const domain = proxyquire('../dist/lib/domain', { './google-auth': mock.auth });

describe('domain', () => {
  describe('createContractorEmail', () => {
    before(() => {
      const mockResponse = { id: 'testid' };
      nock(config.get('google.baseUrl'))
        .post('/admin/directory/v1/users')
        .query(true)
        .once()
        .reply(200, mockResponse);
    });
    it('should return a successful status if a user object is returned', () => {
      const socket = new mock.Socket();
      return domain.createContractorEmail(mock.contractor, socket, {})
        .then(() => {
          expect(socket.emitted[0]).to.have.property('status', 'success');
        });
    });
    before(() => {
      nock(config.get('google.baseUrl'))
        .post('/admin/directory/v1/users')
        .query(true)
        .once()
        .reply(404);
    });
    it('should return a failed status if the HTTP request is not successful', () => {
      const socket = new mock.Socket();
      return domain.createContractorEmail(mock.contractor, socket, {})
        .then(() => {
          expect(socket.emitted[0]).to.have.property('status', 'failure');
        });
    });
  });
});
