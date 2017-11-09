const { graphqlExpress } = require('graphql-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const fs = require('fs');
const path = require('path');
const resolvers = require('./resolvers');

const typeDefs = fs.readFileSync(path.join(__dirname, 'schema.gql'), 'utf8');
const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = graphqlExpress(req => ({
  schema,
  context: { credentials: req.session.tokens, key: req.get('X-Api-Key') }
}));
