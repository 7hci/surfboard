const chai = require('chai');
const Contractor = require('../classes/contractor');

const expect = chai.expect;

describe('Contractor', () => {
  it('should return the full name separated by a space', () => {
    const contractor = new Contractor('Jon', 'Snow', true, 'jonsnow@gmail.com');

    expect(contractor.getFullName()).to.equal('Jon Snow');
  });

  it('should return a sanitized, lowercase e-mail address', () => {
    const contractor = new Contractor(' J 6.$;~&*on', 'SNO40"\'\'?w ', true, '');

    expect(contractor.getEmail()).to.equal('jon.snow@7hci.com');
  });

  it('should use override if one is given through the constructor', () => {
    const contractor = new Contractor('Jonathan', 'Stark', true, '', 'jonsnow');

    expect(contractor.getEmail()).to.equal('jonsnow@7hci.com');
  });
});
