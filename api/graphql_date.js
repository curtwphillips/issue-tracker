const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

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

module.exports = GraphQLDate;
