let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let MongoDBStore = require('connect-mongodb-session')(session);
let nunjucks = require('nunjucks');
let assert = require('assert');
let app = express();

nunjucks.configure(path.join(__dirname, 'views'), { express : app, autoescape: true });

global.__root = __dirname + '/';

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configure to store session information in mongoDB
let store = new MongoDBStore(
  {
    uri: 'mongodb://localhost:27017/connect_mongodb_session_test',
    collection: 'mySessions'
  });
store.on('error', function(error) {
  assert.ifError(error);
  assert.ok(false);
});
app.use(require('express-session')({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  },
  // store: store, default to MemoryStore for now
  resave: true,
  saveUninitialized: true
}));

app.use(require('./routes'));

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   let err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   res.status(err.status || 500);
//   res.render('error.html' );
// });

module.exports = app;
