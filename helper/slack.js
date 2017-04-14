let Promise = require('bluebird');

let slack = exports;

slack.inviteToSlack = (contractor) => {
  return Promise.resolve({'text': 'Invited to Slack', 'status': 'success'});
};