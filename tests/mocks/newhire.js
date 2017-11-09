const sequelize = require('./sequelize');
const model = require('../../server/db/models/newhire');

const DataTypes = { TEXT: null, INTEGER: null, BOOLEAN: null, JSONB: null };
module.exports = model(sequelize, DataTypes);
