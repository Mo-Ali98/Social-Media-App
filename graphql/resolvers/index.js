/* A resolver is a function that's responsible for populating the data for a single field in your schema. 
Whenever a client queries for a particular field, the resolver for that field fetches the requested data from the appropriate data source. */
const postsResolvers = require('./posts');
const usersResolvers = require('./users');

module.exports = {
  Query: {
    ...postsResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation
  }
};