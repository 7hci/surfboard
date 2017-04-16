var chai = require('chai');
var expect = chai.expect;
var rewire = require('rewire');
var http = require('http');

var app = require('../app');
var drive = rewire('../helper/drive');
var Contractor = require('../model/contractor');
var mock = require('./mocks');

drive.__set__('auth', mock.auth);

describe('createFolder', () => {
  it('should return an id for the created folder in Drive', (done) => {
    app.set('port', '5000');
    var server = http.createServer(app);
    server.listen('5000');

    var contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
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
    var server = http.createServer(app);
    server.listen('5000');

    var contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
    drive.addFile(contractor, {}, {
      'name': 'mock_file',
      'id': 'mock_folder_id'
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
    var server = http.createServer(app);
    server.listen('5000');

    var contractor = new Contractor('Jon', 'Snow', true, 'danielrearden@google.com');
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
  it('should return a comma delimited list', (done) => {
    app.set('port', '5000');
    var server = http.createServer(app);
    server.listen('5000');

    drive.getTasksFromFile({})
      .then((result) => {
        expect(result).to.contain(',');
      })
      .then(() => {
          server.close(done);
        }
      )
      .catch(done, done);
  });
});