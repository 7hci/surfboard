/**
 * @fileOverview Handles all calls to Google's Admin SDK API
 */
let request = require('request-promise').defaults({simple: false});
let config = require('config');
let logger = require('log4js').getLogger('app');
let googleAuth = require('./google-auth');

let domain = exports;

/**
 * Creates a new e-mail account for the contractor
 * @param contractor
 * @param credentials Google auth credentials stored in the user's sessions
 * @returns success/failure status object
 */
domain.createContractorEmail = (contractor, credentials) => {
  let googleAdminUrl = config.get('google.baseUrl') + '/admin/directory/v1/users';
  return googleAuth.getAccessToken(credentials)
    .then((token) => {
      return request.post({
        url: googleAdminUrl,
        qs: {access_token: token},
        json: true,
        body: {
          "primaryEmail": contractor.getEmail(),
          "name": {
            "givenName": contractor.firstName,
            "familyName": contractor.lastName
          },
          "password": contractor.getPassword(),
          "changePasswordAtNextLogin": true
        }
      });
    })
    .then((response) => {
      let userData = response;

      // If the request worked, a user object with an id would be returned by Google
      if ('id' in userData) {
        logger.info('Added ' + contractor.getEmail() + ' to domain');
        return {'text': 'Added ' + contractor.getEmail() + ' to domain', 'status': 'success'};
      } else {
        return {'text': 'Problem creating e-mail for contractor', 'status': 'failure'};
      }
    })
    .catch((err) => {
      logger.error(err);
      return {'text': 'Problem creating e-mail for contractor', 'status': 'failure'};
    });
};