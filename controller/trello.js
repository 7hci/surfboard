/**
 * Handles all calls to Trello's API
 */
let request = require('request-promise').defaults({simple: false});
let config = require('config');
let logger = require('log4js').getLogger('app');
let Promise = require('bluebird');
let _ = require('lodash');
let drive = require('./drive');

let trello = exports;

/**
 * Main function for creating and populating the onboarding Trello board
 * @param contractor
 * @returns success/failure status message
 */
trello.createTrelloBoard = (contractor, credentials) => {
  return trello.addBoard(contractor)
    .then((boardId) => {
      return Promise.all(
        Promise.map(config.get('trello.team.members'), (member) => {
          trello.addBoardMember(boardId, member.id);
        }),
        trello.addList(boardId, 'Done')
          .then(() => {
            return trello.addList(boardId, 'In Progress')
          })
          .then(() => {
            return trello.addList(boardId, 'On Deck')
          })
          .then(() => {
            return Promise.all([trello.addList(boardId, 'To Do'), drive.getTasksFromFile(credentials)])
              .spread((listId, tasks) => {
                return Promise.mapSeries(tasks, (task) => {
                  let description = task.split(',')[0];
                  let memberName = task.split(',')[1];
                  return trello.addCard(listId, description, memberName);
                });
              })
          })
      );
    })
    .then(() => {
        return {'text': 'Created board on Trello', 'status': 'success'};
      }
    )
    .catch((err) => {
      logger.error(err);
      return {'text': 'Problem creating board on Trello', 'status': 'failure'};
    });
};

/**
 * Helper function to make a request to add a new Trello board
 * @param contractor
 * @returns the board id
 * @throws error if no board was created
 */
trello.addBoard = (contractor) => {
  let trelloUrl = config.get('trello.baseUrl') + '/boards';
  let boardName = 'Onboarding: ' + contractor.getFullName();

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
      let responseData = JSON.parse(JSON.stringify(response));
      if ('id' in responseData) {
        return responseData.id;
      } else {
        throw new Error('No id in create board response: ' + responseData);
      }
    });
};

/**
 * Helper function to make a request to add a member to a Trello board
 * @param boardId the id of the board
 * @param memberId the id of the member being added
 * @returns the member id
 * @throws error if the member couldn't be added
 */
trello.addBoardMember = (boardId, memberId) => {
  let trelloUrl = config.get('trello.baseUrl') + '/boards/' + boardId + '/members/' + memberId;

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
      let responseData = JSON.parse(JSON.stringify(response));
      if ('id' in responseData) {
        return responseData.id;
      } else {
        throw new Error('No id in add member response: ' + responseData);
      }
    });
};

/**
 * Helper function to make a request to add a new list to an existing Trello board
 * @param boardId the id of the board
 * @param listName the name of the list being added
 * @returns the list id
 * @throws error if no list was created
 */
trello.addList = (boardId, listName) => {
  let trelloUrl = config.get('trello.baseUrl') + '/lists';

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
      let responseData = JSON.parse(JSON.stringify(response));
      if ('id' in responseData) {
        return responseData.id;
      } else {
        throw new Error('No id in create list response: ' + responseData);
      }
    });
};

/**
 * Helper function to make a request to add a card to a list
 * @param listId the id of the list the card is being added to
 * @param description what will appear on the card
 * @param memberName the name (**not** id) of the member this card is assigned to
 * @returns the card id
 * @throws error if no card was created
 */
trello.addCard = (listId, description, memberName) => {
  let trelloUrl = config.get('trello.baseUrl') + '/cards';

  return request.post({
    url: trelloUrl,
    qs: {
      token: config.get('trello.token'),
      key: config.get('trello.key')
    },
    json: true,
    body: {
      'name': description,
      'idList': listId,
      'idMembers': [trello.getMemberId(memberName)]
    }
  })
    .then((response) => {
      let responseData = JSON.parse(JSON.stringify(response));
      if ('id' in responseData) {
        return responseData.id;
      } else {
        throw new Error('No id in create card response: ' + responseData);
      }
    });
};

/**
 * Helper function to get a member's id
 * @param memberName the member's name as listed in the config
 * @returns the member id
 */
trello.getMemberId = (memberName) => {
  let member = _.find(config.get('trello.team.members'), {'name': memberName});
  if (typeof member !== 'undefined') {
    return member.id;
  } else {
    return "";
  }
};