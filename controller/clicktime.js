/**
 * @fileOverview Simulates adding the contractor through ClickTime's site using PhantomJS and CasperJS
 */

let config = require('config');
let Promise = require('bluebird');
let shell = require('shelljs');
let logger = require('log4js').getLogger('app');

let clicktime = exports;

/**
 * Runs CasperJS through the command line
 * @param contractor
 * @returns command line output after command is done running (success/failure status message)
 */
clicktime.addUserToClickTime = (contractor) => {

  let command = 'casperjs clicktime-casper.js --user=' + config.get('clicktime.user') +
    ' --password=' + config.get('clicktime.password') +
    ' --name="' + contractor.getFullName() + '"' +
    ' --email=' + contractor.getEmail();

  if (process.env.NODE_ENV === 'testing'){
    command += ' --test';
  }

  return new Promise((resolve, reject) => {
    shell.exec(command, (code, stdout, stderr) => {
      if (stderr) {
        logger.error(stderr);
        resolve({'text': 'Problem adding user to ClickTime', 'status': 'failure'});
      }
      else {
        logger.info('Added user to ClickTime');
        resolve(JSON.parse(stdout));
      }
    })
  });

};