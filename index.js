'use strict';

const { graphql, buildSchema } = require('graphql');

const schema = buildSchema(`
type Query {
  Person: String
}

type Person {
  name: String
}
`);

const query = `
query myFirstQuery {
  foo
}
`;

const resolvers = {
  foo: () => 'bar',
};

graphql(schema, query, resolvers)
  .then((result) => console.log(result))
  .catch((error) => console.log(error));