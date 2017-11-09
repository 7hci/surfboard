const domain = require('../../lib/domain');

module.exports = {
  Settings: {
    personnel: () => domain.getPersonnelInfo()
  }
};
