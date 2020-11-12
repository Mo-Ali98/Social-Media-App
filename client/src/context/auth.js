import React, { useReducer, createContext } from 'react';
import jwtDecode from 'jwt-decode';

const initialState = {
  user: null
};

if (localStorage.getItem('jwtToken')) {
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));
  
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('jwtToken');
    } else {
      initialState.user = decodedToken;
    }
  }

//context will hold user data logged in/out
const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {}
});

//recieves an action and a payload
function authReducer(state, action) {
    //depending on the type of action it will do something
  switch (action.type) {
      //set user state to action
    case 'LOGIN':
      return {
        ...state,
        user: action.payload
      };
    case 'LOGOUT':
        //cler data if user logs out
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}


function AuthProvider(props) {
  // usereducer takes a reducer and state to return a dispatch with an initial state of user whic is null at the top 
  const [state, dispatch] = useReducer(authReducer, initialState);

    //login/out functions

  function login(userData) {
    localStorage.setItem('jwtToken', userData.token);
    dispatch({
      type: 'LOGIN',
      payload: userData
    });
  }

  function logout() {
    localStorage.removeItem('jwtToken');
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <AuthContext.Provider
    //returns value to components
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };