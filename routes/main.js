/**
 * @fileOverview Route that renders the index page
 * @type {constructor}
 */
let config = require('config');
let auth = require('../controller/auth');

let main = exports;

main.route = (req, res) => {
  res.render('index.html', {tasks: config.get('tasks.formOptions')});
};