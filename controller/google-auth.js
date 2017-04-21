/**
 * @fileOverview All functions related to authenticating with Google
 */
let config = require('config');
let request = require('request-promise');
let google = require('googleapis');
let Bluebird = require('bluebird');

let googleAuth = exports;

/**
 * Have the OAuth Client make an authentication url we can direct the user to
 * @returns {string} the authentication url
 */
googleAuth.getAuthUrl = () => {
  let oauth2Client = googleAuth.getOAuthClient();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: config.get('google.scope'),
    hd: '7hci.com'
  });
};

/**
 * Gives the credentials stored in the session to the OAuth client and retrieves an access token from it
 * @param credentials The Google credentials stored in the user's session
 * @returns the access token information based on the credentials
 */
googleAuth.getAccessToken = (credentials) => {
  let oauth2Client = googleAuth.getOAuthClient();
  oauth2Client.setCredentials(credentials);
  return oauth2Client.getAccessTokenAsync();
};

/**
 * Generate a new OAuthClient through Google's API library
 * @returns the client
 */
googleAuth.getOAuthClient = () => {
  let oauth = new google.auth.OAuth2(
    config.get('google.clientId'),
    config.get('google.clientSecret'),
    config.get('google.redirectUri')
  );
  return Bluebird.promisifyAll(oauth);
};

/**
 * Express middleware to verify user has authenticated prior to displaying page. If not, kick off OAuth process.
 * @param req
 * @param res
 * @param next
 */
googleAuth.authenticateSession = (req, res, next) => {
  if ('tokens' in req.session) {
    googleAuth.getAccessToken(req.session.tokens)
      .then(function (token) {
        return googleAuth.getUserInfo(token)
      })
      .then(function (info) {
        let user_email = info.emailAddress;
        if (googleAuth.hasValidDomain(user_email)) {
          next();
        } else {
          res.render('error.html',{ errorMessage: 'Invalid e-mail domain.' })
        }
      });
  } else {
    res.redirect(googleAuth.getAuthUrl());
  }
};

/**
 * Helper function to get the authenticated user's information
 * @param access_token
 * @returns a user object for the authenticated user
 */
googleAuth.getUserInfo = (access_token) => {
  let profile_url = 'https://www.googleapis.com/gmail/v1/users/me/profile';
  return request.get({url: profile_url, qs: {access_token: access_token}, json: true});
};

/**
 * Helper function to ensure the authenticated user is a member of the 7HCI domain
 * @param emailAddress
 * @returns true if the domain is 7hci.com
 */
googleAuth.hasValidDomain = (emailAddress) => {
  return emailAddress.split('@')[1].toLowerCase() === '7hci.com';
};