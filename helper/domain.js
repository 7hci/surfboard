let Promise = require('bluebird');

let domain = exports;

domain.createContractorEmail = (contractor) => {
  return Promise.resolve({'text': 'Added ' + contractor.getEmail() + ' to domain', 'status': 'success'});
};