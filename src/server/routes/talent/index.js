/**
 * @fileOverview Route that renders the talent route
 * NOTE: This endpoint is accessible without authentication
 */

const express = require('express');
const models = require('../../db/models');
const contract = require('./contract');

const router = express.Router();

router.get('/info/:id', (req, res) => {
  models.NewHire.findById(req.params.id)
    .then((newHire) => {
      if (newHire) {
        res.json(newHire);
      } else {
        res.json({ error: 'That id was not found!' });
      }
    });
});

router.use('/contract', contract);

router.get('/', (req, res) => {
  res.render('index.html');
});

module.exports = router;
