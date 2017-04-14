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
    let pattern = /[^a-zA-Z]/g;
    let sanitizedFirst = this.firstName.replace(pattern, '').toLowerCase();
    let sanitizedLast = this.lastName.replace(pattern, '').toLowerCase();

    return sanitizedFirst + '.' + sanitizedLast + '@7hci.com';
  }
};