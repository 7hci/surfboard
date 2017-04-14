let auth = require('../helper/auth.js');

let redirect = exports;

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