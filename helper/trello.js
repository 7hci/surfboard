var request = require('request-promise').defaults({simple: false});
var config = require('config');
var auth = require('../helper/auth');
var Promise = require('bluebird');

var trello = exports;

trello.createTrelloBoard = (contractor) => {
  return Promise.resolve({'text': 'Created board on Trello', 'status': 'success'});
};

trello.addBoard = (contractor) => {
  var trelloUrl = config.get('google.baseUrl') + '/boards';
  var boardName = 'Onboarding: ' + contractor.getFullName();

  return request.post({
    url: trelloUrl,
    qs: {
      token: config.get('trello.token'),
      key: config.get('trello.key')
    },
    json: true,
    body: {'name': boardName,
      'defaultLists': false,
      'idOrganization': config.get('trello.team.id'),
      'prefs_permissionLevel': 'org'
    }
  })
    .then( (response) => {
      var responseData = JSON.parse(JSON.stringify(response));
      if ('id' in responseData) {
        return responseData.id;
      } else {
        throw new Error('No id in create board response: ' + responseData);
      }
    });
};

trello.addBoardMember = (boardId, memberId) => {
  var trelloUrl = config.get('google.baseUrl') + '/boards/'+ boardId +'/members/' + memberId;

  return request.put({
    url: trelloUrl,
    qs: {
      token: config.get('trello.token'),
      key: config.get('trello.key')
    },
    json: true,
    body: {
      'type': 'admin',
    }
  })
    .then( (response) => {
      var responseData = JSON.parse(JSON.stringify(response));
      if ('id' in responseData) {
        return responseData.id;
      } else {
        throw new Error('No id in add member response: ' + responseData);
      }
    });
};

trello.addList = (boardId) => {

};

trello.addCard = (listId, description, memberId) => {

};