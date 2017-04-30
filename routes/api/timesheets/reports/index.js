/**
 * @fileOverview Main router that handles all requests to reports endpoint
 */
const express = require('express');
const jobs = require('./jobs');
const settings = require('./settings');

const router = express.Router();

router.use('/jobs', jobs);
router.use('/settings', settings);

module.exports = router;
