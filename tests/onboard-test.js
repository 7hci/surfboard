let chai = require('chai');
let expect = chai.expect;
let rewire = require('rewire');

let Contractor = require('../model/contractor');
let onboard = require('../routes/onboard');

describe('runCheckedTasks', () => {
  let contractor = new Contractor('Jon','Snow', true, 'jonsnow@gmail.com');
  let checkedTasks = {
    createContractorEmail: 'on',
    createTrelloBoard: 'on',
    sendLoginEmail: 'on',
    addAndShareDriveFolder: 'on',
    sendDriveEmail: 'on',
    inviteToSlack: 'on'
  };

  it('should return text and status for every checked task', () => {
    onboard.runCheckedTasks(checkedTasks, contractor).then((results) => {
      results.forEach( (result) => {
        expect(result).to.include.keys('text', 'status');
      });
      expect(results.length).to.equal(Object.keys(checkedTasks).length);
    })
  });

  checkedTasks = {
    createTrelloBoard: 'on',
    sendLoginEmail: 'on',
    addAndShareDriveFolder: 'on',
    sendDriveEmail: 'on',
    inviteToSlack: 'on'
  };

  it('should return text and status for every checked task even if createContractorEmail is not checked', () => {
    onboard.runCheckedTasks(checkedTasks, contractor).then((results) => {
      results.forEach( (result) => {
        expect(result).to.include.keys('text', 'status');
      });
      expect(results.length).to.equal(Object.keys(checkedTasks).length);
    })
  });
});