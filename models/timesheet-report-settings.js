module.exports = (sequelize, DataTypes) =>
  sequelize.define('TimesheetReportSettings', {
    key: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      field: 'key'
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'value'
    }
  });
