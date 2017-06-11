/**
 * @fileOverview Main router that handles all requests
 */
const express = require('express');
const googleAuth = require('../lib/google-auth');
const api = require('./api');
const talent = require('./talent');
const onboard = require('./onboard');
const credentials = require('./credentials');
const redirect = require('./redirect');

const router = express.Router();

router.get('/oauth2callback', redirect.route);
router.use('/api', api);
router.use('/talent', talent);
// Authenticate all routes with Google OAuth below using middleware
router.use(googleAuth.authenticateSession);
router.get('/credentials', credentials.route);
router.use('/onboard', onboard);
router.get('/', (req, res) => { res.render('index.html'); });

module.exports = router;
