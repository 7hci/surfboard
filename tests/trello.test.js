/* eslint-disable */

jest.mock('log4js', () => require('./mocks/log4js'));

const nock = require('nock');
const config = require('config');
const trello = require('../server/lib/trello');
const NewHire = require('./mocks/newhire');

const newHire = new NewHire({
  firstName: 'Jon',
  lastName: 'Snow',
  privateEmail: 'jonsnow@thenorth.com',
  override: '',
  isResident: true,
  contractId: 'testid_contract',
  folderId: 'testid_folder'
});

describe('trello', () => {
  describe('addBoard', () => {
    it('should return an id for the created board', () => {
      const mockResponse = { id: 'testid_board' };
      nock(config.get('trello.baseUrl'))
        .post('/boards')
        .query(true)
        .reply(200, mockResponse);
      return expect(trello.addBoard(newHire)).resolves.toBe('testid_board');
    });
  });

  describe('addBoardMember', () => {
    it('should return an id for the created membership in the board', () => {
      const mockResponse = { id: 'testid_member' };
      nock(config.get('trello.baseUrl'))
        .put(/boards\/.*\/members\/.*/)
        .query(true)
        .reply(200, mockResponse);
      return expect(trello.addBoardMember('mock_board_id', 'mock_member_id')).resolves.toBe('testid_member');
    });
  });
  describe('addList', () => {
    it('should return an id for the created list', () => {
      const mockResponse = { id: 'testid_list' };
      nock(config.get('trello.baseUrl'))
        .post('/lists')
        .query(true)
        .reply(200, mockResponse);
      return expect(trello.addList('mock_board_id', 'mock_list')).resolves.toBe('testid_list');
    });
  });
  describe('addCard', () => {
    it('should return an id for the created card', () => {
      const mockResponse = { id: 'testid_card' };
      nock(config.get('trello.baseUrl'))
        .post(/cards.*/)
        .query(true)
        .reply(200, mockResponse);
      return expect(trello.addCard('mock_list_id', 'description', 'mock_member_id')).resolves.toBe('testid_card');
    });
  });
});

