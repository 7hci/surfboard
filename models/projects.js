module.exports = (sequelize, DataTypes) =>
  sequelize.define('Project', {
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      field: 'project_name'
    }
  });
