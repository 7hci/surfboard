/**
 * @fileOverview Handles all calls to Google's Drive API
 */
let request = require('request-promise').defaults({simple: false});
let config = require('config');
let googleAuth = require('./google-auth');
let Bluebird = require('bluebird');

let drive = exports;

/**
 * Main function called to create the folder, add the necessary files and share the folder with the contractor
 * @param contractor
 * @param credentials Google auth credentials stored in the user's sessions
 * @returns success/failure status object
 */
drive.addAndShareDriveFolder = (contractor, credentials) => {
  return drive.createFolder(contractor, credentials)
    .then( (folderId) => {
      let toDoAfterFolderCreated = [
        drive.shareFolder(contractor, credentials, folderId),
        drive.addFile(contractor, credentials, config.get('drive.files.directDeposit'), folderId),
        drive.addFile(contractor, credentials, config.get('drive.files.bgCheck'), folderId),
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
    .then( () => {
      return {'text': 'Created and shared Drive folder', 'status': 'success'};
    })
    .catch( (err) => {
      console.log(err);
      return {'text': 'Problem creating and sharing Drive folder', 'status': 'failure'};
    })
};

/**
 * Helper function to create the folder
 * @param contractor
 * @param credentials Google auth credentials stored in the user's sessions
 * @returns created folder id
 * @throws error if no folder is created
 */
drive.createFolder = (contractor, credentials) => {
  let driveUrl = config.get('google.baseUrl') + '/drive/v3/files';

  return googleAuth.getAccessToken(credentials)
    .then((token) => {
      return request.post({
        url: driveUrl,
        qs: {access_token: token},
        json: true,
        body: {
          'name': contractor.getFullName(),
          'parents': [config.get('drive.folders.contractors')],
          'mimeType': 'application/vnd.google-apps.folder'
        }
      });
    })
    .then((response) => {
      let fileData = JSON.parse(JSON.stringify(response));
      if ('id' in fileData) {
        return fileData.id;
      } else {
        throw new Error('No id in create folder response: ' + fileData);
      }
    });
};

/**
 * Helper function to make the folder available to the contractor
 * @param contractor
 * @param credentials Google auth credentials stored in the user's sessions
 * @returns shared folder id
 * @throws error if folder is not shared
 */
drive.shareFolder = (contractor, credentials, folderId) => {
  let driveUrl = config.get('google.baseUrl') + '/drive/v3/files/'+ folderId +'/permissions';

  return googleAuth.getAccessToken(credentials)
    .then((token) => {
      return request.post({
        url: driveUrl,
        qs: {
          access_token: token,
          sendNotificationEmail: true},
        json: true,
        body: {
          'type': 'user',
          'role': 'writer',
          'emailAddress': contractor.getEmail(),
        }
      });
    })
    .then((response) => {
      let fileData = JSON.parse(JSON.stringify(response));
      if ('id' in fileData) {
        return fileData.id;
      } else {
        throw new Error('No id in share folder response: ' + fileData);
      }
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
  let driveUrl = config.get('google.baseUrl') + '/drive/v3/files/'+ file.id +'/copy';

  return googleAuth.getAccessToken(credentials)
    .then((token) => {
      return request.post({
        url: driveUrl,
        qs: {access_token: token},
        json: true,
        body: {
          'name': file.name,
          'parents': [folderId],
        }
      });
    })
    .then((response) => {
      let fileData = JSON.parse(JSON.stringify(response));
      if ('id' in fileData) {
        return fileData.id;
      } else {
        throw new Error('No id in copy file response: ' + fileData);
      }
    });
};

/**
 * Helper function to retrieve a list of tasks from a spreadsheet on the Drive
 * @param credentials Google auth credentials stored in the user's sessions
 * @returns an array of CSV strings representing the tasks
 * @throws error if the tasks could not be retrieved
 */
drive.getTasksFromFile = (credentials) => {
  let driveUrl = config.get('google.baseUrl') + '/drive/v3/files/'+ config.get('drive.files.task.id') +'/export';

  return googleAuth.getAccessToken(credentials)
    .then((token) => {
      return request.get({
        url: driveUrl,
        qs: {
          access_token: token,
          mimeType: 'text/csv'
        },
        json: true
      });
    })
    .then((response) => {
      let fileData = String(response);
      if (fileData.indexOf(',') > -1) {
        return fileData.match(/[^\r\n]+/g);
      } else {
        throw new Error('Did not return CSV: ' + fileData);
      }
    });
}

