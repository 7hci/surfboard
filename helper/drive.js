var request = require('request-promise').defaults({simple: false});
var config = require('config');
var auth = require('../helper/auth');
var Promise = require('bluebird');

var drive = exports;

drive.addAndShareDriveFolder = (contractor, credentials) => {
  return Promise.resolve({'text': 'Created and shared Drive folder', 'status': 'success'});
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
        throw new Error('No id in returned response: ' + fileData);
      }
    });
};

drive.addFiles = (contractor, credentials) => {
  var driveUrl = config.get('google.baseUrl') + '/drive/v3/files';

  
};

drive.addFile = (contractor, credentials, file, folderId) => {
  var fileId = file[Object.keys(file)[0]];
  var driveUrl = config.get('google.baseUrl') + '/drive/v3/files/'+ fileId +'/copy';

  return auth.getAccessToken(credentials)
    .then((token) => {
      return request.post({
        url: driveUrl,
        qs: {access_token: token},
        json: true,
        body: {
          'name': Object.keys(file)[0],
          'parents': [{'id': folderId}],
        }
      });
    })
    .then((response) => {
      var fileData = JSON.parse(JSON.stringify(response));
      if ('id' in fileData) {
        return fileData.id;
      } else {
        throw new Error('No id in returned response: ' + fileData);
      }
    });
};