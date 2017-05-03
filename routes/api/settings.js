/**
 * @fileOverview Router that handles all requests to settings endpoint
 */
const express = require('express');
const models = require('../../models/index');
const _ = require('lodash');

const router = express.Router();

router.get('/', (req, res) => {
  models.Setting
    .findAll()
    .then((results) => {
      const data = _.reduce(results, (accumulator, object) => {
        // eslint-disable-next-line no-param-reassign
        accumulator[object.key] = object.value;
        return accumulator;
      }, {});
      // TODO: Add personnel to data object
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
