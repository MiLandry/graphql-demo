const {
  GraphQLID,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLScalarType,
} = require('graphql');

// Custom Date scalar
const DateType = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize: (value) => value instanceof Date ? value.toISOString() : value,
  parseValue: (value) => new Date(value),
  parseLiteral: (ast) => new Date(ast.value),
});

const data = {
  workers: [
    { id: '1', firstName: 'Alice', lastName: 'Jones', email: 'alice@example.com' },
    { id: '2', firstName: 'Bob', lastName: 'Smith', email: 'bob@example.com' },
  ],
  tasks: [
    { id: '1', title: 'Design', description: 'UI design work', hourlyRate: 120 },
    { id: '2', title: 'Development', description: 'Backend and API implementation', hourlyRate: 150 },
  ],
  timesheets: [
    { id: '1', workerId: '1', startingDate: new Date('2026-05-01'), endingDate: new Date('2026-05-05'), dateSubmitted: new Date('2026-05-06') },
    { id: '2', workerId: '1', startingDate: new Date('2026-05-08'), endingDate: new Date('2026-05-12'), dateSubmitted: new Date('2026-05-13') },
    { id: '3', workerId: '2', startingDate: new Date('2026-05-01'), endingDate: new Date('2026-05-05'), dateSubmitted: new Date('2026-05-06') },
  ],
  timesheetEntries: [
    { id: '1', timesheetId: '1', taskId: '1', hours: 4, note: 'Landing page mockups' },
    { id: '2', timesheetId: '1', taskId: '2', hours: 3, note: 'API integration review' },
    { id: '3', timesheetId: '2', taskId: '2', hours: 5, note: 'GraphQL schema and resolver design' },
    { id: '4', timesheetId: '2', taskId: '1', hours: 2, note: 'Design system updates' },
    { id: '5', timesheetId: '3', taskId: '2', hours: 6, note: 'API implementation for timesheets' },
    { id: '6', timesheetId: '3', taskId: '1', hours: 2, note: 'UI mockup refinements' },
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

const TaskType = new GraphQLObjectType({
  name: 'Task',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    hourlyRate: { type: GraphQLInt },
    entries: {
      type: new GraphQLList(TimesheetEntryType),
      resolve: (task) => data.timesheetEntries.filter((entry) => entry.taskId === task.id),
    },
  }),
});

const TimesheetEntryType = new GraphQLObjectType({
  name: 'TimesheetEntry',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    timesheet: {
      type: TimesheetType,
      resolve: (entry) => data.timesheets.find((ts) => ts.id === entry.timesheetId),
    },
    task: {
      type: TaskType,
      resolve: (entry) => data.tasks.find((task) => task.id === entry.taskId),
    },
    hours: { type: GraphQLInt },
    note: { type: GraphQLString },
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
    startingDate: { type: DateType },
    endingDate: { type: DateType },
    dateSubmitted: { type: DateType },
    entries: {
      type: new GraphQLList(TimesheetEntryType),
      resolve: (timesheet) => data.timesheetEntries.filter((entry) => entry.timesheetId === timesheet.id),
    },
  }),
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    workers: {
      type: new GraphQLList(WorkerType),
      resolve: () => data.workers,
    },
    worker: {
      type: WorkerType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_, { id }) => data.workers.find((worker) => worker.id === id),
    },
    tasks: {
      type: new GraphQLList(TaskType),
      resolve: () => data.tasks,
    },
    task: {
      type: TaskType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_, { id }) => data.tasks.find((task) => task.id === id),
    },
    timesheets: {
      type: new GraphQLList(TimesheetType),
      resolve: () => data.timesheets,
    },
    timesheetEntries: {
      type: new GraphQLList(TimesheetEntryType),
      resolve: () => data.timesheetEntries,
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

const TimesheetEntryInput = new GraphQLInputObjectType({
  name: 'TimesheetEntryInput',
  fields: {
    timesheetId: { type: new GraphQLNonNull(GraphQLID) },
    taskId: { type: new GraphQLNonNull(GraphQLID) },
    hours: { type: new GraphQLNonNull(GraphQLInt) },
    note: { type: GraphQLString },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createTimesheetEntry: {
      type: TimesheetEntryType,
      args: {
        input: { type: new GraphQLNonNull(TimesheetEntryInput) },
      },
      resolve: (_, { input }) => {
        const nextId = String(
          data.timesheetEntries.reduce((maxId, entry) => Math.max(maxId, Number(entry.id)), 0) + 1
        );
        const entry = { id: nextId, ...input };
        data.timesheetEntries.push(entry);
        return entry;
      },
    },
    deleteTimesheetEntry: {
      type: TimesheetEntryType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_, { id }) => {
        const index = data.timesheetEntries.findIndex((entry) => entry.id === id);
        if (index === -1) {
          return null;
        }
        return data.timesheetEntries.splice(index, 1)[0];
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});