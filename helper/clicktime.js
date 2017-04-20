let config = require('config');
let Promise = require('bluebird');
let cmd = require('node-cmd');

let clicktime = exports;

clicktime.addUserToClickTime = (contractor) => {
  let command = 'casperjs helper/clicktime-casper.js --user=' + config.get('clicktime.user') +
    ' --password=' + config.get('clicktime.password') +
    ' --name=' + contractor.getFullName() +
    ' --email=' + contractor.getEmail()
    + config.get('clicktime.test');

  return new Promise( (resolve, reject) => {
    cmd.get(command, (err, data, stderr) => {
      if (stderr) reject(stderr);
      if (err) reject(stderr);
      console.log(data);
      resolve(JSON.parse(data));
    })
  });
};