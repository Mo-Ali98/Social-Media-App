import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button, Label, Icon } from 'semantic-ui-react';

import MyPopup from '../util/MyPopup';


//Take the props of the Post
function LikeButton({ user, post: { id, likeCount, likes } }) {
    //Holds the state of wether post is liked
    const [liked, setLiked] = useState(false);
  
    useEffect(() => {
        //Check if the user is logged in and has liked the post 
      if (user && likes.find((like) => like.username === user.username)) {
        setLiked(true);
      } else setLiked(false);
    }, [user, likes]);
  
    const [likePost] = useMutation(LIKE_POST_MUTATION, {
      variables: { postId: id }
    });
  
    //if user is logged in and has liked or not change from fill to outline and vice versa
    const likeButton = user ? (
      liked ? (
        <Button color="teal">
          <Icon name="heart" />
        </Button>
      ) : (
        <Button color="teal" basic>
          <Icon name="heart" />
        </Button>
      )
      //If user is not logged in redirect to login page
    ) : (
      <Button as={Link} to="/login" color="teal" basic>
        <Icon name="heart" />
      </Button>
    );
  
    return (
      <Button as="div" labelPosition="right" onClick={likePost}>
          {/** Dynamic button */}
          <MyPopup content={liked ? 'Unlike' : 'Like'}>{likeButton}</MyPopup>
        <Label basic color="teal" pointing="left">
          {likeCount}
        </Label>
      </Button>
    );
  }
  


  //LikePost mutation
const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;