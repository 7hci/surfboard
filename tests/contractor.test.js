/* eslint-disable */
const Contractor = require('../dist/server/classes/contractor');

describe('Contractor', () => {
  it('should return the full name separated by a space', () => {
    const contractor = new Contractor({
      firstName: 'Jon',
      lastName: 'Snow',
      isResident: true,
      email: 'danielrearden@gmail.com',
      override: '',
      contractId: 'testId',
      folderId: 'testId'
    });

    expect(contractor.getFullName()).toEqual('Jon Snow');
  });

  it('should return a sanitized, lowercase e-mail address', () => {
    const contractor = new Contractor({
      firstName: ' J 6.$;~&*on',
      lastName: 'SNO40"\'\'?w ',
      isResident: true,
      email: 'danielrearden@gmail.com',
      override: '',
      contractId: 'testId',
      folderId: 'testId'
    });

    expect(contractor.getEmail()).toEqual('jon.snow@7hci.com');
  });

  it('should use override if one is given through the constructor', () => {
    const contractor = new Contractor({
      firstName: 'Jonathan',
      lastName: 'Stark',
      isResident: true,
      email: 'danielrearden@gmail.com',
      override: 'jonsnow',
      contractId: 'testId',
      folderId: 'testId'
    });

    expect(contractor.getEmail()).toEqual('jonsnow@7hci.com');
  });
});
