let chai = require('chai');
let expect = chai.expect;

let auth = require('../helper/auth');

describe('hasValidDomain', () => {
  it('should return false if domain other than 7hci.com is used', () => {
    let email = "somoneone@somewhere.com";
    expect(auth.hasValidDomain(email)).to.equal(false);
  });

  it('should return true if domain is 7hci.com', () => {
    let email = "somoneone@7hci.com";
    expect(auth.hasValidDomain(email)).to.equal(true);
  });

  it('should return true if domain is 7hci.com regardless of case', () => {
    let email = "somoneone@7HcI.com";
    expect(auth.hasValidDomain(email)).to.equal(true);
  });
});