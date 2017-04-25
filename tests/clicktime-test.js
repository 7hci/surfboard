let chai = require('chai');
let expect = chai.expect;

let clicktime = require('../controller/clicktime');
let Contractor = require('../model/contractor');

describe('addUserToClickTime', () => {
  it('should return a successful status if a response object is returned', (done) => {
    let contractor = new Contractor("Jon", "Snow", true, "danielrearden@google.com");
    clicktime.addUserToClickTime(contractor)
      .then((result) => {
        expect(result.status).to.equal("success");
      })
      .then(done, done);
  }).timeout(15000);
});