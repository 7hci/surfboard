let _ = require('lodash');

let Contractor = require('../model/contractor.js');
let drive = require('../helper/drive');
let trello = require('../helper/trello');
let gmail = require('../helper/gmail');
let slack = require('../helper/slack');
let domain = require('../helper/domain');

let onboard = exports;

onboard.captureContractorInfo = (formData) => {
  let firstName = formData.firstName;
  let lastName = formData.lastName;
  let isResident = 'resident' in formData;
  let privateEmail = formData.email;

  return new Contractor(firstName, lastName, isResident, privateEmail);
};

onboard.runCheckedTasks = (checkedTasks, contractor) => {
  let taskMap = {
    'sendLoginEmail': gmail.sendLoginEmail,
    'sendDriveEmail': gmail.sendDriveEmail,
    'addAndShareDriveFolder': drive.addAndShareDriveFolder,
    'inviteToSlack': slack.inviteToSlack,
  };
  let tasksAfterEmailCreation =
    _.reduce(checkedTasks, (result, value, key) => {
      if (taskMap[key]) {
        let curried = _.curry(taskMap[key]);
        result.push(curried(contractor));
      }
      return result;
    }, []);
  let tasksToRun = [];
  if ('createContractorEmail' in checkedTasks) {
    tasksToRun.push(domain.createContractorEmail(contractor)
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
    tasksToRun.push(trello.createTrelloBoard(contractor));
  }

  return Promise.all(tasksToRun)
    .then(function (results) {
      return _.flattenDeep(results);
    })
};

onboard.route = (req, res) => {
  let contractor = onboard.captureContractorInfo(req.body);

  console.log('called onboard');

  onboard.runCheckedTasks(req.body, contractor)
    .then(function (results) {
      res.render('index.html', {messages: results, contractor: contractor})
    })
    .catch(function (err) {
      res.render('error.html', {error: err});
    });
};
