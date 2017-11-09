const GraphqlJSON = require('graphql-type-json');
const mutations = require('./mutations');
const queries = require('./queries');
const types = require('./types');

module.exports = Object.assign({ Query: queries, Mutation: mutations, JSON: GraphqlJSON }, types);
