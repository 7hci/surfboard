var request = require('request-promise').defaults({simple: false});
var config = require('config');
var Promise = require('bluebird');
var _ = require('lodash');
var auth = require('../helper/auth');
var drive = require('../helper/drive');

var trello = exports;

trello.createTrelloBoard = (contractor, credentials) => {
  return trello.addBoard(contractor)
    .then((boardId) => {
      var toDoAfterBoardCreated = [];
      for (var member of config.get('trello.team.members')) {
        toDoAfterBoardCreated.push(trello.addBoardMember(boardId, member.id));
      }
      toDoAfterBoardCreated.push(trello.addList(boardId, 'Done'));
      toDoAfterBoardCreated.push(trello.addList(boardId, 'In Progress'));
      toDoAfterBoardCreated.push(trello.addList(boardId, 'On Deck'));
      toDoAfterBoardCreated.push(
        Promise.all([trello.addList(boardId, 'To Do'), drive.getTasksFromFile(credentials)])
          .spread( (listId, tasks) => {
            var cardsToAdd = [];
            for (var task of tasks) {
              var description = task.split(',')[0];
              var memberName = task.split(',')[1];
              cardsToAdd.push(trello.addCard(listId, description, memberName));
            }
            return Promise.all(cardsToAdd);
          })
      );

      return Promise.all(toDoAfterBoardCreated);
    })
    .then(() => {
        return Promise.resolve({'text': 'Created board on Trello', 'status': 'success'});
      }
    )
    .catch((err) => {
      console.log(err);
      return Promise.resolve({'text': 'Problem creating board on Trello', 'status': 'failure'});
    });
};

trello.addBoard = (contractor) => {
  var trelloUrl = config.get('trello.baseUrl') + '/boards';
  var boardName = 'Onboarding: ' + contractor.getFullName();

  return request.post({
    url: trelloUrl,
    qs: {
      token: config.get('trello.token'),
      key: config.get('trello.key')
    },
    json: true,
    body: {
      'name': boardName,
      'defaultLists': false,
      'idOrganization': config.get('trello.team.id'),
      'prefs_permissionLevel': 'org'
    }
  })
    .then((response) => {
      var responseData = JSON.parse(JSON.stringify(response));
      if ('id' in responseData) {
        return responseData.id;
      } else {
        throw new Error('No id in create board response: ' + responseData);
      }
    });
};

trello.addBoardMember = (boardId, memberId) => {
  var trelloUrl = config.get('trello.baseUrl') + '/boards/' + boardId + '/members/' + memberId;

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
    .then((response) => {
      var responseData = JSON.parse(JSON.stringify(response));
      if ('id' in responseData) {
        return responseData.id;
      } else {
        throw new Error('No id in add member response: ' + responseData);
      }
    });
};

trello.addList = (boardId, listName) => {
  var trelloUrl = config.get('trello.baseUrl') + '/lists';

  return request.post({
    url: trelloUrl,
    qs: {
      token: config.get('trello.token'),
      key: config.get('trello.key')
    },
    json: true,
    body: {
      'name': listName,
      'idBoard': boardId
    }
  })
    .then((response) => {
      var responseData = JSON.parse(JSON.stringify(response));
      if ('id' in responseData) {
        return responseData.id;
      } else {
        throw new Error('No id in create list response: ' + responseData);
      }
    });
};

trello.addCard = (listId, description, memberName) => {
  var trelloUrl = config.get('trello.baseUrl') + '/cards';

  return request.post({
    url: trelloUrl,
    qs: {
      token: config.get('trello.token'),
      key: config.get('trello.key')
    },
    json: true,
    body: {
      'name': description,
      'idList ': listId,
      'idMembers': [trello.getMemberId(memberName)]
    }
  })
    .then((response) => {
      var responseData = JSON.parse(JSON.stringify(response));
      if ('id' in responseData) {
        return responseData.id;
      } else {
        throw new Error('No id in create card response: ' + responseData);
      }
    });
};

trello.getMemberId = (memberName) => {
  var member = _.find(config.get('trello.team.members'), {'name': memberName });
  if (typeof member !== 'undefined') {
    return member.id;
  } else {
    return "";
  }
};