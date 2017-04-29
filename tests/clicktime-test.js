const chai = require('chai');
const chaiPromise = require('chai-as-promised');
const clicktime = require('../lib/clicktime');
const Contractor = require('../model/contractor');

chai.use(chaiPromise);
const expect = chai.expect;

describe('addUserToClickTime', () => {
  it('should return a successful status if a response object is returned', () => {
    const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
    return expect(clicktime.addUserToClickTime(contractor)).to.eventually.have.property('status', 'success');
  }).timeout(5000);
});
