const chai = require('chai');
const proxyquire = require('proxyquire');
const Contractor = require('../model/contractor');
const mock = require('./mocks');
const nock = require('nock');
const config = require('config');

const expect = chai.expect;
const drive = proxyquire('../controller/drive', { './google-auth': mock.auth });

describe('drive', () => {
  describe('createFolder', () => {
    before((done) => {
      const mockResponse = { id: 'testid_folder' };
      nock(config.get('google.baseUrl'))
        .post('/drive/v3/files')
        .query(true)
        .reply(200, mockResponse);
      done();
    });
    it('should return an id for the created folder in Drive', (done) => {
      const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
      drive.createFolder(contractor, {})
        .then((result) => {
          expect(result).to.equal('testid_folder'); // see mock-api.js for value returned by mock API
        })
        .then(() => {
          done();
        }
        )
        .catch(done, done);
    });
  });
  describe('addFile', () => {
    before((done) => {
      const mockResponse = { id: 'testid_file' };
      nock(config.get('google.baseUrl'))
        .post(/drive\/v3\/files\/.*\/copy/)
        .query(true)
        .reply(200, mockResponse);
      done();
    });
    it('should return an id for the file we have copied and moved', (done) => {
      const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
      drive.addFile(contractor, {}, {
        name: 'mock_file',
        id: 'mock_folder_id'
      }, 'mock_file_id')
        .then((result) => {
          expect(result).to.equal('testid_file'); // see mock-api.js for value returned by mock API
        })
        .then(() => {
          done();
        }
        )
        .catch(done, done);
    });
  });
  describe('shareFolder', () => {
    before((done) => {
      const mockResponse = { id: 'testid_shared' };
      nock(config.get('google.baseUrl'))
        .post(/drive\/v3\/files\/.*\/permissions/)
        .query(true)
        .reply(200, mockResponse);
      done();
    });
    it('should return an id for the permission resource created', (done) => {
      const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
      drive.shareFolder(contractor, {}, 'mock_folder_id')
        .then((result) => {
          expect(result).to.equal('testid_shared'); // see mock-api.js for value returned by mock API
        })
        .then(() => {
          done();
        }
        )
        .catch(done, done);
    });
  });
  describe('getTasksFromFile', () => {
    before((done) => {
      const mockResponse = 'sample,tasks,list\nsample,tasks,list';
      nock(config.get('google.baseUrl'))
        .get(/drive\/v3\/files\/.*\/export/)
        .query(true)
        .reply(200, mockResponse);
      done();
    });
    it('should return an array of comma delimited values', (done) => {
      drive.getTasksFromFile({})
        .then((result) => {
          expect(result).to.be.instanceof(Array);
        })
        .then(() => {
          done();
        }
        );
    });
  });
});
