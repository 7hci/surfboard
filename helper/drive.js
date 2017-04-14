let Promise = require('bluebird');

let drive = exports;

drive.addAndShareDriveFolder = (contractor) => {
  return Promise.resolve({'text': 'Created and shared Drive folder', 'status': 'success'});
};