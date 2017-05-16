const chai = require('chai');
const chaiPromise = require('chai-as-promised');
const proxyquire = require('proxyquire');
const mock = require('./mocks');
const nock = require('nock');
const config = require('config');

chai.use(chaiPromise);
const expect = chai.expect;
const drive = proxyquire('../dist/lib/drive', { './google-auth': mock.auth });

describe('drive', () => {
  describe('createFolder', () => {
    before(() => {
      const mockResponse = { id: 'testid_folder' };
      nock(config.get('google.baseUrl'))
        .post('/drive/v3/files')
        .query(true)
        .reply(200, mockResponse);
    });
    it('should return an id for the created folder in Drive', () =>
      expect(drive.createFolder(mock.contractor, {})).to.eventually.equal('testid_folder'));
  });
  describe('addFile', () => {
    before(() => {
      const mockResponse = { id: 'testid_file' };
      nock(config.get('google.baseUrl'))
        .post(/drive\/v3\/files\/.*\/copy/)
        .query(true)
        .reply(200, mockResponse);
    });
    it('should return an id for the file we have copied and moved', () => {
      const fileObj = { name: 'mock_file', id: 'mock_folder_id' };
      return expect(drive.addFile(mock.contractor, {}, fileObj, 'mock_file_id')).to.eventually.equal('testid_file');
    });
  });
  describe('shareFolder', () => {
    before(() => {
      const mockResponse = { id: 'testid_shared' };
      nock(config.get('google.baseUrl'))
        .post(/drive\/v3\/files\/.*\/permissions/)
        .query(true)
        .reply(200, mockResponse);
    });
    it('should return an id for the permission resource created', () =>
      expect(drive.shareFolder(mock.contractor, {}, 'mock_folder_id')).to.eventually.equal('testid_shared'));
  });
  describe('getTasksFromFile', () => {
    before(() => {
      const mockResponse = 'sample,tasks,list\nsample,tasks,list';
      nock(config.get('google.baseUrl'))
        .get(/drive\/v3\/files\/.*\/export/)
        .query(true)
        .reply(200, mockResponse);
    });
    // eslint-disable-next-line arrow-body-style
    it('should return an array of comma delimited values', () => {
      return expect(drive.getTasksFromFile({})).to.eventually.be.instanceof(Array);
    });
    before(() => {
      nock(config.get('google.baseUrl'))
        .get(/drive\/v3\/files\/.*\/export/)
        .query(true)
        .reply(404);
    });
    // eslint-disable-next-line arrow-body-style
    it('should throw if the HTTP request fails', () => {
      return expect(drive.getTasksFromFile({})).to.be.rejectedWith(Error);
    });
  });
});
