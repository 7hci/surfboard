/**
 * @fileOverview Adds the contractor to ClickTime by simulating the login process on the
 * site using PhantomJS and CasperJS
 */

const config = require('config');
const Promise = require('bluebird');
const shell = require('shelljs');
const logger = require('log4js').getLogger('app');

const clicktime = exports;

/**
 * Runs CasperJS through the command line
 * @param contractor
 * @returns command line output after command is done running (success/failure status message)
 */
clicktime.addUserToClickTime = (contractor) => {
  let command = `casperjs lib/clicktime-casper.js --user=${config.get('clicktime.user')
    } --password=${config.get('clicktime.password')
    } --name="${contractor.getFullName()}"` +
    ` --email=${contractor.getEmail()}`;

  if (process.env.NODE_ENV === 'testing') {
    command += ' --test';
  }

  return new Promise((resolve) => {
    shell.exec(command, (code, stdout, stderr) => {
      if (stderr) {
        logger.error(stderr);
        resolve({ text: 'Problem adding user to ClickTime', status: 'failure' });
      } else {
        logger.info('Added user to ClickTime');
        resolve(JSON.parse(stdout));
      }
    });
  });
};
