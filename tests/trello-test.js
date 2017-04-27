const chai = require('chai');
const nock = require('nock');
const config = require('config');
const trello = require('../controller/trello');
const Contractor = require('../model/contractor');

const expect = chai.expect;

describe('trello', () => {
  describe('addBoard', () => {
    before((done) => {
      const mockResponse = { id: 'testid_board' };
      nock(config.get('trello.baseUrl'))
        .post('/boards')
        .query(true)
        .reply(200, mockResponse);
      done();
    });
    it('should return an id for the created board', (done) => {
      const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
      trello.addBoard(contractor)
        .then((result) => {
          expect(result).to.equal('testid_board');
        })
        .then(() => {
          done();
        }
        );
    });
  });

  describe('addBoardMember', () => {
    before((done) => {
      const mockResponse = { id: 'testid_member' };
      nock(config.get('trello.baseUrl'))
        .put(/boards\/.*\/members\/.*/)
        .query(true)
        .reply(200, mockResponse);
      done();
    });
    it('should return an id for the created membership in the board', (done) => {
      trello.addBoardMember('mock_board_id', 'mock_member_id')
        .then((result) => {
          expect(result).to.equal('testid_member');
        })
        .then(() => {
          done();
        }
        );
    });
  });

  describe('addList', () => {
    before((done) => {
      const mockResponse = { id: 'testid_list' };
      nock(config.get('trello.baseUrl'))
        .post('/lists')
        .query(true)
        .reply(200, mockResponse);
      done();
    });
    it('should return an id for the created list', (done) => {
      trello.addList('mock_board_id', 'mock_list')
        .then((result) => {
          expect(result).to.equal('testid_list');
        })
        .then(() => {
          done();
        }
        );
    });
  });

  describe('addCard', () => {
    before((done) => {
      const mockResponse = { id: 'testid_card' };
      nock(config.get('trello.baseUrl'))
        .post(/cards.*/)
        .query(true)
        .reply(200, mockResponse);
      done();
    });
    it('should return an id for the created card', (done) => {
      trello.addCard('mock_list_id', 'description', 'mock_member_id')
        .then((result) => {
          expect(result).to.equal('testid_card');
        })
        .then(() => {
          done();
        }
        );
    });
  });
});

