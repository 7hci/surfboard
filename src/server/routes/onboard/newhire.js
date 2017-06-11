/**
 * @fileOverview Router that handles all requests to newhire endpoint
 */
const express = require('express');
const models = require('../../db/models');

const router = express.Router();

router.get('/', (req, res) => {
  models.NewHire.findAll()
    .then((newHires) => {
      if (newHires) {
        res.json(newHires);
      } else {
        res.json({ error: 'No new hires found.' });
      }
    });
});

router.get('/:id', (req, res) => {
  models.NewHire.findById(req.params.id)
    .then((newHire) => {
      if (newHire) {
        res.json(newHire);
      } else {
        res.json({ error: `The id ${req.params.id} was not found!` });
      }
    });
});

module.exports = router;
