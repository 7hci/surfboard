const Bluebird = require('bluebird');

module.exports = {
  inviteToSlack(contractor, socket) {
    return Bluebird.resolve(socket.emit({ text: 'mock text', status: 'mock status' }));
  }
};
