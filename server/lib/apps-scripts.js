/**
 * @fileOverview Handles requests to remotely execute google app scripts
 */
const request = require('request-promise');
const config = require('config');
const googleAuth = require('./google-auth');

const appsScripts = exports;

/**
 * Runs apps script that fills in contract
 * @param formData form input values
 * @param newHire new hire data
 */
appsScripts.preview = (formData, newHire) => {
  let accessToken;
  return googleAuth.getAccessToken(newHire.credentials)
    .then((token) => {
      accessToken = token;
      const body = {
        function: 'updateMSSA',
        parameters: [formData, newHire.get()]
      };
      const scriptId = config.get('drive.files.contractScript.id');
      const executeUrl = `https://script.googleapis.com/v1/scripts/${scriptId}:run`;

      return request.post({
        url: executeUrl,
        auth: {
          bearer: token
        },
        body,
        json: true
      });
    })
    .then((response) => {
      if (!response.error) {
        newHire.set('contractId', response.response.result[0]);
        newHire.set('folderId', response.response.result[1]);
        newHire.set('credentials.access_token', accessToken);
        return newHire.save();
      }
      return Promise.reject(new Error(`Execution returned error: ${response.error.details[0]}`));
    });
};

/**
 * Runs apps script that finalizes completed contract
 * @param {Object} newHire
 * @param {Object} credentials Google auth credentials stored in the user's sessions
 */
appsScripts.accept = (newHire, credentials) =>
  googleAuth.getAccessToken(credentials)
    .then((token) => {
      const body = {
        function: 'signMSSA',
        parameters: [newHire]
      };
      const scriptId = config.get('drive.files.contractScript.id');
      const executeUrl = `https://script.googleapis.com/v1/scripts/${scriptId}:run`;

      return request.post({
        url: executeUrl,
        auth: {
          bearer: token
        },
        body,
        json: true
      });
    })
    .then(response => response.error
      ? Promise.reject(new Error(`Execution returned error: ${response.error.details[0].errorMessage}`))
      : Promise.resolve());
