/**
 * Handles all calls to Slack's API
 */
let request = require('request-promise').defaults({simple: false});
let config = require('config');

let slack = exports;

/**
 * Sends request to generate a Slack invitation for contractor
 * @param contractor
 * @returns success/failure status message
 */
slack.inviteToSlack = (contractor) => {

  let slackUrl = config.get('slack.baseUrl') + '/users.admin.invite';
  let token = config.get('slack.token');

  return request.get({
    url: slackUrl,
    json: true,
    qs: {
      token: token,
      email: contractor.getEmail()
    },
  }).then( (response) => {
    if ('ok' in response) {
      if (response.ok === true) {
        return {'text': 'Invited to Slack', 'status': 'success'};
      } else {
        return {'text': 'Already invited ' + contractor.getEmail(), 'status': 'failure'};
      }
    } else {
      return {'text': 'Problem inviting to slack', 'status': 'failure'};
    }
  }).catch( (err) => {
    return {'text': 'Problem inviting to slack', 'status': 'failure'}
  });
};