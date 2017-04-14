var express = require('express');
var router = express.Router();
var main = require('./main');
var onboard = require('./onboard');
var redirect = require('./redirect');
var mock = require('./mock-api');
var auth = require('../helper/auth');

if (process.env.NODE_ENV === 'testing') router.route('/mock-api').get(mock.route);

router.route('/oauth2callback').get(redirect.route);
router.use( auth.authenticateSession );
router.route('/onboard').post(onboard.route);
router.route('/').get(main.route);

router.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

module.exports = router;