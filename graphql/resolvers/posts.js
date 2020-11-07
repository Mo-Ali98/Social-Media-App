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
      console.log(user);
        //User is authenticated and create post based of Post model
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });
      //saves post
      const post = await newPost.save();

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
    }
  }
};
