var config = require('config');
var auth = require('../helper/auth');

var main = exports;

main.route = (req, res) => {
  res.render('index.html', {tasks: config.get('tasks.formOptions')});
};