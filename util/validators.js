//validate user input preventing user from entering mepty fields
module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
  ) => {
    const errors = {};
    if (username.trim() === '') {
      errors.username = 'Username must not be empty';
    }
    if (email.trim() === '') {
      errors.email = 'Email must not be empty';
    } else {
      //checks if email is valid using a regex
      const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/; 
      if (!email.match(regEx)) {
        errors.email = 'Email must be a valid email address';
      }
    }
    if (password === '') {
      errors.password = 'Password must not empty';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords must match';
    }
  
    return {
      errors,
      valid: Object.keys(errors).length < 1 //if length of errers is 0 (smaller than 1 ) data is valid
    };
  };
  
  //Validate user login input similar to validateRegisterInput
  module.exports.validateLoginInput = (username, password) => {
    const errors = {};
    if (username.trim() === '') {
      errors.username = 'Username must not be empty';
    }
    if (password.trim() === '') {
      errors.password = 'Password must not be empty';
    }
  
    return {
      errors,
      valid: Object.keys(errors).length < 1
    };
  };