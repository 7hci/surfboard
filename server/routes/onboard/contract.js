/**
 * @fileOverview Router that handles all requests to contract endpoint
 */
const express = require('express');
const contract = require('../../lib/contract');
const gmail = require('../../lib/gmail');

const router = express.Router();

router.post('/send', (req, res) => {
  gmail.sendContract(req.body, req.query.id, req.session.tokens)
    .then(result => res.send(result));
});

router.post('/accept', (req, res) => {
  contract.accept(req.query.id, req.session.tokens)
    .then((result) => { console.log('route', result); res.send(result); });
});

module.exports = router;
