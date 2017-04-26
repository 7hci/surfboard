/**
 * @fileOverview Kicks off any onboarding tasks selected by the user
 */
const _ = require('lodash');
const logger = require('log4js').getLogger('app');
const Bluebird = require('bluebird');

const Contractor = require('../model/contractor.js');
const drive = require('../controller/drive');
const trello = require('../controller/trello');
const gmail = require('../controller/gmail');
const slack = require('../controller/slack');
const domain = require('../controller/domain');
const clicktime = require('../controller/clicktime');

const onboard = exports;

/**
 * Renders results of completed onboarding tasks
 * @param req
 * @param res
 */
onboard.route = (req, res) => {
  const contractor = onboard.captureContractorInfo(req.body);

  onboard.runCheckedTasks(req, contractor)
    .then((results) => {
      res.render('index.html', { messages: results, contractor });
    })
    .catch((err) => {
      logger.error(err);
      res.render('error.html', { error: err });
    });
};

/**
 * Constructs new Contractor instance based on form data in the request
 * @param formData The body of the routed request
 * @returns {Contractor} Contractor instance representing all info about the person being onboarded
 */
onboard.captureContractorInfo = (formData) => {
  const firstName = formData.firstName;
  const lastName = formData.lastName;
  const isResident = 'resident' in formData;
  const privateEmail = formData.email;
  const override = formData.override;

  return new Contractor(firstName, lastName, isResident, privateEmail, override);
};

/**
 * Checks which tasks need to be ran based on the form data and queues them up appropriately
 * @param request
 * @param contractor
 * @returns {Promise} Resolved with an array of objects
 * representing the success/failure status of each checked task
 */
onboard.runCheckedTasks = (request, contractor) => {
  const checkedTasks = request.body;
  // Google credentials we stored in our session that we pass to our task-specific functions
  const credentials = request.session.tokens;
  // Map identifying any functions that should only be ran *after* the createEmail task is complete
  const taskMap = {
    sendLoginEmail: gmail.sendLoginEmail,
    sendDriveEmail: gmail.sendDriveEmail,
    addAndShareDriveFolder: drive.addAndShareDriveFolder,
    inviteToSlack: slack.inviteToSlack,
    addUserToClickTime: clicktime.addUserToClickTime
  };
  const tasksAfterEmailCreation =
    _.reduce(checkedTasks, (result, value, key) => {
      if (taskMap[key]) {
        // eslint-disable-next-line
        let task = taskMap[key].call(task, contractor, credentials);
        result.push(task);
      }
      return result;
    }, []);
  const tasksToRun = [];
  if ('createContractorEmail' in checkedTasks) {
    tasksToRun.push(domain.createContractorEmail(contractor, credentials)
      .then(addedEmail => Bluebird.all(tasksAfterEmailCreation)
          .then((selectedTasksCompleted) => {
            selectedTasksCompleted.push(addedEmail);
            return selectedTasksCompleted;
          })));
  } else {
    tasksToRun.push(Bluebird.all(tasksAfterEmailCreation));
  }
  if ('createTrelloBoard' in checkedTasks) {
    tasksToRun.push(trello.createTrelloBoard(contractor, credentials));
  }

  return Bluebird.all(tasksToRun)
    .then(results => _.flattenDeep(results));
};
