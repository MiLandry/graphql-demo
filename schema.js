const {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
} = require('graphql');

const data = {
  workers: [
    { id: '1', firstName: 'Alice', lastName: 'Jones', email: 'alice@example.com' },
    { id: '2', firstName: 'Bob', lastName: 'Smith', email: 'bob@example.com' },
  ],
  jobItems: [
    { id: '1', title: 'Design', description: 'UI design work', hourlyRate: 120 },
    { id: '2', title: 'Development', description: 'Backend and API implementation', hourlyRate: 150 },
  ],
  timesheets: [
    { id: '1', workerId: '1', jobItemId: '1', date: '2026-05-01', hours: 4, note: 'Landing page mockups' },
    { id: '2', workerId: '1', jobItemId: '2', date: '2026-05-02', hours: 5, note: 'GraphQL schema and resolver design' },
    { id: '3', workerId: '2', jobItemId: '2', date: '2026-05-01', hours: 6, note: 'API implementation for timesheets' },
  ],
};

const WorkerType = new GraphQLObjectType({
  name: 'Worker',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    timesheets: {
      type: new GraphQLList(TimesheetType),
      resolve: (worker) => data.timesheets.filter((ts) => ts.workerId === worker.id),
    },
  }),
});

const JobItemType = new GraphQLObjectType({
  name: 'JobItem',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    hourlyRate: { type: GraphQLInt },
    timesheets: {
      type: new GraphQLList(TimesheetType),
      resolve: (jobItem) => data.timesheets.filter((ts) => ts.jobItemId === jobItem.id),
    },
  }),
});

const TimesheetType = new GraphQLObjectType({
  name: 'Timesheet',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    worker: {
      type: WorkerType,
      resolve: (timesheet) => data.workers.find((worker) => worker.id === timesheet.workerId),
    },
    jobItem: {
      type: JobItemType,
      resolve: (timesheet) => data.jobItems.find((jobItem) => jobItem.id === timesheet.jobItemId),
    },
    date: { type: GraphQLString },
    hours: { type: GraphQLInt },
    note: { type: GraphQLString },
  }),
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    workers: {
      type: new GraphQLList(WorkerType),
      resolve: () => data.workers,
    },
    jobItems: {
      type: new GraphQLList(JobItemType),
      resolve: () => data.jobItems,
    },
    timesheets: {
      type: new GraphQLList(TimesheetType),
      resolve: () => data.timesheets,
    },
    timesheetsByWorker: {
      type: new GraphQLList(TimesheetType),
      args: {
        workerId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_, { workerId }) => data.timesheets.filter((ts) => ts.workerId === workerId),
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
});