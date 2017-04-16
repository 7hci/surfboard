var Promise = require('bluebird');

var trello = exports;

trello.createTrelloBoard = (contractor) => {
  return Promise.resolve({'text': 'Created board on Trello', 'status': 'success'});
};

trello.addBoard = (contractor) => {
 
};

trello.addBoardMember = (boardId, memberId) => {

};

trello.addList = (boardId) => {

};

trello.addCard = (listId, description, memberId) => {

};