/**
 * @fileOverview Main router that handles all requests to onboard endpoint
 */
const express = require('express');
const onboard = require('../../lib/onboard');
const config = require('config');
const newhire = require('./newhire');
const contract = require('./contract');

const router = express.Router();

router.post('/add', (req, res) => {
  onboard.addHire(req.body, req.session.tokens)
    .then(result => res.send(result));
});

router.post('/skip', (req, res) => {
  onboard.skipStep(req.query.id, req.query.to)
    .then(result => res.send(result));
});

router.post('/complete', (req, res) => {
  onboard.complete(req.query.id)
    .then(result => res.send(result));
});

router.get('/tasks', (req, res) => {
  res.json(config.get('tasks.formOptions'));
});

router.use('/contract', contract);
router.use('/newhire', newhire);

module.exports = router;
