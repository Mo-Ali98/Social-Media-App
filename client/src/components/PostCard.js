import React from 'react';
import { Button, Card, Icon, Label, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

//Get Post arguement and its properties of the Post via destructure (post :{})
function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes }
}) {

function likePost() {
    console.log('Like post!!', `${id}`);
}

function commentOnPost() {
    console.log('Comment on post!!', `${id}`);
}

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        {/*Use post's props into crad components*/}
        <Card.Header>{username}</Card.Header>

        {/* Use post id to provide each post a unique link */}
        <Card.Meta as={Link} to={`/posts/${id}`}> 

        {/* Use moment to get timestamp of when the post was posted */}
          {moment(createdAt).fromNow(true)}
        </Card.Meta>

        {/* Use post body */}
        <Card.Description>{body}</Card.Description>

        {/* Like and Comment buttons  */}
      </Card.Content>
      <Card.Content extra>
        <Button as="div" labelPosition="right" onClick={likePost}>
          <Button color="teal" basic>
            <Icon name="heart" />
          </Button>
          <Label basic color="teal" pointing="left">
            {likeCount}
          </Label>
        </Button>
        <Button as="div" labelPosition="right" onClick={commentOnPost}>
          <Button color="blue" basic>
            <Icon name="comments" />
          </Button>
          <Label basic color="blue" pointing="left">
            {commentCount}
          </Label>
        </Button>
      </Card.Content>
    </Card>
  );
}

export default PostCard;