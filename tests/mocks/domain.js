const Bluebird = require('bluebird');

module.exports = {
  createContractorEmail(contractor, socket) {
    return new Promise((resolve) => {
      setTimeout(resolve(), 5000);
    }).then(() => Bluebird.resolve(socket.emit({ text: 'mock text', status: 'mock status' })));
  }
};
