const Bluebird = require('bluebird');

module.exports = {
  getAccessToken() {
    return Bluebird.resolve('mock_token');
  }
};
