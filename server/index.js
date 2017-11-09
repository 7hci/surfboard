const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const favicon = require('serve-favicon');
const config = require('config');
const cors = require('cors');
const session = require('express-session');
const PGStore = require('connect-pg-simple')(session);
const logger = require('./logger');
const routes = require('./routes');
const db = require('./db');

const sessionMiddleware = session({
  secret: 'This is a secret',
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  store: new PGStore({ conString: config.get('db.uri') }),
  resave: false,
  saveUninitialized: true
});
const app = express();

nunjucks.configure(path.join(__dirname, 'views'), { express: app, autoescape: true });

logger.configure();

app.set('models', require('./db/index'));

app.use(favicon(path.join(__dirname, '..', 'public', 'img', 'favicon.png')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(cors({
  //origin: 'http://surfboard.reardenapps.com',
  origin: (origin, cb) => { cb(null, true); },
  credentials: true
}));
app.use(sessionMiddleware);

app.use(routes);

app.use((req, res, next) => {
  const err = new Error(`Not Found: ${req.originalUrl}`);
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

const server = http.createServer(app);
const io = require('socket.io')(server);

io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res, next);
});

io.on('connection', (socket) => {
  socket.on('onboard', (formData, id) => {
    db.NewHire.onboard(socket, formData, id, socket.request.session.tokens);
  });
});

db.sequelize.sync().then(() => {
  server.listen(process.env.PORT || 5000);
});
