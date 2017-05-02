/**
 * @fileOverview Kicks off any onboarding tasks selected by the user
 */
const _ = require('lodash');
const logger = require('log4js').getLogger('app');
const Bluebird = require('bluebird');

const Contractor = require('../classes/contractor');
const drive = require('./drive');
const trello = require('./trello');
const gmail = require('./gmail');
const slack = require('./slack');
const domain = require('./domain');
const clicktime = require('./clicktime');

const onboard = exports;

/**
 * Renders results of completed onboarding tasks
 * @param socket
 * @param formArray array of form input values
 * @param credentials Google auth credentials stored in the user's sessions
 */
onboard.run = (socket, formArray, credentials) => {
  const formData = _.reduce(formArray, (result, object) => {
    // eslint-disable-next-line no-param-reassign
    result[object.name] = object.value;
    return result;
  }, {});

  const contractor = onboard.captureContractorInfo(formData);

  onboard.runCheckedTasks(socket, formData, credentials, contractor)
    .then(() => {
      socket.emit('finish', 'Done!');
    })
    .catch((err) => {
      logger.error(err);
      // TODO: Communicate error occurred via socket
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
 * @param socket
 * @param checkedTasks form inputs
 * @param credentials Google auth credentials stored in the user's sessions
 * @param contractor
 * @returns {Promise} Resolved with an array of objects
 * representing the success/failure status of each checked task
 */
onboard.runCheckedTasks = (socket, checkedTasks, credentials, contractor) => {
  // Map identifying any functions that should only be ran *after* the createEmail task is complete
  const taskMap = {
    sendLoginEmail: gmail.sendLoginEmail,
    sendWelcomeEmail: gmail.sendWelcomeEmail,
    addAndShareDriveFolder: drive.addAndShareDriveFolder,
    inviteToSlack: slack.inviteToSlack,
    addUserToClickTime: clicktime.addUserToClickTime
  };
  const tasksAfterEmailCreation =
    _.reduce(checkedTasks, (result, value, key) => {
      if (taskMap[key]) {
        const task = taskMap[key].call(taskMap[key], contractor, socket, credentials);
        result.push(task);
      }
      return result;
    }, []);
  const tasksToRun = [];
  if ('createContractorEmail' in checkedTasks) {
    tasksToRun.push(domain.createContractorEmail(contractor, socket, credentials)
      .then(addedEmail => Bluebird.all(tasksAfterEmailCreation)
          .then((selectedTasksCompleted) => {
            selectedTasksCompleted.push(addedEmail);
            return selectedTasksCompleted;
          })));
  } else {
    tasksToRun.push(Bluebird.all(tasksAfterEmailCreation));
  }
  if ('createTrelloBoard' in checkedTasks) {
    tasksToRun.push(trello.createTrelloBoard(contractor, socket, credentials));
  }

  return Bluebird.all(tasksToRun)
    .then(results => _.flattenDeep(results));
};
