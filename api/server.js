const fs = require('fs');
const express = require('express');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const { MongoClient } = require('mongodb');

require('dotenv').config();

const port = process.env.API_SERVER_PORT || 3000;
const url = process.env.DB_URL || 'mongodb://localhost/issuetracker';
let db;

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

function validateIssue(issue) {
  const errors = [];
  if (issue.title.length < 3) {
    errors.push('Field "title" must be at least 3 characters long.');
  }
  if (issue.status === 'Assigned' && !issue.owner) {
    errors.push('Field "owner" is required when status is "Assigned"');
  }
  if (errors.length > 0) {
    throw new UserInputError('Invalid input(s)', { errors });
  }
}

const GraphQLDate = new GraphQLScalarType({
  name: 'GraphQLDate',
  description: 'A Date() type in GraphQL as a scalar',
  parseValue(value) {
    const dateValue = new Date(value);
    const response = Number.isNaN(dateValue.getTime()) ? undefined : dateValue;
    return response;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      const value = new Date(ast.value);
      const response = Number.isNaN(value.getTime()) ? undefined : value;
      return response;
    }
    return undefined;
  },
  serialize(value) {
    return value.toISOString();
  },
});

async function issueAdd(_, { issue }) {
  console.log('issueAdd:\n', issue);
  validateIssue(issue);
  const newIssue = Object.assign({}, issue);
  newIssue.created = new Date();
  newIssue.id = await getNextSequence('issues');
  const result = await db.collection('issues').insertOne(newIssue);
  const savedIssue = await db.collection('issues')
    .findOne({ _id: result.insertedId });
  return savedIssue;
}

let aboutMessage = 'Issue Tracker API v1.0';

function setAboutMessage(_, { message }) {
  aboutMessage = message;
  return aboutMessage;
}

async function issueList() {
  const issues = await db.collection('issues').find({}).toArray();
  return issues;
}

const resolvers = {
  Query: {
    about: () => aboutMessage,
    issueList,
  },
  Mutation: {
    issueAdd,
    setAboutMessage,
  },
  GraphQLDate,
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./schema.graphql', 'utf-8'),
  resolvers,
  formatError: (error) => {
    console.log(JSON.stringify(error));
    return error;
  },
});

const app = express();

const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
console.log('CORS setting:', enableCors);

server.applyMiddleware({ app, path: '/graphql', cors: enableCors });

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

(async function start() {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`API server started on port ${port}`);
    });
  } catch (err) {
    console.log('Error:', err);
  }
}());
