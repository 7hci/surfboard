let config = require('config');
let request = require('request-promise');
let google = require('googleapis');
let Promise = require('bluebird');

let auth = exports;

auth.getAuthUrl = () => {
  let oauth2Client = auth.getOAuthClient();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: config.get('google.scope'),
    hd: '7hci.com'
  });
};

auth.getAccessToken = (credentials) => {
  let oauth2Client = auth.getOAuthClient();
  oauth2Client.setCredentials(credentials);
  return oauth2Client.getAccessTokenAsync();
};

auth.getOAuthClient = () => {
  let oauth = new google.auth.OAuth2(
    config.get('google.clientId'),
    config.get('google.clientSecret'),
    config.get('google.redirectUri')
  );
  return Promise.promisifyAll(oauth);
};

auth.authenticateSession = (req, res, next) => {
  if ('tokens' in req.session) {
    auth.getAccessToken(req.session.tokens)
      .then(function (token) {
        return auth.getUserInfo(token)
      })
      .then(function (info) {
        let user_email = info.emailAddress;
        if (auth.hasValidDomain(user_email)) {
          next();
        }
      });
  } else {
    res.redirect(auth.getAuthUrl());
  }
};

auth.getUserInfo = (access_token) => {
  let profile_url = 'https://www.googleapis.com/gmail/v1/users/me/profile';
  return request.get({url: profile_url, qs: {access_token: access_token}, json: true});
};

auth.hasValidDomain = (emailAddress) => {
  return emailAddress.split('@')[1].toLowerCase() === '7hci.com';
};