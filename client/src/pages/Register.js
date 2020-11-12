import React, { useContext, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { useForm } from '../util/hooks';
import { AuthContext } from '../context/auth';


function Register(props) {
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    
    //Dcallback is returned from useForm providing it the defualt values and addUser Function
    const { onChange, onSubmit, values } = useForm(registerUser, {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    
    //function to carry out mutation register
    const [addUser, { loading }] = useMutation(REGISTER_USER, {
    //Updates if register mutation is accepted
    update(_,{ data: { register: userData }}
    ) {
        context.login(userData);
        //refirect to homepage if successful
        props.history.push('/');
      },
      // If there are errors return them in an array
      onError(err) {
          console.log(err.graphQLErrors[0].extensions.exception.errors);
        setErrors(err.graphQLErrors[0].extensions.exception.errors);
      },
      //Provide the variables values
      variables: values
    });
  
    function registerUser() {
      addUser();
    }
  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Register</h1>
        <Form.Input
          label="Username"
          placeholder="Username.."
          name="username"
          type="text"
          //Values.username from const
          //error is used to check if there is an error for red color 
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Email"
          placeholder="Email.."
          name="email"
          type="email"
          value={values.email}
          error={errors.email ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password.."
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {/** Loop through the array of errors and dsiplay them through .map()  If the error length is > 0 meaning there are errors */}
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

//Register mutation taking in form input
const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;