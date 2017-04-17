var crypto = require('crypto');

module.exports =
  class Contractor {
    constructor(firstName, lastName, isResident, privateEmail, override) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.isResident = isResident;
      this.privateEmail = privateEmail;
      this.override = override.replace(" ", "");
    }

    getFullName() {
      return this.firstName + ' ' + this.lastName;
    }

    getEmail() {

      if (this.override) {
        return this.override + '@7hci.com';
      } else {
        var pattern = /[^a-zA-Z]/g;
        var sanitizedFirst = this.firstName.replace(pattern, '').toLowerCase();
        var sanitizedLast = this.lastName.replace(pattern, '').toLowerCase();

        return sanitizedFirst + '.' + sanitizedLast + '@7hci.com';
      }
    }

    getPassword() {
      return crypto.createHash('md5').update(this.getFullName()).digest('hex');
    }
  };