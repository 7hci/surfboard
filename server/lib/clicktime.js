/**
 * @fileOverview Adds the contractor to ClickTime by simulating the login process on the
 * site using PhantomJS and CasperJS
 */

const config = require('config');
const Bluebird = require('bluebird');
const shell = require('shelljs');
const logger = require('log4js').getLogger('app');

/**
 * Runs CasperJS through the command line
 * @param contractor
 * @param socket
 * @returns command line output after command is done running (success/failure status message)
 */
exports.addUserToClickTime = (contractor, socket) => {
  let command = 'casperjs server/lib/clicktime-casper.js'
    + ` --user=${config.get('clicktime.user')}`
    + ` --password=${config.get('clicktime.password')}`
    + ` --name="${contractor.getFullName()}"`
    + ` --email=${contractor.getEmail()}`;

  if (process.env.NODE_ENV === 'test') command += ' --test';

  const failureUpdate = { text: 'Problem adding user to ClickTime', status: 'failure', task: 'addUserToClickTime' };
  return new Bluebird((resolve) => {
    shell.exec(command, (code, stdout, stderr) => {
      if (stderr) {
        logger.error(stderr);
        socket.emit('update', failureUpdate);
      } else {
        try {
          socket.emit('update', JSON.parse(stdout));
          logger.info('Added user to ClickTime');
        } catch (error) {
          logger.error(`${stdout}\n${error}`);
          socket.emit('update', failureUpdate);
        }
      }
      resolve();
    });
  });
};
