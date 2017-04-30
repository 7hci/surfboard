/**
 * @fileOverview Main router that handles all requests to timesheets endpoint
 */
const express = require('express');
const reports = require('./reports');

const router = express.Router();

router.use('/reports', reports);

module.exports = router;
