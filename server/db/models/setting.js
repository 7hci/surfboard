const { reduce } = require('lodash');

module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define('Setting', {
    key: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      field: 'key'
    },
    value: {
      type: DataTypes.JSONB,
      allowNull: false,
      field: 'value'
    }
  });

  Setting.getAll = () => Setting.findAll()
    .then(settings => reduce(settings, (accumulator, { key, value }) =>
      Object.assign({ [key]: value }, accumulator), {}));

  return Setting;
};
