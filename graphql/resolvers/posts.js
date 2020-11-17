const { AuthenticationError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getPosts() {
      try {
        //get posts in descending order
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    //gets post via postid
    async getPost(_, { postId }) { 
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    //User logs in get auth token and place it in auth header when requesting a post get that token and make sure its valid in the DB
    //Prevents anyone from creating a post only users registered
    async createPost(_, { body }, context) {
      const user = checkAuth(context);

      if (body.trim() === '') {
        throw new Error('Post body must not be empty');
      }

        //User is authenticated and create post based of Post model
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });
      //saves post
      const post = await newPost.save();
      context.pubsub.publish('NEW_POST', {
        newPost: post
      });

      return post;
    },
    async deletePost(_, { postId }, context) {
      //get user authentication and is the user that created the post being deleted
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        //check if post is by owner and then deleted
        if (user.username === post.username) {
          await post.delete();
          return 'Post deleted successfully';

        } else {
          throw new AuthenticationError('Action not allowed not owner of post');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    //To like post get postid and current logged in user (context)
    async likePost(_, { postId }, context) {
        //Check suth of user
        const { username } = checkAuth(context);
        //get post user wants to like
        const post = await Post.findById(postId);

        //if post exists then like the post
        if (post) {
          //check if user previously liked  
          if (post.likes.find((like) => like.username === username)) {
            // Post already likes, unlike it (filters likes of users only getting the user we want)
            post.likes = post.likes.filter((like) => like.username !== username);
          } else {
            // Not liked, like post
            post.likes.push({
              username,
              createdAt: new Date().toISOString()
            });
          }
          //carry save
          await post.save();
          return post;
        } else throw new UserInputError('Post not found');
      }
    },
    //keeps a log of new posts etc
    Subscription: {
        newPost: {
          subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
        }
      }
};
