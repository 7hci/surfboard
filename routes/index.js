var express = require('express');
var config = require('config');
var router = express.Router();
var request = require('request-promise');
var Promise = require('bluebird');
var google = require('googleapis');
var _ = require('lodash')

router.get('/', function (req, res) {
  if ('tokens' in req.session) {
    res.render('index.html', {tasks: config.get('tasks.formOptions')});
  } else {
    res.redirect(getAuthUrl());
  }
});

router.post('/onboard', function (req, res) {
  getAccessToken(req.session.tokens)
    .then( function (token) {
      return getUserInfo(token)
    })
    .then( function (info) {
      var user_email = info.emailAddress;
      if (hasValidDomain(user_email)) {
        var contractor = captureContractorInfo(req.body);

        runCheckedTasks(req.body, contractor)
          .then( function (results){
            res.render('index.html',{ messages: results, contractor: contractor })
          })
          .catch( function (err) {
            res.render('error.html', {error: err});
          });

      } else {
        res.render('error.html', {errorMessage: 'Access restricted due to domain mismatch.'})
      }
    })
    .catch(function (err) {
      res.render('error.html', {error: err});
    });
});

router.get('/oauth2callback', function (req, res) {
  var oauth2Client = getOAuthClient();
  var code = req.query.code;
  oauth2Client.getTokenAsync(code)
    .then( function(tokens) {
      oauth2Client.setCredentials(tokens);
      req.session['tokens'] = tokens;
      res.redirect('/');
  })
    .catch( function (error) {
      res.render('error.html', {error: error});
  });
});

function runCheckedTasks(checkedTasks, contractor) {
  var taskMap = {
    'sendLoginEmail': sendLoginEmail,
      'addAndShareDriveFolder': addAndShareDriveFolder,
      'sendDriveEmail': sendDriveEmail,
      'inviteToSlack': inviteToSlack,
  }
  var tasksAfterEmailCreation =
    _.reduce( checkedTasks, (result, value, key) => {
      if (taskMap[key]) {
        var curried = _.curry(taskMap[key]);
        result.push(curried(contractor));
      }
      return result;
    }, []);
  var tasksToRun=[];
  if ('createContractorEmail' in checkedTasks) {
    tasksToRun.push(createContractorEmail(contractor)
      .then(function (addedEmail){
        return Promise.all(tasksAfterEmailCreation)
          .then(function (selectedTasksCompleted) {
            selectedTasksCompleted.push(addedEmail);
            return selectedTasksCompleted;
          })
      }))
  } else {
    tasksToRun.push(tasksAfterEmailCreation)
  }
  if ('createTrelloBoard' in checkedTasks) {
    tasksToRun.push(createTrelloBoard(contractor));
  }

  return Promise.all(tasksToRun)
    .then(function (results) {
      console.log(results);
      return _.flattenDeep(results);
    })
}

function createContractorEmail(contractor) {
  return Promise.resolve({'text': 'Added ' + contractor.getEmail() + ' to domain', 'status': 'success'});
}

function createTrelloBoard(contractor) {
  return Promise.resolve({'text': 'Created board on Trello', 'status': 'success'});
}

function sendLoginEmail(contractor) {
  return Promise.resolve({'text': 'Sent login info to contractor', 'status': 'success'});
}

function addAndShareDriveFolder(contractor) {
  return Promise.resolve({'text': 'Created and shared Drive folder', 'status': 'success'});
}

function sendDriveEmail(contractor) {
  return Promise.resolve({'text': 'Sent document instructions to contractor', 'status': 'success'});
}

function inviteToSlack(contractor) {
  return Promise.resolve({'text': 'Invited to Slack', 'status': 'success'});
}

function getOAuthClient() {
  var oauth = new google.auth.OAuth2(
    config.get('google.clientId'),
    config.get('google.clientSecret'),
    config.get('google.redirectUri')
  );
  return Promise.promisifyAll(oauth);
}

function getAuthUrl() {
  var oauth2Client = getOAuthClient();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: config.get('google.scope'),
    hd: '7hci.com'
  });
}

function getAccessToken(credentials) {
  var oauth2Client = getOAuthClient();
  oauth2Client.setCredentials(credentials);
  return oauth2Client.getAccessTokenAsync();
}

function hasValidDomain(emailAddress) {
  return emailAddress.split('@')[1].toLowerCase() === '7hci.com'
}

function getUserInfo(access_token) {

  var profile_url = 'https://www.googleapis.com/gmail/v1/users/me/profile';
  return request.get({url: profile_url, qs: {access_token: access_token}, json: true});
}

function captureContractorInfo(formData) {
  var firstName = formData.firstName;
  var lastName = formData.lastName;
  var isResident = 'resident' in formData;
  var privateEmail = formData.email;

  return new Contractor(firstName, lastName, isResident, privateEmail);
}

class Contractor {
  constructor(firstName, lastName, isResident, privateEmail) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.isResident = isResident;
    this.privateEmail = privateEmail;
  }

  getFullName() {
    return this.firstName + ' ' + this.lastName;
  }

  getEmail() {
    var pattern = /[^a-zA-Z]/;
    var sanitizedFirst = this.firstName.replace(pattern, '').toLowerCase();
    var sanitizedLast = this.lastName.replace(pattern, '').toLowerCase();

    return sanitizedFirst + '.' + sanitizedLast + '@7hci.com';
  }
}

module.exports = router;
