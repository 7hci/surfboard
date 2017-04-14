var Promise = require('bluebird');
var request = require('request-promise');
var config = require('config');

var domain = exports;

domain.createContractorEmail = (contractor) => {
  var googleAdminUrl = config.get('google.baseUrl') + '/admin/directory/v1/users';

  return Promise.resolve({'text': 'Added ' + contractor.getEmail() + ' to domain', 'status': 'success'});
};