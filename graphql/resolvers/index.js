/* A resolver is a function that's responsible for populating the data for a single field in your schema. 
Whenever a client queries for a particular field, the resolver for that field fetches the requested data from the appropriate data source. */

/* Resolver is a collection of functions that generate response for a GraphQL query.
    In simple terms, a resolver acts as a GraphQL query handler. 
    Every resolver function in a GraphQL schema accepts four positional arguments as given below */

/*GraphQL mutations create and modify objects, similar to a PUT, POST, or DELETE request in REST. Mutation requests are sent to the same endpoint as query requests.*/
const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');


module.exports = {
    //retrieves likes and comment counts
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length
    },
  Query: {
    ...postsResolvers.Query
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation
  },
  Subscription: {
    ...postsResolvers.Subscription
  }
};