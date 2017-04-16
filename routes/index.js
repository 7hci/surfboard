var express = require('express');
var router = express.Router();
var main = require('./main');
var onboard = require('./onboard');
var redirect = require('./redirect');
var mock = require('./mock-api');
var auth = require('../helper/auth');

if (process.env.NODE_ENV === 'testing'){
  router.post('/mock-api/*', mock.route);
  router.get('/mock-api/*', mock.route);
}

router.get('/oauth2callback', redirect.route);
// Authenticate all routes below
router.use( auth.authenticateSession );
router.post('/onboard', onboard.route);
router.get('/', main.route);

router.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

module.exports = router;