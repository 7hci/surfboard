const Bluebird = require('bluebird');

module.exports = {
  createContractorEmail(contractor, socket) {
    return Bluebird.resolve(socket.emit({ text: 'mock text', status: 'mock status' }));
  }
};
