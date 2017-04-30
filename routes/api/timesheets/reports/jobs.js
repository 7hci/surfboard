/**
 * @fileOverview Router that handles all requests to jobs endpoint
 */
const express = require('express');
const Bluebird = require('bluebird');
const models = require('../../../../models/index');

const router = express.Router();

router.post('/', (req, res) => {
  if (req.query.description && req.query.recipients && req.query.projectIds) {
    const description = req.query.description;
    const recipients = req.query.recipients.split(',');
    const projectIds = req.query.projectIds.split(',');
    let cc = [];
    if (req.query.cc) cc = req.query.cc.split(',');

    Bluebird.all([
      models.TimesheetReport.create({ description, recipients, cc }),
      Bluebird.map(projectIds, id => models.Project.findById(parseInt(id, 10)))
    ]).then((results) => {
      const report = results[0];
      const projects = results[1];
      return Bluebird
        .filter(projects, project => (project !== null))
        .then(actualProjects => report.setProjectsToInclude(actualProjects))
        .then(() => {
          res.send(report);
        });
    }).catch((err) => {
      res.send(err);
    });
  } else {
    res.send('Error: Missing one or more parameters');
  }
});

router.get('/', (req, res) => {
  models.TimesheetReport
    .findAll({
      attributes: [
        'id', 'description', 'recipients', 'cc'
      ],
      include: [
        { model: models.Project,
          as: 'projectsToInclude',
          attributes: ['id', 'name']
        }
      ]
    })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
