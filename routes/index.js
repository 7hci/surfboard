/**
 * @fileOverview Main router that handles all requests
 */
const express = require('express');
const main = require('./main');
const talent = require('./talent');
const redirect = require('./redirect');
const api = require('./api');
const googleAuth = require('../lib/google-auth');

const router = express.Router();

router.get('/oauth2callback', redirect.route);
router.use('/api', api);
router.use('/talent', talent);
// Authenticate all routes with Google OAuth below using middleware
router.use(googleAuth.authenticateSession);
router.get('/', main.route);

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

module.exports = router;
