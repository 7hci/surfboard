var chai = require('chai');
var expect = chai.expect;
var Promise = require('bluebird');
var auth = require('../helper/auth');
var config = require('config');

describe('getAccessToken', () => {
  // will throw unhandled rejection error since we haven't an access token
  it('should return a Promise', () => {
    var credentials = {};
    expect(auth.getAccessToken(credentials)).to.be.an.instanceof(Promise);
  });
});

describe('getAuthUrl', () => {
  // will throw unhandled rejection error since we haven't an access token
  it('should return the correct google authorization url', () => {
    var expected_url = 'https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=' + encodeURIComponent(config.get('google.scope'))
      + '&hd=7hci.com&response_type=code&client_id=' + encodeURIComponent(config.get('google.clientId'))
      + '&redirect_uri=' + encodeURIComponent(config.get('google.redirectUri'));
    expect(auth.getAuthUrl()).to.equal(expected_url);
  });
});

describe('hasValidDomain', () => {
  it('should return false if domain other than 7hci.com is used', () => {
    var email = 'somoneone@somewhere.com';
    expect(auth.hasValidDomain(email)).to.equal(false);
  });

  it('should return true if domain is 7hci.com', () => {
    var email = 'somoneone@7hci.com';
    expect(auth.hasValidDomain(email)).to.equal(true);
  });

  it('should return true if domain is 7hci.com regardless of case', () => {
    var email = 'somoneone@7HcI.com';
    expect(auth.hasValidDomain(email)).to.equal(true);
  });
});