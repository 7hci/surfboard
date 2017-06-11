/* eslint-disable */
const auth = require('../dist/server/lib/google-auth');
const config = require('config');

describe('google-auth', () => {
  describe('getAuthUrl', () => {
    it('should return the correct google authorization url', () => {
      const expectedUrl = `https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=${encodeURIComponent(config.get('google.scope'))
        }&approval_prompt=force&hd=7hci.com&response_type=code&client_id=${encodeURIComponent(config.get('google.clientId'))
        }&redirect_uri=${encodeURIComponent(config.get('google.redirectUri'))}`;
      expect(auth.getAuthUrl()).toEqual(expectedUrl);
    });
  });

  describe('hasValidDomain', () => {
    it('should return false if domain other than 7hci.com is used', () => {
      const email = 'somoneone@somewhere.com';
      expect(auth.hasValidDomain(email)).toEqual(false);
    });

    it('should return true if domain is 7hci.com', () => {
      const email = 'somoneone@7hci.com';
      expect(auth.hasValidDomain(email)).toEqual(true);
    });

    it('should return true if domain is 7hci.com regardless of case', () => {
      const email = 'somoneone@7HcI.com';
      expect(auth.hasValidDomain(email)).toEqual(true);
    });
  });
});
