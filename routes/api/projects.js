/**
 * @fileOverview Router that handles all requests to projects endpoint
 */
const express = require('express');
const models = require('../../models');

const router = express.Router();

router.post('/', (req, res) => {
  const name = req.query.name;

  if (name) {
    models.Project
      .create({ name })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.send(err);
      });
  } else {
    res.send('Error: Missing "name" parameter');
  }
});

router.get('/', (req, res) => {
  models.Project
    .findAll({
      attributes: ['id', 'name']
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
