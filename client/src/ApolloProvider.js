import React from 'react';
import App from './App';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';
import { setContext } from 'apollo-link-context';



//Points to the endpoint of the apollo server
const httpLink = createHttpLink({
  uri: 'http://localhost:5000'
});

//Sets the authorization token stored in the localstorage
const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache() //stores any cache data 
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);