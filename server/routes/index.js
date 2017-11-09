/**
 * @fileOverview Main router that handles all requests
 */
const express = require('express');
const path = require('path');
const googleAuth = require('../lib/google-auth');
const graphql = require('../graphql');
const redirect = require('./redirect');
const { graphiqlExpress } = require('graphql-server-express');
const { apolloUploadExpress } = require('apollo-upload-server');

const router = express.Router();
const upload = apolloUploadExpress({ uploadDir: path.join(__dirname, '..', '..', 'public', 'upload') });

if (process.env.NODE_ENV === 'development') router.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

router.use('/graphql', upload, graphql);
router.get('/oauth2callback', redirect.route);
router.get('/talent', (req, res) => { res.render('index.html'); });
// Authenticate all routes with Google OAuth below using middleware
router.use(googleAuth.authenticateSession);
router.get('/admin', (req, res) => { res.render('index.html'); });
router.get('/', (req, res) => { res.redirect('/admin'); });

module.exports = router;
