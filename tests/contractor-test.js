var chai = require('chai');
var expect = chai.expect;

var Contractor = require('../model/contractor');

describe('Contractor', () => {
  it('should return the full name separated by a space', () => {
    var contractor = new Contractor('Jon','Snow', true, 'jonsnow@gmail.com');

    expect(contractor.getFullName()).to.equal('Jon Snow');
  });
  it('should return a sanitized, lowercase e-mail address', () => {
    var contractor = new Contractor(' J 6.$;~&*on', 'SNO40"\'\'?w ', true, '');

    expect(contractor.getEmail()).to.equal('jon.snow@7hci.com');
  });
});