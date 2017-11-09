const Bluebird = require('bluebird');

module.exports = {
  addAndShareDriveFolder(contractor, socket) {
    return Bluebird.resolve(socket.emit({ text: 'mock text', status: 'mock status' }));
  }
};
