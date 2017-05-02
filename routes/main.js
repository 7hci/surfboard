/**
 * @fileOverview Route that renders the index page
 * @type {constructor}
 */
const config = require('config');

const main = exports;

main.route = (req, res) => {
  res.render('index.html', {
    tasks: config.get('tasks.formOptions'),
    credentials: JSON.stringify(req.session.tokens)
  });
};
