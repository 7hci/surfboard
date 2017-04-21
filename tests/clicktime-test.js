var chai = require('chai');
var expect = chai.expect;

var clicktime = require('../helper/clicktime');
var Contractor = require('../model/contractor');

describe('addUserToClickTime', () => {
  it('should return a successful status if a response object is returned', (done) => {
    var contractor = new Contractor("Jon", "Snow", true, "danielrearden@google.com");
    clicktime.addUserToClickTime(contractor)
      .then((result) => {
        expect(result.status).to.equal("success");
      })
      .then(done, done);
  }).timeout(15000);
});