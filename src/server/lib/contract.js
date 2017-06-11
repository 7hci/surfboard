/**
 * @fileOverview Handles requests to preview, sign and complete contracts
 */
const request = require('request-promise');
const Bluebird = require('bluebird');
const path = require('path');
const config = require('config');
const fs = Bluebird.promisifyAll(require('fs'));
const logger = require('log4js').getLogger('app');
const googleAuth = require('./google-auth');
const models = require('../db/models');

const contract = exports;

/**
 * Runs apps script that fills in contract
 * @param formData form input values
 * @param newHire new hire data
 */
contract.preview = (formData, newHire) => {
  let accessToken;
  let contractId;

  return googleAuth.getAccessToken(newHire.credentials)
    .then((token) => {
      accessToken = token;
      const body = {
        function: 'updateMSSA',
        parameters: [formData, newHire]
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
        return models.NewHire.update({ contractId, folderId }, { where: { id: newHire.id } });
      }
      throw new Error(`Execution returned error: ${response.error.details[0]}`);
    })
    .then(() => ({ contractId, accessToken }))
    .catch((err) => {
      logger.error(err);
      return { error: err.message };
    });
};

/**
 * Updates database to show that contract is ready for approval and cleans up uploaded files
 * @param formData form input values
 * @param id new hire id
 */
contract.submit = id =>
  models.NewHire.update({ step: 4 }, { where: { id } })
    .then(() => fs.unlinkAsync(path.join(__dirname, '..', 'public', 'upload', `${id}.bmp`)))
    .then(() => ({ status: 'ok' }))
    .catch((err) => {
      logger.error(err);
      return { error: err.message };
    });

/**
 * Runs apps script that finalizes completed contract
 * @param id new hire id
 * @param credentials Google auth credentials stored in the user's sessions
 */
contract.accept = (id, credentials) =>
  models.NewHire.findById(id)
    .then((newHire) => {
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
        .then((response) => {
          if (!response.error) {
            return models.NewHire.update({ step: 5 }, { where: { id: newHire.id } });
          }
          throw new Error(`Execution returned error: ${response.error.details[0].errorMessage}`);
        })
        .then(result => result)
        .catch((err) => {
          logger.error(err);
          return { error: err.message };
        });
    });

