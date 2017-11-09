const Bluebird = require('bluebird');

module.exports = {
  sendLoginEmail(contractor, socket) {
    return Bluebird.resolve(socket.emit({ text: 'mock text', status: 'mock status' }));
  },
  sendWelcomeEmail(contractor, socket) {
    return Bluebird.resolve(socket.emit({ text: 'mock text', status: 'mock status' }));
  }
};
