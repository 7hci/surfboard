module.exports = (sequelize, DataTypes) =>
  sequelize.define('ClicktimeCredentials', {
    env: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      field: 'env'
    },
    username: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'username'
    },
    key: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'key'
    },
    uid: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'uid'
    },
    reportid: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'reportid'
    }
  });
