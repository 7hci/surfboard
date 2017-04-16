var request = require('request-promise').defaults({simple: false});
var config = require('config');
var auth = require('../helper/auth');
var template = require('string-template');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

var gmail = exports;

gmail.sendDriveEmail = (contractor, credentials) => {
  var tokenPromise = auth.getAccessToken(credentials);
  var messagePromise = gmail.createMessageFromFile(contractor, './data/required.txt');

  return Promise.all([tokenPromise, messagePromise])
    .spread((token, message) => {
      var gmailUrl = config.get('google.baseUrl') + '/gmail/v1/users/me/messages/send';
      return request.post({
        url: gmailUrl,
        qs: {
          access_token: token,
          userId: "me"},
        json: true,
        body: {
          "raw": gmail.getEncodedData(message)
        }
      })
    })
    .then((response) => {
      var userData = JSON.parse(JSON.stringify(response));
      if ('id' in userData) {
        return {'text': 'Sent required documents instructions', 'status': 'success'};
      } else {
        return {'text': 'Problem sending required documents instructions', 'status': 'failure'};
      }
    })
    .catch((err) => {
      return {'text': 'Problem sending required documents instructions', 'status': 'failure'};
    });
};

gmail.sendLoginEmail = (contractor, credentials) => {
  return Promise.resolve({'text': 'Sent document instructions to contractor', 'status': 'success'});
};

gmail.createMessageFromFile = (contractor, file) => {
  return fs.readFileAsync(file,  'utf-8').then( (text) => {

    var form;
    if (contractor.isResident) {
      form = "W-9";
    } else {
      form = "W-8BEN"
    }

    return template(text, {
      name: contractor.firstName,
      form: form
    })
  });
};

gmail.getEncodedData = (contractor, message) => {
  var subject = "Required Documents";
  var rawData = [
    "Content-Type: text/plain; charset=\"UTF-8\"\n",
    "MIME-Version: 1.0\n",
    "Content-Transfer-Encoding: 7bit\n",
    "to: ", contractor.privateEmail, "\n",
    "subject: ", subject, "\n\n",
    message
  ].join('');

  return new Buffer(rawData).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
};