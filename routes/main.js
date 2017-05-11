/**
 * @fileOverview Route that renders the index page
 * @type {constructor}
 */
const config = require('config');

const main = exports;

main.route = (req, res) => {
  res.render('dashboard.html', {
    tasks: config.get('tasks.formOptions'),
    message: config.get('defaults.mssa'),
    credentials: JSON.stringify(req.session.tokens)
  });
};
