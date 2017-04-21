/**
 * @fileOverview Main router that handles all requests
 */
let express = require('express');
let router = express.Router();
let main = require('./main');
let onboard = require('./onboard');
let redirect = require('./redirect');
let mock = require('./mock-api');
let auth = require('../controller/auth');

// Only enable route for mock api calls if we're testing
if (process.env.NODE_ENV === 'testing'){
  router.use('/mock-api/', mock.route);
}

router.get('/oauth2callback', redirect.route);
// Authenticate all routes below using middleware
router.use( auth.authenticateSession );
router.post('/onboard', onboard.route);
router.get('/', main.route);

router.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

module.exports = router;