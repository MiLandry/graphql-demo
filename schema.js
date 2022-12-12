const {
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLString,
  GraphQLEnumType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLSchema
} = require("graphql");

const employeeService = {
  getAllEmployees : () => {
    return [
      {firstName: "Alice", salary: 100000},
      {firstName: "Bob", salary: 75555},
    ]
  }
}

const Employee = new GraphQLObjectType({
  name: "Employee",
  fields: {
      firstName: {
          type: GraphQLString,
          description: "First name"
      },
      salary: {
        type: GraphQLInt,
        description: "The salary"
    },
  }
});

// TODO create enum of job titles and nest
// const BookmarkOrderByType = new GraphQLEnumType({
//   name: 'OrderBy',
//   values: {
//       MOST_LIKES: {value: "MOST_LIKES"},
//       LAST_CREATED: {value: "LAST_CREATED"},
//       MOST_USED: {value: "MOST_USED"}
//   }
// });


const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
      getAllEmployees: {
          type: new GraphQLList(Employee),
          resolve: async (root, args, context, info) => {
              return employeeService.getAllEmployees();
          }
      }
  },
});

module.exports = new GraphQLSchema({
  query: Query,
});