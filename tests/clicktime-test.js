const chai = require('chai');
const clicktime = require('../controller/clicktime');
const Contractor = require('../model/contractor');

const expect = chai.expect;

describe('addUserToClickTime', () => {
  it('should return a successful status if a response object is returned', (done) => {
    const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
    clicktime.addUserToClickTime(contractor)
      .then((result) => {
        expect(result.status).to.equal('success');
      })
      .then(done, done);
  }).timeout(15000);
});