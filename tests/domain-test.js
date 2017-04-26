const chai = require('chai');
const proxyquire = require('proxyquire');
const http = require('http');
const app = require('../app');
const Contractor = require('../model/contractor');
const mock = require('./mocks');

const expect = chai.expect;

const domain = proxyquire('../controller/domain', { './google-auth': mock.auth });

describe('createContractorEmail', () => {
  it('should return a successful status if a user object is returned', (done) => {
    app.set('port', '5000');
    const server = http.createServer(app);
    server.listen('5000');

    const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
    domain.createContractorEmail(contractor, {})
      .then((result) => {
        expect(result.status).to.equal('success');
      })
      .then(() => {
        server.close(done);
      }
      );
  }).timeout(10000);
});
