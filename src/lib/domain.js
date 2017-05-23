/**
 * @fileOverview Handles all calls to Google's Admin SDK API
 */
const request = require('request-promise').defaults({ simple: false });
const config = require('config');
const Bluebird = require('bluebird');
const _ = require('lodash');
const logger = require('log4js').getLogger('app');
const google = require('googleapis');
const googleAuth = require('./google-auth');
const cacheManager = require('cache-manager');

const cache = cacheManager.caching({ store: 'memory', ttl: 60 }); // 86400

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

/**
 * Get information about personnel from Directory API using service account
 * @returns success/failure status object
 */
domain.getPersonnelInfo = () => cache
  .wrap('personnel', () => new Bluebird((resolve, reject) => {
    const key = config.get('google.serviceAccount');
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      key.scopes,
      key.authorizedUser
    );

    jwtClient.authorize((err) => {
      if (err) {
        logger.error(err);
        reject(err);
      }

      const admin = google.admin('directory_v1');
      admin.users.list({
        auth: jwtClient,
        domain: '7hci.com',
        maxResults: 500,
        projection: 'full'
      }, (error, response) => {
        if (error) {
          logger.error(error);
          reject(error);
        }
        const reduced = _.reduce(response.users, (users, user) => {
          users.push({
            name: user.name.fullName,
            email: user.primaryEmail
          });
          return users;
        }, []);
        resolve(reduced);
      });
    });
  }))
  .then(personnel => personnel);

