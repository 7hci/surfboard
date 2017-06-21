/* eslint-disable */

jest.mock('log4js', () => require('./mocks/log4js'));
jest.mock('../server/lib/google-auth', () => require('./mocks/google-auth'));

const nock = require('nock');
const Contractor = require('./mocks/contractor');
const config = require('config');
const drive = require('../server/lib/drive');

describe('drive', () => {
  describe('createFolder', () => {
    it('should return an id for the created folder in Drive', () =>{
      const mockResponse = { id: 'testid_folder' };
      nock(config.get('google.baseUrl'))
        .post('/drive/v3/files')
        .query(true)
        .reply(200, mockResponse);
      return expect(drive.createFolder(new Contractor(), {})).resolves.toBe('testid_folder');
    });
  });
  describe('addFile', () => {
    it('should return an id for the file we have copied and moved', () => {
      const mockResponse = { id: 'testid_file' };
      nock(config.get('google.baseUrl'))
        .post(/drive\/v3\/files\/.*\/copy/)
        .query(true)
        .reply(200, mockResponse);
      const fileObj = { name: 'mock_file', id: 'mock_folder_id' };
      return expect(drive.addFile(new Contractor(), {}, fileObj, 'mock_file_id')).resolves.toBe('testid_file');
    });
  });
  describe('shareFolder', () => {
    });
    it('should return an id for the permission resource created', () => {
      const mockResponse = { id: 'testid_shared' };
      nock(config.get('google.baseUrl'))
        .post(/drive\/v3\/files\/.*\/permissions/)
        .query(true)
        .reply(200, mockResponse);
      return expect(drive.shareFolder(new Contractor(), {}, 'mock_folder_id')).resolves.toBe('testid_shared');
    });
  });
  describe('getTasksFromFile', () => {
    it('should return an array of comma delimited values', () => {
      const mockResponse = 'sample,tasks,list\nsample,tasks,list';
      nock(config.get('google.baseUrl'))
        .get(/drive\/v3\/files\/.*\/export/)
        .query(true)
        .reply(200, mockResponse);
      return expect(drive.getTasksFromFile({})).resolves.toBeInstanceOf(Array);
    });
    it('should throw if the HTTP request fails', () => {
      nock(config.get('google.baseUrl'))
        .get(/drive\/v3\/files\/.*\/export/)
        .query(true)
        .reply(404);
      return expect(drive.getTasksFromFile({})).rejects.toBeDefined();
  });
});
