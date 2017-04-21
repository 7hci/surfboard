let chai = require('chai');
let expect = chai.expect;
let auth = require('../controller/google-auth');
let config = require('config');

describe('getAuthUrl', () => {
  // will throw unhandled rejection error since we don't have an access token
  it('should return the correct google authorization url', () => {
    let expected_url = 'https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=' + encodeURIComponent(config.get('google.scope'))
      + '&hd=7hci.com&response_type=code&client_id=' + encodeURIComponent(config.get('google.clientId'))
      + '&redirect_uri=' + encodeURIComponent(config.get('google.redirectUri'));
    expect(auth.getAuthUrl()).to.equal(expected_url);
  });
});

describe('hasValidDomain', () => {
  it('should return false if domain other than 7hci.com is used', () => {
    let email = 'somoneone@somewhere.com';
    expect(auth.hasValidDomain(email)).to.equal(false);
  });

  it('should return true if domain is 7hci.com', () => {
    let email = 'somoneone@7hci.com';
    expect(auth.hasValidDomain(email)).to.equal(true);
  });

  it('should return true if domain is 7hci.com regardless of case', () => {
    let email = 'somoneone@7HcI.com';
    expect(auth.hasValidDomain(email)).to.equal(true);
  });
});