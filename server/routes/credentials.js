const auth = require('../lib/google-auth');

const credentials = exports;

credentials.route = (req, res) => {
  auth.getAccessToken(req.session.tokens)
    .then((token) => {
      res.json({ access_token: token });
    });
};
