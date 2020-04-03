require('dotenv').config();
const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const GraphQLDate = require('./graphql_date.js');
const { connectToDb } = require('./db.js');
const { installHandler } = require('./api_handler.js');
const { add: issueAdd } = require('./issue');

const port = process.env.API_SERVER_PORT || 3000;
let db;

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

installHandler(app);

const enableCors = (process.env.ENABLE_CORS || 'true') === 'true';
console.log('CORS setting:', enableCors);

server.applyMiddleware({ app, path: '/graphql', cors: enableCors });

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
