/**
 * @fileOverview Main router that handles all requests to api endpoint
 */
const express = require('express');
const config = require('config');
const projects = require('./projects');
const timesheets = require('./timesheets');

const router = express.Router();

router.use((req, res, next) => {
  const key = req.query.key;
  if (key === config.get('api.key').toString()) {
    next();
  } else {
    res.send('Error: invalid key');
  }
});

router.use('/timesheets', timesheets);
router.use('/projects', projects);

module.exports = router;
