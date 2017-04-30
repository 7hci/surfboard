module.exports = (sequelize, DataTypes) =>
  sequelize.define('TimesheetReportJob', {
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'description'
    },
    recipients: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
      field: 'recipients'
    },
    cc: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
      field: 'cc'
    }
  });
