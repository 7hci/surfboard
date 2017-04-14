let config = require('config');
let auth = require('../helper/auth');

let main = exports;

main.route = (req, res) => {
  res.render('index.html', {tasks: config.get('tasks.formOptions')});
};