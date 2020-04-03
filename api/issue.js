const { UserInputError } = require('apollo-server-express');
const { getDb, getNextSequence } = require('./db.js');

async function list() {
  const db = getDb();
  const issues = await db.collection('issues').find({}).toArray();
  return issues;
}

function validate(issue) {
  const errors = [];

}

async function add(_, { issue }) {
  const db = getDb();
  validate(issue);

  return savedIssue;
}

module.exports = { list, add };
