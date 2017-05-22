/**
 * @fileOverview Class representing all relevant information about the contractor being onboarded
 */
const crypto = require('crypto');

module.exports =
  class Contractor {
    constructor(newHire) {
      this.firstName = newHire.firstName;
      this.lastName = newHire.lastName;
      this.isResident = newHire.isResident;
      this.privateEmail = newHire.email;
      this.override = newHire.override;
      this.contractId = newHire.contractId;
      this.folderId = newHire.folderId;
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
