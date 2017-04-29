module.exports = (sequelize, DataTypes) =>
  sequelize.define('TimesheetReportOptions', {
    env: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      field: 'env'
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'enabled'
    },
    notifyContractors: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: 'notifyContractors'
    },
    sender: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'sender'
    },
    signature: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'signature'
    },
    reportMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'reportMessage'
    },
    notifyMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'notifyMessage'
    }
  });
