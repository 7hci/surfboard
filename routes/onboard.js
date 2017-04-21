/**
 * @fileOverview Takes form input from request and kicks off any onboarding tasks selected by the user
 */
let _ = require('lodash');
let logger = require('log4js').getLogger('app');
let Bluebird = require('bluebird');

let Contractor = require('../model/contractor.js');
let drive = require('../controller/drive');
let trello = require('../controller/trello');
let gmail = require('../controller/gmail');
let slack = require('../controller/slack');
let domain = require('../controller/domain');
let clicktime = require('../controller/clicktime');

let onboard = exports;

/**
 * Renders results of completed onboarding tasks
 * @param req
 * @param res
 */
onboard.route = (req, res) => {
  let contractor = onboard.captureContractorInfo(req.body);

  onboard.runCheckedTasks(req, contractor)
    .then(function (results) {
      res.render('index.html', {messages: results, contractor: contractor})
    })
    .catch(function (err) {
      logger.error(err);
      res.render('error.html', {error: err});
    });
};

/**
 * Constructs new Contractor instance based on form data in the request
 * @param formData The body of the routed request
 * @returns {Contractor} Contractor instance representing all relevant information about the person being onboarded
 */
onboard.captureContractorInfo = (formData) => {
  let firstName = formData.firstName;
  let lastName = formData.lastName;
  let isResident = 'resident' in formData;
  let privateEmail = formData.email;
  let override = formData.override;

  return new Contractor(firstName, lastName, isResident, privateEmail, override);
};

/**
 * Checks which tasks need to be ran based on the form data and queues them up appropriately
 * @param request
 * @param contractor
 * @returns {Promise} Resolved with an array of objects representing the success/failure status of each checked task
 */
onboard.runCheckedTasks = (request, contractor) => {
  let checkedTasks = request.body;
  // Google credentials we stored in our session that we pass to our task-specific functions
  let credentials = request.session.tokens;
  // Map identifying any functions that should only be ran **after** the "create Email" task is complete
  let taskMap = {
    'sendLoginEmail': gmail.sendLoginEmail(contractor, credentials),
    'sendDriveEmail': gmail.sendDriveEmail(contractor, credentials),
    'addAndShareDriveFolder': drive.addAndShareDriveFolder(contractor, credentials),
    'inviteToSlack': slack.inviteToSlack(contractor),
    'addUserToClickTime': clicktime.addUserToClickTime(contractor)
  };
  let tasksAfterEmailCreation =
    _.reduce(checkedTasks, (result, value, key) => {
      if (taskMap[key]) {
        result.push(taskMap[key]);
      }
      return result;
    }, []);

  let tasksToRun = [];
  if ('createContractorEmail' in checkedTasks) {
    tasksToRun.push(domain.createContractorEmail(contractor, credentials)
      .then(function (addedEmail) {
        return Bluebird.all(tasksAfterEmailCreation)
          .then(function (selectedTasksCompleted) {
            selectedTasksCompleted.push(addedEmail);
            return selectedTasksCompleted;
          })
      }))
  } else {
    tasksToRun.push(Bluebird.all(tasksAfterEmailCreation))
  }
  if ('createTrelloBoard' in checkedTasks) {
    tasksToRun.push(trello.createTrelloBoard(contractor, credentials));
  }

  return Bluebird.all(tasksToRun)
    .then(function (results) {
      return _.flattenDeep(results);
    })
};
