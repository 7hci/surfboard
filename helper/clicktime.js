let config = require('config');
let Promise = require('bluebird');
let shell = require('shelljs');

let clicktime = exports;

clicktime.addUserToClickTime = (contractor) => {

  let command = 'casperjs clicktime-casper.js --user=' + config.get('clicktime.user') +
    ' --password=' + config.get('clicktime.password') +
    ' --name="' + contractor.getFullName() + '"' +
    ' --email=' + contractor.getEmail()
    + config.get('clicktime.test');

  return new Promise((resolve, reject) => {
    shell.exec(command, (code, stdout, stderr) => {
      if (stderr) {
        console.log(stderr);
        reject(stderr);
      }
      else {
        console.log(stdout);
        resolve(JSON.parse(stdout));
      }
    })
  });

};
