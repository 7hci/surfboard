const app = require('./app');
const debug = require('debug')('surfboard:server');
const SocketIOFile = require('socket.io-file');
const logger = require('log4js').getLogger('app');
const path = require('path');
const models = require('./db/models');
const onboard = require('./lib/onboard');
const gmail = require('./lib/gmail');
const mssa = require('./lib/contract');

models.sequelize.sync().then(() => {
  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => {
    debug(`Listening on ${port}`);
  });

  // eslint-disable-next-line global-require
  const io = require('socket.io')(server);

  io.on('connection', (socket) => {
    const uploader = new SocketIOFile(socket, {
      uploadDir: 'dist/public/upload',
      rename(filename) {
        const file = path.parse(filename);
        const ext = file.ext;
        return socket.id + ext;
      },
      overwrite: true
    });
    uploader.on('error', (err) => {
      logger.error(err);
    });
    socket
      .on('get_hires', () => {
        onboard.getAll(socket);
      })
      .on('get_hire', (id) => {
        onboard.getById(socket, id);
      })
      .on('onboard', (formData, newHire, credentials) => {
        onboard.run(socket, formData, newHire, credentials);
      })
      .on('add_hire', (formData, credentials) => {
        onboard.addHire(socket, formData, credentials);
      })
      .on('skip_to', (newHire, step) => {
        onboard.skipStep(socket, newHire, step);
      })
      .on('complete_onboarding', (newHire) => {
        onboard.complete(socket, newHire);
      })
      .on('send_mssa', (formData, newHire, credentials) => {
        gmail.sendMSSA(socket, formData, newHire, credentials);
      })
      .on('mssa_previewed', (formData, id, credentials) => {
        mssa.preview(socket, formData, id, credentials);
      })
      .on('mssa_submitted', (formData, id) => {
        mssa.submit(socket, formData, id);
      })
      .on('sign_mssa', (newHire) => {
        mssa.sign(socket, newHire);
      });
  });
});
