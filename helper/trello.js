let Promise = require('bluebird');

let trello = exports;

trello.createTrelloBoard = (contractor) => {
  return Promise.resolve({'text': 'Created board on Trello', 'status': 'success'});
};