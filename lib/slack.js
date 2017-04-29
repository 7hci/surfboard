/**
 * Handles all calls to Slack's API
 */
const request = require('request-promise').defaults({ simple: false });
const config = require('config');
const logger = require('log4js').getLogger('app');

const slack = exports;

/**
 * Sends request to generate a Slack invitation for contractor
 * @param contractor
 * @returns {Promise} success/failure status message
 */
slack.inviteToSlack = (contractor) => {
  const slackUrl = `${config.get('slack.baseUrl')}/users.admin.invite`;
  const token = config.get('slack.token');

  return request.get({
    url: slackUrl,
    json: true,
    qs: {
      token,
      email: contractor.getEmail()
    }
  }).then((response) => {
    if ('ok' in response && response.ok === true) {
      logger.info('Invited to Slack');
      return { text: 'Invited to Slack', status: 'success' };
    }
    return { text: 'Problem inviting to slack', status: 'failure' };
  }).catch((err) => {
    logger.info(`Problem inviting to slack: ${err}`);
    return { text: 'Problem inviting to slack', status: 'failure' };
  });
};
