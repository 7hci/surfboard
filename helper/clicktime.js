const config = require('config');
const Promise = require('bluebird');
const cmd = require('node-cmd');

var clicktime = exports;

clicktime.addUserToClickTime = (contractor) => {
  const getAsync = Promise.promisify(cmd.get, {multiArgs: true, context: cmd});

  const command = 'casperjs ' + __root + 'helper/clicktime-casper.js --user=' + config.get('clicktime.user') +
    ' --password=' + config.get('clicktime.password') +
    ' --name=' + contractor.getFullName() +
    ' --email=' + contractor.getEmail() +
    + config.get('clicktime.test');

  getAsync(command)
    .then((response) => {
      return JSON.parse(response);
    })
    .catch((err) => {
      console.log(err);
      return {'text': 'Problem adding user to ClickTime', 'status': 'failure'};
    })
};