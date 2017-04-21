let chai = require('chai');
let expect = chai.expect;
let rewire = require('rewire');
let http = require('http');

let app = require('../app');
let domain = rewire('../controller/domain');
let Contractor = require('../model/contractor');
let mock = require('./mocks');

domain.__set__('googleAuth', mock.auth);

describe('createContractorEmail', () => {
  it('should return a successful status if a user object is returned', (done) => {
    app.set('port', '5000');
    let server = http.createServer(app);
    server.listen('5000');

    let contractor = new Contractor("Jon", "Snow", true, "danielrearden@google.com");
    domain.createContractorEmail(contractor, {})
      .then((result) => {
        expect(result.status).to.equal("success");
      })
      .then(() => {
          server.close(done);
        }
      );
  });
});