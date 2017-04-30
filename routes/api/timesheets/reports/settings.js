/**
 * @fileOverview Router that handles all requests to settings endpoint
 */
const express = require('express');
const models = require('../../../../models/index');
const Bluebird = require('bluebird');

const router = express.Router();

router.post('/', (req, res) => {
  const objects = [];
  Object.keys(req.query).forEach((key) => {
    objects.push({ key, value: req.query[key] });
  });

  Bluebird.map(Object.keys(req.query), key =>
    models.TimesheetReportConfig.upsert({ key, value: req.query[key] }))
    .then(() => models.TimesheetReportConfig.findAll())
    .then(data => res.send(data)
    )
    .catch((err) => {
      res.send(err);
    });
});

router.get('/', (req, res) => {
  models.TimesheetReportConfig
    .findAll({
      attributes: ['key', 'value']
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
