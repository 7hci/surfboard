var Promise = require('bluebird');

var gmail = exports;

gmail.sendLoginEmail = (contractor) => {
  return Promise.resolve({'text': 'Sent login info to contractor', 'status': 'success'});
};

gmail.sendDriveEmail = (contractor) => {
  return Promise.resolve({'text': 'Sent document instructions to contractor', 'status': 'success'});
};