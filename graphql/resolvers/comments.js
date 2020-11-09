const { AuthenticationError, UserInputError } = require('apollo-server');

const checkAuth = require('../../util/check-auth');
const Post = require('../../models/Post');

module.exports = {
  Mutation: {
    //context checks if user is loggedin and postid and body of the post the user wants to comment on if theirs.
    createComment: async (_, { postId, body }, context) => {
      //Check if user is logged in
      const { username } = checkAuth(context);
      //Check if user tried to submit an emoty comment on post
      if (body.trim() === '') {
        //Error msg
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'Comment body must not empty'
          }
        });
      }
      //If comment is not empty
      const post = await Post.findById(postId);

      if (post) { // Checks if post exists
          //Add comment on the top 
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString()
        });
        //save comment on post
        await post.save();
        return post;

      } else throw new UserInputError('Post not found');
    },

    //needs post and comment id and context for auth
    async deleteComment(_, { postId, commentId }, context) {
        //check user logged in
      const { username } = checkAuth(context);
        //find post user wants to delete
      const post = await Post.findById(postId);

      if (post) { //if post exists
        //we find the index of that comment from the array of comments using commentid we pass in deletecomment()
        const commentIndex = post.comments.findIndex((c) => c.id === commentId);
        //if owner of the comment then carry out deletion
        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
          //if not original owner of comment
        } else {
          throw new AuthenticationError('Action not allowed');
        }
        //if post is not found
      } else {
        throw new UserInputError('Post not found');
      }
    }

  }
};