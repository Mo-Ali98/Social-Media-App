import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';

function PostForm() {

  // Data from form with initial state of body as an empty string
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: ''
  });

  //Create the post using the CreatePost mutation
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    //Accesses the cache and auto update to fetch new posts
    update(proxy, result) {
    const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
        });
        data.getPosts = [result.data.createPost, ...data.getPosts];
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
    values.body = '';
    }
  });

  function createPostCallback() {
    createPost();
  }

  return (
    //Form with one filed
    <Form onSubmit={onSubmit}>
      <h2>Create a post:</h2>
      <Form.Field>
        <Form.Input
          placeholder="Hi World!"
          name="body"
          onChange={onChange}
          value={values.body}
        />
        <Button type="submit" color="teal">
          Submit
        </Button>
      </Form.Field>
    </Form>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;