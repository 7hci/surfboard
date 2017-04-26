/**
 * @fileOverview Main router that handles all requests
 */
const express = require('express');
const main = require('./main');
const onboard = require('./onboard');
const redirect = require('./redirect');
const mock = require('./mock-api');
const googleAuth = require('../controller/google-auth');

const router = express.Router();

// Only enable route for mock api calls if we're testing
if (process.env.NODE_ENV === 'testing') {
  router.use('/mock-api/', mock.route);
}

router.get('/oauth2callback', redirect.route);
// Authenticate all routes below using middleware
router.use(googleAuth.authenticateSession);
router.post('/onboard', onboard.route);
router.get('/', main.route);

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

module.exports = router;
