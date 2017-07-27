const log4js = require('log4js');

module.exports.configure = () => {
  log4js.configure({
    appenders: [{
      type: 'file',
      filename: 'logs/app.log',
      category: 'app',
      layout: {
        type: 'pattern',
        pattern: '[%r] %p - %m'
      }
    }]
  });
};

module.exports.log = (message, level = 'error') => {
  log4js.getLogger('app')[level](message);
};

module.exports.reject = (error, level = 'error') => {
  log4js.getLogger('app')[level](error.message);
  return Promise.reject(error);
};
