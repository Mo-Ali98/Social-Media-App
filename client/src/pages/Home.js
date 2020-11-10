import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Grid } from 'semantic-ui-react';

import PostCard from '../components/PostCard';

function Home() {
    //Load posts using Fetch Query
    const {loading, data: { getPosts: posts }
      } = useQuery(FETCH_POSTS_QUERY);    

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      {/* If data is loading via fetch just say loading posts*/}
      <Grid.Row>
        {loading ? (
          <h1>Loading posts..</h1>
        ) : (
            // If there is data (post has populated) then loop through via .map()
          posts &&
          posts.map((post) => (
            //for each post return the post id and a PostCard component passing the Post property
            <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
}

//Fetch Query to getting posts from apollo server
const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default Home;