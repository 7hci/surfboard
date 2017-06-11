const app = require('./server');
const debug = require('debug')('surfboard:server');
const models = require('./db/models');
const onboard = require('./lib/onboard');

models.sequelize.sync().then(() => {
  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => {
    debug(`Listening on ${port}`);
  });

  // eslint-disable-next-line global-require
  const io = require('socket.io')(server);

  io.on('connection', (socket) => {
    socket.on('onboard', (formData, id) => {
      onboard.run(socket, formData, id);
    });
  });
});
