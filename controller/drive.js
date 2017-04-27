/**
 * @fileOverview Handles all calls to Google's Drive API
 */
const request = require('request-promise').defaults({ simple: false });
const config = require('config');
const logger = require('log4js').getLogger('app');
const googleAuth = require('./google-auth');
const Bluebird = require('bluebird');

const drive = exports;

/**
 * Main function called to create the folder, add the necessary files
 * and share the folder with the contractor
 * @param contractor
 * @param credentials Google auth credentials stored in the user's sessions
 * @returns success/failure status object
 */
drive.addAndShareDriveFolder = (contractor, credentials) => {
  drive.createFolder(contractor, credentials)
    .then((folderId) => {
      const toDoAfterFolderCreated = [
        drive.shareFolder(contractor, credentials, folderId),
        drive.addFile(contractor, credentials, config.get('drive.files.directDeposit'), folderId),
        drive.addFile(contractor, credentials, config.get('drive.files.bgCheck'), folderId)
      ];
      if (contractor.isResident) {
        toDoAfterFolderCreated.push(
          drive.addFile(contractor, credentials, config.get('drive.files.w9'), folderId));
      } else {
        toDoAfterFolderCreated.push(
          drive.addFile(contractor, credentials, config.get('drive.files.w8'), folderId));
      }
      return Bluebird.all(toDoAfterFolderCreated);
    })
    .then(() => {
      logger.info('Created and shared Drive folder');
      return { text: 'Created and shared Drive folder', status: 'success' };
    })
    .catch((err) => {
      logger.error(err);
      return { text: 'Problem creating and sharing Drive folder', status: 'failure' };
    });
};

/**
 * Helper function to create the folder
 * @param contractor
 * @param credentials Google auth credentials stored in the user's sessions
 * @returns created folder id
 * @throws error if no folder is created
 */
drive.createFolder = (contractor, credentials) => {
  const driveUrl = `${config.get('google.baseUrl')}/drive/v3/files`;

  return googleAuth.getAccessToken(credentials)
    .then(token => request.post({
      url: driveUrl,
      qs: { access_token: token },
      json: true,
      body: {
        name: contractor.getFullName(),
        parents: [config.get('drive.folders.contractors')],
        mimeType: 'application/vnd.google-apps.folder'
      }
    }))
    .then((response) => {
      const fileData = response;
      if ('id' in fileData) {
        return fileData.id;
      }
      throw new Error(`No id in create folder response: ${fileData}`);
    });
};

/**
 * Helper function to make the folder available to the contractor
 * @param contractor
 * @param credentials Google auth credentials stored in the user's sessions
 * @param folderId id of folder to share
 * @returns shared folder id
 * @throws error if folder is not shared
 */
drive.shareFolder = (contractor, credentials, folderId) => {
  const driveUrl = `${config.get('google.baseUrl')}/drive/v3/files/${folderId}/permissions`;

  return googleAuth.getAccessToken(credentials)
    .then(token => request.post({
      url: driveUrl,
      qs: {
        access_token: token,
        sendNotificationEmail: true
      },
      json: true,
      body: {
        type: 'user',
        role: 'writer',
        emailAddress: contractor.getEmail()
      }
    }))
    .then((response) => {
      const fileData = response;
      if ('id' in fileData) {
        return fileData.id;
      }
      throw new Error(`No id in share folder response: ${fileData}`);
    });
};

/**
 * Helper function to copy a file and then move to the copy to a folder
 * @param contractor
 * @param credentials Google auth credentials stored in the user's sessions
 * @param file An object representing the file to be copied/moved
 * @param folderId The id of the folder the file is being added to
 * @returns the id of the file that was added
 * @throws error if the file was not added
 */
drive.addFile = (contractor, credentials, file, folderId) => {
  const driveUrl = `${config.get('google.baseUrl')}/drive/v3/files/${file.id}/copy`;

  return googleAuth.getAccessToken(credentials)
    .then(token => request.post({
      url: driveUrl,
      qs: { access_token: token },
      json: true,
      body: {
        name: file.name,
        parents: [folderId]
      }
    }))
    .then((response) => {
      const fileData = response;
      if ('id' in fileData) {
        return fileData.id;
      }
      throw new Error(`No id in copy file response: ${fileData}`);
    });
};

/**
 * Helper function to retrieve a list of tasks from a spreadsheet on the Drive
 * @param credentials Google auth credentials stored in the user's sessions
 * @returns an array of CSV strings representing the tasks
 * @throws error if the tasks could not be retrieved
 */
drive.getTasksFromFile = (credentials) => {
  const driveUrl = `${config.get('google.baseUrl')}/drive/v3/files/${config.get('drive.files.task.id')}/export`;

  return googleAuth.getAccessToken(credentials)
    .then(token => request.get({
      url: driveUrl,
      qs: {
        access_token: token,
        mimeType: 'text/csv'
      },
      json: true
    }))
    .then((response) => {
      const fileData = String(response);
      if (fileData.indexOf(',') > -1) {
        return fileData.match(/[^\r\n]+/g);
      }
      throw new Error(`Did not return CSV: ${fileData}`);
    });
};

