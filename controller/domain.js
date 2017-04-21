var request = require('request-promise').defaults({simple: false});
var config = require('config');
var googleAuth = require('./google-auth');

var domain = exports;

domain.createContractorEmail = (contractor, credentials) => {
  var googleAdminUrl = config.get('google.baseUrl') + '/admin/directory/v1/users';
  return googleAuth.getAccessToken(credentials)
    .then((token) => {
      return request.post({
        url: googleAdminUrl,
        qs: {access_token: token},
        json: true,
        body: {
          "primaryEmail": contractor.getEmail(),
          "name": {
            "givenName": contractor.firstName,
            "familyName": contractor.lastName
          },
          "password": contractor.getPassword(),
          "changePasswordAtNextLogin": true
        }
      });
    })
    .then((response) => {
      var userData = JSON.parse(JSON.stringify(response));
      if ('id' in userData) {
        return {'text': 'Added ' + contractor.getEmail() + ' to domain', 'status': 'success'};
      } else {
        return {'text': 'Problem creating e-mail for contractor', 'status': 'failure'};
      }
    })
    .catch((err) => {
      return {'text': 'Problem creating e-mail for contractor', 'status': 'failure'};
    });
};