/**
 * @fileOverview Route that handles callback during Google OAuth2 authentication process
 */
let auth = require('../helper/auth.js');
let redirect = exports;

/**
 * Gets access token info by passing the "code" returned by Google to the OAuthClient and saves it to the user's session
 * @param req
 * @param res
 */
redirect.route = (req, res) => {
  let oauth2Client = auth.getOAuthClient();
  let code = req.query.code;
  oauth2Client.getTokenAsync(code)
    .then(function (tokens) {
      oauth2Client.setCredentials(tokens);
      req.session['tokens'] = tokens;
      res.redirect('/');
    })
    .catch(function (error) {
      res.render('error.html', {error: error});
    });
};