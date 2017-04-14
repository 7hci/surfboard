let express = require('express');
let router = express.Router();
let main = require('./main');
let onboard = require('./onboard');
let redirect = require('./redirect');
let auth = require('../helper/auth');

router.route('/oauth2callback').get(redirect.route);
router.use( auth.authenticateSession );
router.route('/onboard').post(onboard.route);
router.route('/').get(main.route);

router.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

module.exports = router;