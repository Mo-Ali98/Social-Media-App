const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');


const {validateRegisterInput,validateLoginInput} = require('../../util/validators');
const { SECRET_KEY } = require('../../config'); 
const User = require('../../models/User');

function generateToken(user) {
    // generate token for new user or user lgging in useing secret key to encrypt
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
}

module.exports = {
  Mutation: {
    //handles logins
    async login(_, { username, password }) {
        //check if user login inputs is valid
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      //check if user exists checking against database
      const user = await User.findOne({ username });

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      //compare the encrypted passwords entered and stored
      const match = await bcrypt.compare(password, user.password); 
      if (!match) {
        errors.general = 'Wrong crendetials';
        throw new UserInputError('Wrong crendetials', { errors });
      }

      const token = generateToken(user); //generates a token for user logged in

      return {
        ...user._doc,
        id: user._id,
        token
      };
    },
    //handles registration
    async register(_,
      {
        registerInput: { username, email, password, confirmPassword }
      }
    ) {
        // Validate user data using validators to make sure input is not empty or invalid
        const { valid, errors } = validateRegisterInput(
            username,
            email,
            password,
            confirmPassword
        );
        if (!valid) {
            throw new UserInputError('Errors', { errors });
        }
      //Make sure user doesnt already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken'
          }
        });
      }
      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString() //Convert to a string
      });

      const res = await newUser.save(); //save user to database

      const token = generateToken(res); //creates a token for user response from DB

      return { //returns the input data
        ...res._doc,
        id: res._id,
        token
      };
    }
  }
};