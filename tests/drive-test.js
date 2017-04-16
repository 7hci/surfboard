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

    var contractor = new Contractor("Jon", "Snow", true, "danielrearden@google.com");
    drive.createFolder(contractor, {})
      .then((result) => {
        expect(result).to.equal("testid"); // see mock-api.js for value returned by mock API
      })
      .then(() => {
          server.close(done);
        }
      )
      .catch(done, done);
  });
});

describe('addFiles', () => {
  it('should return an id for the last file copied and moved into new folder', (done) => {
    app.set('port', '5000');
    var server = http.createServer(app);
    server.listen('5000');

    var contractor = new Contractor("Jon", "Snow", true, "danielrearden@google.com");
    drive.addFiles(contractor, {})
      .then((result) => {
        expect(result).to.equal("testid"); // see mock-api.js for value returned by mock API
      })
      .then(() => {
          server.close(done);
        }
      )
      .catch(done, done);
  });
});