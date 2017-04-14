var Promise = require('bluebird');

var slack = exports;

slack.inviteToSlack = (contractor) => {
  return Promise.resolve({'text': 'Invited to Slack', 'status': 'success'});
};