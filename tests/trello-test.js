const chai = require('chai');
const http = require('http');
const app = require('../app');
const trello = require('../controller/trello');
const Contractor = require('../model/contractor');

const expect = chai.expect;

describe('addBoard', () => {
  it('should return an id for the created board', (done) => {
    app.set('port', '5000');
    const server = http.createServer(app);
    server.listen('5000');

    const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
    trello.addBoard(contractor)
      .then((result) => {
        expect(result).to.equal('testid_board'); // see mock-api.js for value returned by mock API
      })
      .then(() => {
        server.close(done);
      }
      );
  });
});

describe('addBoardMember', () => {
  it('should return an id for the created membership in the board', (done) => {
    app.set('port', '5000');
    const server = http.createServer(app);
    server.listen('5000');

    trello.addBoardMember('mock_board_id', 'mock_member_id')
      .then((result) => {
        expect(result).to.equal('testid_member'); // see mock-api.js for value returned by mock API
      })
      .then(() => {
        server.close(done);
      }
      );
  });
});

describe('addList', () => {
  it('should return an id for the created list', (done) => {
    app.set('port', '5000');
    const server = http.createServer(app);
    server.listen('5000');

    trello.addList('mock_board_id', 'mock_list')
      .then((result) => {
        expect(result).to.equal('testid_list'); // see mock-api.js for value returned by mock API
      })
      .then(() => {
        server.close(done);
      }
      );
  });
});

describe('addCard', () => {
  it('should return an id for the created card', (done) => {
    app.set('port', '5000');
    const server = http.createServer(app);
    server.listen('5000');

    trello.addCard('mock_list_id', 'description', 'mock_member_id')
      .then((result) => {
        expect(result).to.equal('testid_card'); // see mock-api.js for value returned by mock API
      })
      .then(() => {
        server.close(done);
      }
      );
  });
});
