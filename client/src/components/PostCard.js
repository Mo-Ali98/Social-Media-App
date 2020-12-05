import React, { useContext } from 'react';
import { Button, Card, Icon, Label, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';


import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from '../components/DeleteButton';



//Get Post arguement and its properties of the Post via destructure (post :{})
function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes }
}) {

function likePost() {
    console.log('Like post!!', `${id}`);
}

const { user } = useContext(AuthContext);


  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        {/*Use post's props into crad components*/}
        <Card.Header as={Link} to={`/posts/${id}`} >{username}</Card.Header>

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
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <Button as="div" labelPosition="right" as={Link} to={`/posts/${id}`}>
          <Button color="blue" basic>
            <Icon name="comments" />
          </Button>
          <Label basic color="blue" pointing="left">
            {commentCount}
          </Label>
        </Button>

        {/** If user is logged in is equal to the owner of the post show delete icon */}
        {user && user.username === username && <DeleteButton postId={id} />}


      </Card.Content>
    </Card>
  );
}

export default PostCard;