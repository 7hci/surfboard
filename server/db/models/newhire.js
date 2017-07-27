const Bluebird = require('bluebird');
const fs = Bluebird.promisifyAll(require('fs'));
const path = require('path');
const crypto = require('crypto');
const { reduce } = require('lodash');
const logger = require('../../logger');
const appsScripts = require('../../lib/apps-scripts');
const drive = require('../../lib/drive');
const trello = require('../../lib/trello');
const gmail = require('../../lib/gmail');
const slack = require('../../lib/slack');
const domain = require('../../lib/domain');
const clicktime = require('../../lib/clicktime');

module.exports = (sequelize, DataTypes) => {
  const NewHire = sequelize.define('NewHire', {
    id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    firstName: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'last_name'
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'email'
    },
    override: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'override'
    },
    isResident: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'resident'
    },
    step: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'step'
    },
    contractId: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'contract_id'
    },
    folderId: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'folder_id'
    },
    credentials: {
      type: DataTypes.JSONB,
      allowNull: false,
      field: 'credentials'
    }
  });

  /**
   * Adds new hire information to database, starting onboarding process
   * @param {Object} formData form input values
   * @param {Object} credentials Google auth credentials stored in the user's sessions
   */
  NewHire.add = (formData, credentials) => {
    const { firstName, lastName, email, override } = formData;
    const isResident = 'resident' in formData;
    const id = crypto.createHash('md5').update(email).digest('hex');

    return NewHire.create({
      id,
      firstName,
      lastName,
      email,
      isResident,
      override,
      credentials,
      step: 2
    }).then(newHire => newHire.get({ plain: true }))
      .catch(logger.reject);
  };

  /**
   * Changes onboarding step for new hire
   * @param {string} id new hire id
   * @param {number} step the step being skipped to
   */
  NewHire.skipStep = (id, step) =>
    NewHire.update({ step }, { where: { id } })
      .then(() => true)
      .catch(logger.reject);

  /**
   * Completes onboarding, removing new hire from database
   * @param {string} id new hire id
   */
  NewHire.complete = id =>
    NewHire.destroy({ where: { id } })
      .then(() => true)
      .catch(logger.reject);

  /**
   * Send the new hire a link to their contract
   * @param {Object} formData form input values
   * @param {String} id new hire id
   * @param {Object} credentials Google auth credentials stored in the user's sessions
   */
  NewHire.sendContract = (formData, id, credentials) =>
    NewHire.findById(id)
      .then(newHire => gmail.sendContract(formData, newHire, credentials))
      .then(() => true)
      .catch(logger.reject);

  /**
   * Runs apps script that fills in contract
   * @param {Object} formData form input values
   * @param {string} id new hire id
   */
  NewHire.previewContract = (formData, id) =>
    NewHire.findById(id)
      .then(newHire => appsScripts.preview(formData, newHire))
      .catch(logger.reject);

  /**
   * Updates database to show that contract is ready for approval and cleans up uploaded files
   * @param id new hire id
   */
  NewHire.submitContract = id => NewHire.update({ step: 4 }, { where: { id } })
    .then(() => fs.unlinkAsync(path.join(__dirname, '..', '..', '..', 'public', 'upload', `${id}.bmp`)))
    .then(() => true)
    .catch(logger.reject);

  /**
   * Runs apps script that finalizes completed contract
   * @param id new hire id
   * @param credentials Google auth credentials stored in the user's sessions
   */
  NewHire.acceptContract = (id, credentials) =>
    NewHire.findById(id)
      .then(newHire => appsScripts.accept(newHire, credentials))
      .then(() => NewHire.update({ step: 5 }, { where: { id } }))
      .then(() => true)
      .catch(logger.reject);

  /**
   * Runs onboarding tasks and emits their results through the passed in socket
   * @param socket
   * @param formData form input values
   * @param id new hire id
   * @param credentials Google auth credentials stored in the user's sessions
   */
  NewHire.onboard = (socket, formData, id, credentials) => {
    NewHire.findById(id)
      .then(newHire => newHire._runCheckedTasks(socket, formData, credentials)
      .then(() => {
        newHire.set('step', 6);
        return newHire.save();
      })
      .then(() => { socket.emit('finish'); })
      .catch((err) => {
        logger.log(err.message);
        socket.emit('server_error');
      }));
  };

  NewHire.prototype._runCheckedTasks = async function _runCheckedTasks(socket, checkedTasks, credentials) {
    // These are the tasks that should only run after a company e-mail is created
    const taskMap = {
      sendLoginEmail: gmail.sendLoginEmail,
      sendWelcomeEmail: gmail.sendWelcomeEmail,
      addAndShareDriveFolder: drive.addAndShareDriveFolder,
      inviteToSlack: slack.inviteToSlack,
      addUserToClickTime: clicktime.addUserToClickTime
    };
    const tasksAfterEmailCreated = () => Bluebird.try(() => {
      if ('createContractorEmail' in checkedTasks) domain.createContractorEmail(this, socket, credentials);
    }).then(() => Bluebird.all(reduce(checkedTasks, (memo, value, key) => {
      if (taskMap[key] && value) {
        memo.push(taskMap[key].call(taskMap[key], this, socket, credentials));
      }
      return memo;
    }, [])));
    // We don't include trello in the above tasks because it can run parallel to them
    const trelloTask = () => 'createTrelloBoard' in checkedTasks
      ? trello.createTrelloBoard(this, socket, credentials)
      : Promise.resolve();
    return Bluebird.all([tasksAfterEmailCreated(), trelloTask()]);
  };

  NewHire.prototype.getEmail = function getEmail() {
    if (this.override) {
      return `${this.override.replace(' ', '')}@7hci.com`;
    }
    const pattern = /[^a-zA-Z]/g;
    const sanitizedFirst = this.firstName.replace(pattern, '').toLowerCase();
    const sanitizedLast = this.lastName.replace(pattern, '').toLowerCase();

    return `${sanitizedFirst}.${sanitizedLast}@7hci.com`;
  };

  NewHire.prototype.getPassword = function getPassword() {
    return crypto.createHash('md5').update(this.getFullName()).digest('hex');
  };

  NewHire.prototype.getFullName = function getFullName() {
    return `${this.firstName} ${this.lastName}`;
  };

  return NewHire;
};
