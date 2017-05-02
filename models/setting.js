module.exports = (sequelize, DataTypes) =>
  sequelize.define('Setting', {
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
