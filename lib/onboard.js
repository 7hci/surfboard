/**
 * @fileOverview Handles requests relating to onboarding tasks
 */
const _ = require('lodash');
const logger = require('log4js').getLogger('app');
const Bluebird = require('bluebird');
const crypto = require('crypto');
const models = require('../models');
const Contractor = require('../classes/contractor');
const drive = require('./drive');
const trello = require('./trello');
const gmail = require('./gmail');
const slack = require('./slack');
const domain = require('./domain');
const clicktime = require('./clicktime');

const onboard = exports;

/**
 * Returns all new hires currently being onboarded
 * @param socket
 */
onboard.getAll = (socket) => {
  models.NewHire.findAll()
    .then((results) => {
      socket.emit('new_hires', results);
    });
};

/**
 * Returns a specific new hire by id
 * @param socket
 */
onboard.getById = (socket, id) => {
  models.NewHire.findById(id)
    .then((results) => {
      socket.emit('new_hire', results);
    });
};

/**
 * Adds new hire information to database, starting onboarding process
 * @param socket
 * @param formArray array of form input values
 * @param credentials Google auth credentials stored in the user's sessions
 */
onboard.addHire = (socket, formArray, credentials) => {
  const formData = _.reduce(formArray, (result, object) => {
    // eslint-disable-next-line no-param-reassign
    result[object.name] = object.value;
    return result;
  }, {});

  const firstName = formData.firstName;
  const lastName = formData.lastName;
  const isResident = 'resident' in formData;
  const email = formData.email;
  const override = formData.override;
  const id = crypto.createHash('md5').update(email).digest('hex');

  models.NewHire.create({
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
      socket.emit('step_done', 1, newHire);
    } else {
      throw new Error('Failed to add new hire to database.');
    }
  }).catch((err) => {
    logger.error(err);
    socket.emit('server_error');
  });
};

/**
 * Changes onboarding step for new hire
 * @param socket
 * @param newHire object with new hire info saved to database
 * @param step the step being skipped to
 */
onboard.skipStep = (socket, newHire, step) => {
  models.NewHire.update({ step }, { where: { id: newHire.id } })
    .then(() => {
      socket.emit('step_done', step - 1);
    })
    .catch((err) => {
      logger.error(err);
      socket.emit('server_error');
    });
};

/**
 * Renders results of completed onboarding tasks
 * @param socket
 * @param formArray array of form input values
 * @param newHire object with new hire info saved to database
 * @param credentials Google auth credentials stored in the user's sessions
 */
onboard.run = (socket, formArray, newHire, credentials) => {
  const formData = _.reduce(formArray, (result, object) => {
    // eslint-disable-next-line no-param-reassign
    result[object.name] = object.value;
    return result;
  }, {});

  const contractor = new Contractor(newHire);

  onboard.runCheckedTasks(socket, formData, credentials, contractor)
    .then(() => {
      models.NewHire.update({ step: 6 }, { where: { id: newHire.id } });
    })
    .then(() => {
      socket.emit('finish');
    })
    .catch((err) => {
      logger.error(err);
      socket.emit('server_error');
    });
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

/**
 * Completes onboarding, removing new hire from database
 * @param socket
 * @param newHire object with new hire info saved to database
 */
onboard.complete = (socket, newHire) => {
  models.NewHire.destroy({ where: { id: newHire.id } })
    .then(() => {
      socket.emit('completed_onboarding');
    })
    .catch((err) => {
      logger.error(err);
      socket.emit('server_error');
    });
};
