const express = require('express');
const debug = require('debug')('surfboard:server');
const path = require('path');
const favicon = require('serve-favicon');
const log4js = require('log4js');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');

const app = express();

global.__root = `${__dirname}/`;

process.env.NODE_ENV = 'development';

nunjucks.configure(path.join(__dirname, 'views'), { express: app, autoescape: true });

log4js.configure({
  appenders: [
    {
      type: 'file',
      filename: 'logs/app.log',
      category: 'app',
      layout: {
        type: 'pattern',
        pattern: '[%r] %p - %m'
      }
    }
  ]
});

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('express-session')({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  },
  // default to MemoryStore for now
  resave: true,
  saveUninitialized: true
}));

app.use(require('./routes'));

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error.html');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  debug(`Listening on ${port}`);
});

module.exports = app;
