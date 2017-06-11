const Bluebird = require('bluebird');

module.exports = {
  addUserToClickTime(contractor, socket) {
    return Bluebird.resolve(socket.emit({ text: 'mock text', status: 'mock status' }));
  }
};
