
const { ApolloServer } = require('apollo-server');
const schema = require('./schema');

async function startServer() {
  const server = new ApolloServer({
    schema,
  });

  await server.listen();
  console.log('Running a GraphQL API server at localhost:4000/graphql');
}

startServer();