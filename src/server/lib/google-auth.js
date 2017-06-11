/**
 * @fileOverview All functions related to authenticating with Google
 */
const config = require('config');
const request = require('request-promise');
const google = require('googleapis');
const Bluebird = require('bluebird');

const googleAuth = exports;

/**
 * Have the OAuth Client make an authentication url we can direct the user to
 * @returns {string} the authentication url
 */
googleAuth.getAuthUrl = () => {
  const oauth2Client = googleAuth.getOAuthClient();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: config.get('google.scope'),
    approval_prompt: 'force',
    hd: '7hci.com'
  });
};

/**
 * Gives the credentials stored in the session to the OAuth client
 * and retrieves an access token from it
 * @param credentials The Google credentials stored in the user's session
 * @returns the access token information based on the credentials
 */
googleAuth.getAccessToken = (credentials) => {
  const oauth2Client = googleAuth.getOAuthClient();
  oauth2Client.setCredentials(credentials);
  return oauth2Client.getAccessTokenAsync();
};

/**
 * Generate a new OAuthClient through Google's API library
 * @returns the client
 */
googleAuth.getOAuthClient = () => {
  const oauth = new google.auth.OAuth2(
    config.get('google.clientId'),
    config.get('google.clientSecret'),
    config.get('google.redirectUri')
  );
  return Bluebird.promisifyAll(oauth);
};

/**
 * Express middleware to verify user has authenticated prior to displaying page.
 * If not, kick off OAuth process.
 * @param req
 * @param res
 * @param next
 */
googleAuth.authenticateSession = (req, res, next) => {
  if ('tokens' in req.session) {
    googleAuth.getAccessToken(req.session.tokens)
      .then(token => googleAuth.getUserInfo(token))
      .then((info) => {
        const userEmail = info.user.emailAddress;
        if (googleAuth.hasValidDomain(userEmail)) {
          next();
        } else {
          res.render('error.html', { errorMessage: 'Invalid e-mail domain.' });
        }
      });
  } else {
    res.redirect(googleAuth.getAuthUrl());
  }
};

/**
 * Helper function to get the authenticated user's information
 * @param accessToken
 * @returns a user object for the authenticated user
 */
googleAuth.getUserInfo = (accessToken) => {
  const profileUrl = 'https://www.googleapis.com/drive/v3/about';
  return request.get({ url: profileUrl, qs: { access_token: accessToken, fields: 'user' }, json: true });
};

/**
 * Helper function to ensure the authenticated user is a member of the 7HCI domain
 * @param emailAddress
 * @returns true if the domain is 7hci.com
 */
googleAuth.hasValidDomain = emailAddress => emailAddress.split('@')[1].toLowerCase() === '7hci.com';
