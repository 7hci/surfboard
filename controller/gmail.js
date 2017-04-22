/**
 * @fileOverview Handles all calls to Google's Drive API
 */

let request = require('request-promise').defaults({simple: false});
let config = require('config');
let logger = require('log4js').getLogger('app');
let googleAuth = require('./google-auth');
let template = require('string-template');
let Bluebird = require('bluebird');
let fs = Bluebird.promisifyAll(require('fs'));

let gmail = exports;

/**
 * Main function to send an e-mail to the contractor with document instructions
 * @param contractor
 * @param credentials Google auth credentials stored in the user's sessions
 * @returns success/failure status object
 */
gmail.sendDriveEmail = (contractor, credentials) => {
  let tokenBluebird = googleAuth.getAccessToken(credentials);
  let messageBluebird = gmail.getMessageFromFile(contractor,__root + 'data/required.txt');

  return Bluebird.all([tokenBluebird, messageBluebird])
    .spread((token, message) => {
      let gmailUrl = config.get('google.baseUrl') + '/gmail/v1/users/me/messages/send';
      return request.post({
        url: gmailUrl,
        qs: {
          access_token: token,
          userId: "me"},
        json: true,
        body: {
          "raw": gmail.generateEncodedEmail(contractor, message, 'Required Documents', false)
        }
      })
    })
    .then((response) => {
      let messageData = response;
      if ('id' in messageData) {
        return {'text': 'Sent required documents instructions', 'status': 'success'};
      } else {
        return {'text': 'Problem sending required documents instructions', 'status': 'failure'};
      }
    })
    .catch((err) => {
      logger.error(err);
      return {'text': 'Problem sending required documents instructions', 'status': 'failure'};
    });
};

/**
 * Main function to send an e-mail to the contractor with login credentials
 * @param contractor
 * @param credentials Google auth credentials stored in the user's sessions
 * @returns success/failure status object
 */
gmail.sendLoginEmail = (contractor, credentials) => {
  let tokenBluebird = googleAuth.getAccessToken(credentials);
  let messageBluebird = gmail.getMessageFromFile(contractor,__root + 'data/login.txt');

  return Bluebird.all([tokenBluebird, messageBluebird])
    .spread((token, message) => {
      let gmailUrl = config.get('google.baseUrl') + '/gmail/v1/users/me/messages/send';
      return request.post({
        url: gmailUrl,
        qs: {
          access_token: token,
          userId: "me"},
        json: true,
        body: {
          "raw": gmail.generateEncodedEmail(contractor, message, '7HCI E-mail Account Credentials', true)
        }
      })
    })
    .then((response) => {
      let messageData = response;
      if ('id' in messageData) {
        return {'text': 'Sent e-mail with credentials', 'status': 'success'};
      } else {
        return {'text': 'Problem sending e-mail with credentials', 'status': 'failure'};
      }
    })
    .catch((err) => {
      logger.error(err);
      return {'text': 'Problem sending e-mail with credentials', 'status': 'failure'};
    });
};

/**
 * Helper function to retrieve the message template from a text file and fill it using the contractor's info
 * @param contractor
 * @param file The location of the text file to use for the template
 * @returns the completed message
 */
gmail.getMessageFromFile = (contractor, file) => {
  return fs.readFileAsync(file,  'utf-8').then( (text) => {

    let form;
    if (contractor.isResident) {
      form = "W-9";
    } else {
      form = "W-8BEN"
    }

    return template(text, {
      name: contractor.firstName,
      address: contractor.getEmail(),
      password: contractor.getPassword(),
      form: form
    })
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
  let rawData = [
    "Content-Type: text/plain; charset=\"UTF-8\"\n",
    "MIME-Version: 1.0\n",
    "Content-Transfer-Encoding: 7bit\n",
    "to: ", recipient, "\n",
    "subject: ", subject, "\n\n",
    message
  ].join('');

  return new Buffer(rawData).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
};