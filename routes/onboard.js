var _ = require('lodash');

var Contractor = require('../model/contractor.js');
var drive = require('../helper/drive');
var trello = require('../helper/trello');
var gmail = require('../helper/gmail');
var slack = require('../helper/slack');
var domain = require('../helper/domain');

var onboard = exports;

onboard.captureContractorInfo = (formData) => {
  var firstName = formData.firstName;
  var lastName = formData.lastName;
  var isResident = 'resident' in formData;
  var privateEmail = formData.email;
  var override = formData.override;

  return new Contractor(firstName, lastName, isResident, privateEmail, override);
};

onboard.runCheckedTasks = (request, contractor) => {
  var checkedTasks = request.body;
  var credentials = request.session.tokens;
  var taskMap = {
    'sendLoginEmail': gmail.sendLoginEmail,
    'sendDriveEmail': gmail.sendDriveEmail,
    'addAndShareDriveFolder': drive.addAndShareDriveFolder,
    'inviteToSlack': slack.inviteToSlack,
  };
  var tasksAfterEmailCreation =
    _.reduce(checkedTasks, (result, value, key) => {
      if (taskMap[key]) {
        var curried = _.curry(taskMap[key]);
        result.push(curried(contractor, credentials));
      }
      return result;
    }, []);
  var tasksToRun = [];
  if ('createContractorEmail' in checkedTasks) {
    tasksToRun.push(domain.createContractorEmail(contractor, credentials)
      .then(function (addedEmail) {
        return Promise.all(tasksAfterEmailCreation)
          .then(function (selectedTasksCompleted) {
            selectedTasksCompleted.push(addedEmail);
            return selectedTasksCompleted;
          })
      }))
  } else {
    tasksToRun.push(Promise.all(tasksAfterEmailCreation))
  }
  if ('createTrelloBoard' in checkedTasks) {
    tasksToRun.push(trello.createTrelloBoard(contractor, credentials));
  }

  return Promise.all(tasksToRun)
    .then(function (results) {
      return _.flattenDeep(results);
    })
};

onboard.route = (req, res) => {
  var contractor = onboard.captureContractorInfo(req.body);

  onboard.runCheckedTasks(req, contractor)
    .then(function (results) {
      res.render('index.html', {messages: results, contractor: contractor})
    })
    .catch(function (err) {
      res.render('error.html', {error: err});
    });
};
