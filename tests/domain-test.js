var chai = require('chai');
var expect = chai.expect;

var domain = require('../helper/domain');
var request = require('request-promise');
var config = require('config');

describe('createContractorEmail', () => {
  it('', (done) => {
    var url = config.get('google.baseUrl')
    request.get(url)
      .then((results) => {
        expect(results).to.equal(true);
      })
      .then(done, done);
  });

});