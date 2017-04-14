var Promise = require('bluebird');

var drive = exports;

drive.addAndShareDriveFolder = (contractor) => {
  return Promise.resolve({'text': 'Created and shared Drive folder', 'status': 'success'});
};