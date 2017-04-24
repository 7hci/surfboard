var crypto = require('crypto');

module.exports =
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
    var pattern = /[^a-zA-Z]/g;
    var sanitizedFirst = this.firstName.replace(pattern, '').toLowerCase();
    var sanitizedLast = this.lastName.replace(pattern, '').toLowerCase();

    return sanitizedFirst + '.' + sanitizedLast + '@7hci.com';
  }

  getPassword() {
    return crypto.createHash('md5').update(this.getFullName()).digest('hex');
  }
};