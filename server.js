
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema');

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    schema,
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log('Running a GraphQL API server at localhost:4000/graphql');
  });
}

startServer();