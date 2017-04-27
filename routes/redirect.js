/**
 * @fileOverview Route that handles callback during Google OAuth2 authentication process
 */
const googleAuth = require('../controller/google-auth.js');
const logger = require('log4js').getLogger('app');

const redirect = exports;

/**
 * Gets access token info by passing the "code" returned by Google to the OAuthClient
 * and saves it to the user's session
 * @param req
 * @param res
 */
redirect.route = (req, res) => {
  const oauth2Client = googleAuth.getOAuthClient();
  const code = req.query.code;
  oauth2Client.getTokenAsync(code)
    .then((tokens) => {
      oauth2Client.setCredentials(tokens);
      req.session.tokens = tokens;
      res.redirect('/');
    })
    .catch((err) => {
      logger.error(err);
      res.render('error.html', { error: err });
    });
};
