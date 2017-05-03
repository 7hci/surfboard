const app = require('./app');
const debug = require('debug')('surfboard:server');
const models = require('./models');

models.sequelize.sync().then(() => {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    debug(`Listening on ${port}`);
  });
});
