module.exports = (sequelize, DataTypes) =>
  sequelize.define('TimesheetReport', {
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      field: 'description'
    },
    recipients: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      field: 'recipients'
    },
    cc: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true,
      field: 'cc'
    }
  });
