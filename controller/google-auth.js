var config = require('config');
var request = require('request-promise');
var google = require('googleapis');
var Bluebird = require('bluebird');

var googleAuth = exports;

googleAuth.getAuthUrl = () => {
  var oauth2Client = googleAuth.getOAuthClient();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: config.get('google.scope'),
    hd: '7hci.com'
  });
};

googleAuth.getAccessToken = (credentials) => {
  var oauth2Client = googleAuth.getOAuthClient();
  oauth2Client.setCredentials(credentials);
  return oauth2Client.getAccessTokenAsync();
};

googleAuth.getOAuthClient = () => {
  var oauth = new google.auth.OAuth2(
    config.get('google.clientId'),
    config.get('google.clientSecret'),
    config.get('google.redirectUri')
  );
  return Bluebird.promisifyAll(oauth);
};

googleAuth.authenticateSession = (req, res, next) => {
  if ('tokens' in req.session) {
    googleAuth.getAccessToken(req.session.tokens)
      .then(function (token) {
        return googleAuth.getUserInfo(token)
      })
      .then(function (info) {
        var user_email = info.emailAddress;
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

googleAuth.getUserInfo = (access_token) => {
  var profile_url = 'https://www.googleapis.com/gmail/v1/users/me/profile';
  return request.get({url: profile_url, qs: {access_token: access_token}, json: true});
};

googleAuth.hasValidDomain = (emailAddress) => {
  return emailAddress.split('@')[1].toLowerCase() === '7hci.com';
};