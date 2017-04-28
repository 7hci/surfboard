/**
 * @fileOverview Handles all calls to Google's Drive API
 */

const request = require('request-promise').defaults({ simple: false });
const config = require('config');
const logger = require('log4js').getLogger('app');
const googleAuth = require('./google-auth');
const welcomeTemplate = require('../views/email/welcome-template');
const loginTemplate = require('../views/email/login-template');

const gmail = exports;

/**
 * Main function to send an e-mail to the contractor with document instructions
 * @param contractor
 * @param credentials Google auth credentials stored in the user's sessions
 * @returns success/failure status object
 */
gmail.sendWelcomeEmail = (contractor, credentials) => googleAuth.getAccessToken(credentials)
    .then((token) => {
      const message = gmail.getMessageFromFile(contractor, welcomeTemplate);
      const gmailUrl = `${config.get('google.baseUrl')}/gmail/v1/users/me/messages/send`;
      return request.post({
        url: gmailUrl,
        qs: {
          access_token: token,
          userId: 'me' },
        json: true,
        body: {
          raw: gmail.generateEncodedEmail(contractor, message, 'Required Documents', false)
        }
      });
    })
    .then((messageData) => {
      if ('id' in messageData) {
        logger.info('Sent welcome e-mail');
        return { text: 'Sent welcome e-mail', status: 'success' };
      }
      return { text: 'Problem sending welcome e-mail', status: 'failure' };
    })
    .catch((err) => {
      logger.error(err);
      return { text: 'Problem sending welcome e-mail', status: 'failure' };
    });

/**
 * Main function to send an e-mail to the contractor with login credentials
 * @param contractor
 * @param credentials Google auth credentials stored in the user's sessions
 * @returns success/failure status object
 */
gmail.sendLoginEmail = (contractor, credentials) => googleAuth.getAccessToken(credentials)
    .then((token) => {
      const message = gmail.getMessageFromFile(contractor, loginTemplate);
      const gmailUrl = `${config.get('google.baseUrl')}/gmail/v1/users/me/messages/send`;
      return request.post({
        url: gmailUrl,
        qs: {
          access_token: token,
          userId: 'me' },
        json: true,
        body: {
          raw: gmail.generateEncodedEmail(contractor, message, '7HCI E-mail Account Credentials', true)
        }
      });
    })
    .then((messageData) => {
      if ('id' in messageData) {
        logger.info('Sent e-mail with credentials');
        return { text: 'Sent e-mail with credentials', status: 'success' };
      }
      return { text: 'Problem sending e-mail with credentials', status: 'failure' };
    })
    .catch((err) => {
      logger.error(err);
      return { text: 'Problem sending e-mail with credentials', status: 'failure' };
    });

/**
 * Helper function to retrieve the message template from a text file
 * and fill it using the contractor's info
 * @param contractor
 * @param template The template to be used for the e-mail
 * @returns the completed message
 */
gmail.getMessageFromFile = (contractor, template) => {
  let form;
  if (contractor.isResident) {
    form = 'W-9';
  } else {
    form = 'W-8BEN';
  }

  return template({
    name: contractor.firstName,
    address: contractor.getEmail(),
    password: contractor.getPassword(),
    form
  });
};

/**
 * Helper function to generate and encode the email to be sent
 * @param contractor
 * @param message The body of the email
 * @param subject The subject of the email
 * @param usePrivateEmail whether to send the email to the contractor's private address
 * @returns the encoded e-mail
 */
gmail.generateEncodedEmail = (contractor, message, subject, usePrivateEmail) => {
  let recipient;
  if (usePrivateEmail) {
    recipient = contractor.privateEmail;
  } else {
    recipient = contractor.getEmail();
  }
  const rawData = [
    'Content-Type: text/plain; charset="UTF-8"\n',
    'MIME-Version: 1.0\n',
    'Content-Transfer-Encoding: 7bit\n',
    'to: ', recipient, '\n',
    'subject: ', subject, '\n\n',
    message
  ].join('');

  return new Buffer(rawData).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
};
