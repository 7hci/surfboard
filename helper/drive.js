var request = require('request-promise').defaults({simple: false});
var config = require('config');
var auth = require('../helper/auth');
var Promise = require('bluebird');

var drive = exports;

drive.addAndShareDriveFolder = (contractor, credentials) => {
  return drive.createFolder(contractor, credentials)
    .then( (folderId) => {
      var toDoAfterFolderCreated = [
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
        return Promise.all(toDoAfterFolderCreated);
    })
    .then( () => {
      return Promise.resolve({'text': 'Created and shared Drive folder', 'status': 'success'});
    })
    .catch( (err) => {
      console.log(err);
      return Promise.resolve({'text': 'Problem creating and sharing Drive folder', 'status': 'failure'});
    })
};

drive.createFolder = (contractor, credentials) => {
  var driveUrl = config.get('google.baseUrl') + '/drive/v3/files';

  return auth.getAccessToken(credentials)
    .then((token) => {
      return request.post({
        url: driveUrl,
        qs: {access_token: token},
        json: true,
        body: {
          'name': contractor.getFullName(),
          'parents': [{'id': config.get('drive.folders.contractors')}],
          'mimeType': 'application/vnd.google-apps.folder'
        }
      });
    })
    .then((response) => {
      var fileData = JSON.parse(JSON.stringify(response));
      if ('id' in fileData) {
        return fileData.id;
      } else {
        throw new Error('No id in create folder response: ' + fileData);
      }
    });
};

drive.shareFolder = (contractor, credentials, folderId) => {
  var driveUrl = config.get('google.baseUrl') + '/drive/v3/files/'+ folderId +'/permissions';

  return auth.getAccessToken(credentials)
    .then((token) => {
      return request.post({
        url: driveUrl,
        qs: {
          access_token: token,
          sendNotificationEmail: true},
        json: true,
        body: {
          "type": "user",
          "role": "writer",
          "emailAddress": contractor.getEmail(),
        }
      });
    })
    .then((response) => {
      var fileData = JSON.parse(JSON.stringify(response));
      if ('id' in fileData) {
        return fileData.id;
      } else {
        throw new Error('No id in share folder response: ' + fileData);
      }
    });
};

drive.addFile = (contractor, credentials, file, folderId) => {
  var driveUrl = config.get('google.baseUrl') + '/drive/v3/files/'+ file.id +'/copy';

  return auth.getAccessToken(credentials)
    .then((token) => {
      return request.post({
        url: driveUrl,
        qs: {access_token: token},
        json: true,
        body: {
          'name': file.name,
          'parents': [{'id': folderId}],
        }
      });
    })
    .then((response) => {
      var fileData = JSON.parse(JSON.stringify(response));
      if ('id' in fileData) {
        return fileData.id;
      } else {
        throw new Error('No id in copy file response: ' + fileData);
      }
    });
};