/**
 * @fileOverview Class representing all relevant information about the contractor being onboarded
 */
const crypto = require('crypto');

module.exports =
  class Contractor {
    constructor(firstName, lastName, isResident, privateEmail, override) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.isResident = isResident;
      this.privateEmail = privateEmail;
      this.override = override;
    }

    getFullName() {
      return `${this.firstName} ${this.lastName}`;
    }

    /**
     * If a local-part override was provided, uses that otherwise generates a sanitized local-part
     * @returns {string} The complete generated e-mail address
     */
    getEmail() {
      if (this.override) {
        return `${this.override.replace(' ', '')}@7hci.com`;
      }
      const pattern = /[^a-zA-Z]/g;
      const sanitizedFirst = this.firstName.replace(pattern, '').toLowerCase();
      const sanitizedLast = this.lastName.replace(pattern, '').toLowerCase();

      return `${sanitizedFirst}.${sanitizedLast}@7hci.com`;
    }

    /**
     * @returns {string} A password for the contractor's new e-mail account
     */
    getPassword() {
      return crypto.createHash('md5').update(this.getFullName()).digest('hex');
    }
  };
