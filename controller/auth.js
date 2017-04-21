
var config = require('config');
var request = require('request-promise');
var google = require('googleapis');
var Promise = require('bluebird');

var auth = exports;

auth.getAuthUrl = () => {
  var oauth2Client = auth.getOAuthClient();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: config.get('google.scope'),
    hd: '7hci.com'
  });
};

auth.getAccessToken = (credentials) => {
  var oauth2Client = auth.getOAuthClient();
  oauth2Client.setCredentials(credentials);
  return oauth2Client.getAccessTokenAsync();
};

auth.getOAuthClient = () => {
  var oauth = new google.auth.OAuth2(
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
        var user_email = info.emailAddress;
        if (auth.hasValidDomain(user_email)) {
          next();
        } else {
          res.render('error.html',{ errorMessage: 'Invalid e-mail domain.' })
        }
      });
  } else {
    res.redirect(auth.getAuthUrl());
  }
};

auth.getUserInfo = (access_token) => {
  var profile_url = 'https://www.googleapis.com/gmail/v1/users/me/profile';
  return request.get({url: profile_url, qs: {access_token: access_token}, json: true});
};

auth.hasValidDomain = (emailAddress) => {
  return emailAddress.split('@')[1].toLowerCase() === '7hci.com';
};