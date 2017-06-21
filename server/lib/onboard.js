/**
 * @fileOverview Handles requests relating to onboarding tasks
 */
const _ = require('lodash');
const logger = require('log4js').getLogger('app');
const Bluebird = require('bluebird');
const crypto = require('crypto');
const models = require('../db/models');
const Contractor = require('../classes/contractor');
const drive = require('./drive');
const trello = require('./trello');
const gmail = require('./gmail');
const slack = require('./slack');
const domain = require('./domain');
const clicktime = require('./clicktime');

const onboard = exports;

/**
 * Adds new hire information to database, starting onboarding process
 * @param formData form input values
 * @param credentials Google auth credentials stored in the user's sessions
 */
onboard.addHire = (formData, credentials) => {
  const { firstName, lastName, email, override } = formData;
  const isResident = 'resident' in formData;
  const id = crypto.createHash('md5').update(email).digest('hex');

  return models.NewHire.create({
    id,
    firstName,
    lastName,
    email,
    isResident,
    override,
    credentials,
    step: 2
  }).then((newHire) => {
    if (newHire) {
      return { newHire };
    }
    throw new Error('Failed to add new hire to database.');
  }).catch((err) => {
    logger.error(err);
    return { error: `Server returned error: ${err.message}` };
  });
};

/**
 * Changes onboarding step for new hire
 * @param id new hire id
 * @param step the step being skipped to
 */
onboard.skipStep = (id, step) =>
  models.NewHire.update({ step }, { where: { id } })
    .then(newHire => newHire)
    .catch((err) => {
      logger.error(err);
      return { error: err.message };
    });

/**
 * Renders results of completed onboarding tasks
 * @param socket
 * @param formData form input values
 * @param id new hire id
 * @param credentials Google auth credentials stored in the user's sessions
 */
onboard.run = (socket, formData, id, credentials) =>
  models.NewHire.findById(id)
    .then((newHire) => {
      const contractor = new Contractor(newHire);
      onboard.runCheckedTasks(socket, formData, credentials, contractor)
        .then(() => {
          models.NewHire.update({ step: 6 }, { where: { id: newHire.id } });
        })
        .then(() => { socket.emit('finish'); })
        .catch((err) => {
          logger.error(err);
          socket.emit('server_error');
        });
    });

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
      if (taskMap[key] && value) {
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

/**
 * Completes onboarding, removing new hire from database
 * @param id new hire id
 */
onboard.complete = id =>
  models.NewHire.destroy({ where: { id } })
    .then(() => ({ status: 'done' }))
    .catch((err) => {
      logger.error(err);
      return { error: err.message };
    });
