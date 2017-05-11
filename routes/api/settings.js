/**
 * @fileOverview Router that handles all requests to settings endpoint
 */
const express = require('express');
const Bluebird = require('bluebird');
const models = require('../../models');
const domain = require('../../lib/domain');
const _ = require('lodash');

const router = express.Router();

router.get('/', (req, res) => {
  const where = {};
  let includePersonnel = true;
  if (req.query.fields) {
    const fields = req.query.fields.split(',');
    includePersonnel = _.includes(fields, 'personnel');
    where.$or = _.reduce(fields, (result, field) => {
      result.push({ key: field });
      return result;
    }, []);
  }

  Bluebird.all([
    models.Setting.findAll({ where }), domain.getPersonnelInfo()])
    .then((results) => {
      const data = _.reduce(results[0], (accumulator, object) => {
        // eslint-disable-next-line no-param-reassign
        accumulator[object.key] = object.value;
        return accumulator;
      }, {});
      if (includePersonnel) data.personnel = results[1];
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
