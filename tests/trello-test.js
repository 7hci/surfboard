const chai = require('chai');
const chaiPromise = require('chai-as-promised');
const nock = require('nock');
const config = require('config');
const trello = require('../lib/trello');
const Contractor = require('../classes/contractor');

chai.use(chaiPromise);
const expect = chai.expect;

describe('trello', () => {
  describe('addBoard', () => {
    before(() => {
      const mockResponse = { id: 'testid_board' };
      nock(config.get('trello.baseUrl'))
        .post('/boards')
        .query(true)
        .reply(200, mockResponse);
    });
    it('should return an id for the created board', () => {
      const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
      return expect(trello.addBoard(contractor)).to.eventually.equal('testid_board');
    });
  });

  describe('addBoardMember', () => {
    before(() => {
      const mockResponse = { id: 'testid_member' };
      nock(config.get('trello.baseUrl'))
        .put(/boards\/.*\/members\/.*/)
        .query(true)
        .reply(200, mockResponse);
    });
    it('should return an id for the created membership in the board', () => {
      return expect(trello.addBoardMember('mock_board_id', 'mock_member_id')).to.eventually.equal('testid_member');
    });
  });
  describe('addList', () => {
    before(() => {
      const mockResponse = { id: 'testid_list' };
      nock(config.get('trello.baseUrl'))
        .post('/lists')
        .query(true)
        .reply(200, mockResponse);
    });
    it('should return an id for the created list', () => {
      return expect(trello.addList('mock_board_id', 'mock_list')).to.eventually.equal('testid_list');
    });
  });
  describe('addCard', () => {
    before(() => {
      const mockResponse = { id: 'testid_card' };
      nock(config.get('trello.baseUrl'))
        .post(/cards.*/)
        .query(true)
        .reply(200, mockResponse);
    });
    it('should return an id for the created card', () => {
      return expect(trello.addCard('mock_list_id', 'description', 'mock_member_id')).to.eventually.equal('testid_card');
    });
  });
});

