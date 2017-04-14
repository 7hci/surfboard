var auth = require('../helper/auth.js');

var redirect = exports;

redirect.route = (req, res, next) => {
  var oauth2Client = auth.getOAuthClient();
  var code = req.query.code;
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