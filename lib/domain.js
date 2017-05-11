/**
 * @fileOverview Handles all calls to Google's Admin SDK API
 */
const request = require('request-promise').defaults({ simple: false });
const config = require('config');
const logger = require('log4js').getLogger('app');
const googleAuth = require('./google-auth');


const domain = exports;

/**
 * Creates a new e-mail account for the contractor
 * @param contractor
 * @param socket
 * @param credentials Google auth credentials stored in the user's sessions
 * @returns success/failure status object
 */
domain.createContractorEmail = (contractor, socket, credentials) => {
  const googleAdminUrl = `${config.get('google.baseUrl')}/admin/directory/v1/users`;
  return googleAuth.getAccessToken(credentials)
    .then(token => request.post({
      url: googleAdminUrl,
      qs: { access_token: token },
      json: true,
      body: {
        primaryEmail: contractor.getEmail(),
        name: {
          givenName: contractor.firstName,
          familyName: contractor.lastName
        },
        password: contractor.getPassword(),
        changePasswordAtNextLogin: true
      }
    }))
    .then((userData) => {
      // If the request worked, a user object with an id would be returned by Google
      if ('id' in userData) {
        logger.info(`Added ${contractor.getEmail()} to domain`);
        socket.emit('update', { text: `Added ${contractor.getEmail()} to domain`, status: 'success' });
      } else {
        logger.error('Problem creating e-mail for contractor');
        socket.emit('update', { text: 'Problem creating e-mail for contractor', status: 'failure' });
      }
    })
    .catch((err) => {
      logger.error(err);
      socket.emit('update', { text: 'Problem creating e-mail for contractor', status: 'failure' });
    });
};
