const chai = require('chai');
const proxyquire = require('proxyquire');
const http = require('http');
const app = require('../app');
const Contractor = require('../model/contractor');
const mock = require('./mocks');

const expect = chai.expect;

const drive = proxyquire('../controller/drive', { './google-auth': mock.auth });

describe('createFolder', () => {
  it('should return an id for the created folder in Drive', (done) => {
    app.set('port', '5000');
    const server = http.createServer(app);
    server.listen('5000');

    const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
    drive.createFolder(contractor, {})
      .then((result) => {
        expect(result).to.equal('testid_folder'); // see mock-api.js for value returned by mock API
      })
      .then(() => {
        server.close(done);
      }
      )
      .catch(done, done);
  });
});

describe('addFile', () => {
  it('should return an id for the file we have copied and moved', (done) => {
    app.set('port', '5000');
    const server = http.createServer(app);
    server.listen('5000');

    const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
    drive.addFile(contractor, {}, {
      name: 'mock_file',
      id: 'mock_folder_id'
    }, 'mock_file_id')
      .then((result) => {
        expect(result).to.equal('testid_file'); // see mock-api.js for value returned by mock API
      })
      .then(() => {
        server.close(done);
      }
      )
      .catch(done, done);
  });
});

describe('shareFolder', () => {
  it('should return an id for the permission resource created', (done) => {
    app.set('port', '5000');
    const server = http.createServer(app);
    server.listen('5000');

    const contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
    drive.shareFolder(contractor, {}, 'mock_folder_id')
      .then((result) => {
        expect(result).to.equal('testid_shared'); // see mock-api.js for value returned by mock API
      })
      .then(() => {
        server.close(done);
      }
      )
      .catch(done, done);
  });
});

describe('getTasksFromFile', () => {
  it('should return an array of comma delimited values', (done) => {
    app.set('port', '5000');
    const server = http.createServer(app);
    server.listen('5000');

    drive.getTasksFromFile({})
      .then((result) => {
        expect(result).to.be.instanceof(Array);
      })
      .then(() => {
        server.close(done);
      }
      );
  });
});
