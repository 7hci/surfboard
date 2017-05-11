module.exports = (sequelize, DataTypes) =>
  sequelize.define('NewHire', {
    id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      field: 'id'
    },
    firstName: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'first_name'
    },
    lastName: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'last_name'
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'email'
    },
    override: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'override'
    },
    isResident: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'resident'
    },
    step: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'step'
    },
    contractId: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'contract_id'
    },
    folderId: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'folder_id'
    },
    credentials: {
      type: DataTypes.JSONB,
      allowNull: false,
      field: 'credentials'
    }
  });
