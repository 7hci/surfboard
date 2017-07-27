const { NewHire, Setting } = require('../../db');
const { merge } = require('lodash');
const config = require('config');
const auth = require('../../lib/google-auth');
const { authenticate } = require('./helpers');

module.exports = {
  // admin endpoints
  newHires: (obj, args, { credentials }) => authenticate(credentials).then(() => NewHire.findAll()),
  // client endpoints
  newHire: (obj, { id }) => NewHire.findById(id, { raw: true })
    .then(newHire => auth.getAccessToken(newHire.credentials)
      .then(token => merge(newHire, { credentials: { access_token: token } }))),
  // settings endpoint
  settings: (obj, args, { key }) => key === config.get('api.key') ? Setting.getAll() : new Error('Invalid API key')
};
