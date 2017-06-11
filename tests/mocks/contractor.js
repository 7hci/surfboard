module.exports =
  class Contractor {
    constructor() {
      this.firstName = 'Jon';
      this.lastName = 'Snow';
      this.isResident = true;
      this.privateEmail = 'danielrearden@gmail.com';
      this.override = '';
      this.contractId = 'testid_contract';
      this.folderId = 'testid_folder';
    }

    getFullName() {
      return `${this.firstName} ${this.lastName}`;
    }

    getEmail() {
      if (this.override) {
        return `${this.override.replace(' ', '')}@7hci.com`;
      }
      const pattern = /[^a-zA-Z]/g;
      const sanitizedFirst = this.firstName.replace(pattern, '').toLowerCase();
      const sanitizedLast = this.lastName.replace(pattern, '').toLowerCase();

      return `${sanitizedFirst}.${sanitizedLast}@7hci.com`;
    }

    getPassword() {
      return this.getFullName();
    }
  };
