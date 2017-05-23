/**
 * @fileOverview Handles requests to send and upload contract
 */
const request = require('request-promise');
const Bluebird = require('bluebird');
const path = require('path');
const config = require('config');
const fs = Bluebird.promisifyAll(require('fs'));
const _ = require('lodash');
const logger = require('log4js').getLogger('app');
const googleAuth = require('./google-auth');
const models = require('../db/models');

const contract = exports;

/**
 * Runs apps script that fills in contract
 * @param socket
 * @param formArray array of form input values
 * @param id the id corresponding to the new hire
 * @param credentials Google auth credentials stored in the user's sessions
 */
contract.preview = (socket, formArray, id, credentials) => {
  const formData = _.reduce(formArray, (result, object) => {
    // eslint-disable-next-line no-param-reassign
    result[object.name] = object.value;
    return result;
  }, {});

  const name = `${formData.firstName} ${formData.lastName}`;
  const email = formData.email;
  const company = formData.company;
  const title = formData.title;
  const phone = formData.phone;
  const address = formData.address;
  const signatureFile = formData.signatureFile;
  let accessToken;
  let contractId;

  return googleAuth.getAccessToken(credentials)
    .then((token) => {
      accessToken = token;
      const body = {
        function: 'updateMSSA',
        parameters: [
          {
            name,
            company,
            title,
            email,
            address,
            phone,
            signatureFile
          }
        ]
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
        contractId = response.response.result[0];
        const folderId = response.response.result[1];
        return models.NewHire.update({ contractId, folderId }, { where: { id } });
      }
      throw new Error(`Execution returned error: ${response.error.details[0]}`);
    })
    .then(() => {
      socket.emit('mssa_preview', contractId, accessToken);
    })
    .catch((err) => {
      logger.error(err);
      socket.emit('server_error');
    });
};

/**
 * Updates database to show that contract is ready for approval and cleans up uploaded files
 * @param socket
 * @param formArray array of form input values
 * @param id the id corresponding to the new hire
 */
contract.submit = (socket, formArray, id) => {
  const formData = _.reduce(formArray, (result, object) => {
    // eslint-disable-next-line no-param-reassign
    result[object.name] = object.value;
    return result;
  }, {});
  const signature = formData.signatureFile;

  return models.NewHire.update({ step: 4 }, { where: { id } })
    .then(() => {
      socket.emit('mssa_submitted');
      return fs.unlinkAsync(path.join(__dirname, '..', 'public', 'upload', signature));
    })
    .catch((err) => {
      logger.error(err);
      socket.emit('server_error');
    });
};

/**
 * Runs apps script that finalizes completed contract
 * @param socket
 * @param newHire object with all relevant info about new hire
 */
contract.sign = (socket, newHire) =>
  googleAuth.getAccessToken(newHire.credentials)
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
    .then((response) => {
      if (!response.error) {
        return models.NewHire.update({ step: 5 }, { where: { id: newHire.id } });
      }
      throw new Error(`Execution returned error: ${response.error.details[0]}`);
    })
    .then(() => {
      socket.emit('step_done', 4);
    })
    .catch((err) => {
      logger.error(err);
      socket.emit('server_error');
    });

