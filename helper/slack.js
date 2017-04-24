var request = require('request-promise').defaults({simple: false});
var config = require('config');
var auth = require('../helper/auth');
var Promise = require('bluebird');

var slack = exports;

slack.inviteToSlack = (contractor) => {

  var slackUrl = config.get('slack.baseUrl') + '/users.admin.invite';
  var token = config.get('slack.token');

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