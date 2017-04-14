var chai = require('chai');
var expect = chai.expect;
var rewire = require('rewire');

var domain = rewire('../helper/domain');
var Contractor = require('../model/contractor');
var mock = require('./mocks');

domain.__set__('auth', mock.auth);

describe('createContractorEmail', () => {
  it('should return a successful status if a user object is returned', (done) => {
    var contractor = new Contractor("Jon", "Snow", true, "danielrearden@google.com");
    domain.createContractorEmail(contractor)
      .then((result) => {
        expect(result.status).to.equal("success");
      })
      .then(done)
      .catch(done, done);
  });

});