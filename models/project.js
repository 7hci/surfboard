module.exports = (sequelize, DataTypes) =>
  sequelize.define('Project', {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'name'
    }
  });
