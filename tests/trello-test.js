var chai = require('chai');
var expect = chai.expect;
var rewire = require('rewire');
var http = require('http');

var app = require('../app');
var trello = rewire('../helper/trello');
var Contractor = require('../model/contractor');
var mock = require('./mocks');

trello.__set__('auth', mock.auth);

describe('addBoard', () => {
  it('should return an id for the created board', (done) => {
    app.set('port', '5000');
    var server = http.createServer(app);
    server.listen('5000');

    var contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
    trello.addBoard(contractor)
      .then((result) => {
        expect(result).to.equal('testid_board'); // see mock-api.js for value returned by mock API
      })
      .then(() => {
          server.close(done);
        }
      )
      .catch(done, done);
  });
});

describe('addBoardMember', () => {
  it('should return an id for the created membership in the board', (done) => {
    app.set('port', '5000');
    var server = http.createServer(app);
    server.listen('5000');

    trello.addBoardMember('mock_board_id', 'mock_member_id')
      .then((result) => {
        expect(result).to.equal('testid_member'); // see mock-api.js for value returned by mock API
      })
      .then(() => {
          server.close(done);
        }
      )
      .catch(done, done);
  });
});

describe('addList', () => {
  it('should return an id for the created list', (done) => {
    app.set('port', '5000');
    var server = http.createServer(app);
    server.listen('5000');

    trello.addList('mock_board_id', 'mock_list')
      .then((result) => {
        expect(result).to.equal('testid_list'); // see mock-api.js for value returned by mock API
      })
      .then(() => {
          server.close(done);
        }
      )
      .catch(done, done);
  });
});

describe('addCard', () => {
  it('should return an id for the created card', (done) => {
    app.set('port', '5000');
    var server = http.createServer(app);
    server.listen('5000');

    trello.addCard('mock_list_id', 'description', 'mock_member_id')
      .then((result) => {
        expect(result).to.equal('testid_card'); // see mock-api.js for value returned by mock API
      })
      .then(() => {
          server.close(done);
        }
      )
      .catch(done, done);
  });
});