/**
 * @fileOverview Route that renders the talent route
 */

const express = require('express');
const models = require('../models');

const router = express.Router();

router.get('/:id', (req, res) => {
  models.NewHire.findById(req.params.id)
    .then((newHire) => {
      if (newHire) {
        res.render('talent.html', {
          credentials: JSON.stringify(newHire.credentials),
          firstName: newHire.firstName,
          lastName: newHire.lastName,
          email: newHire.email,
          id: req.params.id
        });
      } else {
        res.send('That id was not found!');
      }
    });
});

module.exports = router;
