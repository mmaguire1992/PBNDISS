const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const Customer = require('../models/customer'); 

// Function to sign JWT token
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Controller function for user signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body; // Destructuring name, email, and password from request body
    const newUser = await Customer.create({ // Creating a new customer document in the database
      name,
      email,
      password
    });

    const token = signToken(newUser._id); // Signing JWT token for the newly created user

    res.status(201).json({ // Sending response with status, token, and user data
      status: 'success',
      token,
      data: {
        user: newUser
      }
    });
  } catch (error) { // Handling errors
    res.status(400).json({ // Sending error response
      status: 'error',
      message: error.message
    });
  }
};

// Controller function for user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body; // Destructuring email and password from request body

    if (!email || !password) { // Checking if email or password is missing
      return res.status(400).json({ // Sending error response
        status: 'error',
        message: 'Please provide email and password!'
      });
    }

    const user = await Customer.findOne({ email }).select('+password'); // Finding user by email and selecting password

    if (!user || !(await user.correctPassword(password, user.password))) { // Checking if user exists and password is correct
      return res.status(401).json({ // Sending error response
        status: 'error',
        message: 'Incorrect email or password'
      });
    }

    const token = signToken(user._id); // Signing JWT token for the authenticated user

    res.status(200).json({ // Sending response with status and token
      status: 'success',
      token
    });
  } catch (error) { // Handling errors
    res.status(400).json({ // Sending error response
      status: 'error',
      message: error.message
    });
  }
};

// Controller function for user logout
exports.logout = (req, res) => {
  res.status(200).json({ status: 'success', token: null }); // Sending success response with null token
};

// Middleware function to protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) { // Checking if Authorisation header starts with 'Bearer'
      token = req.headers.authorization.split(' ')[1]; // Extracting token from Authorisation header
    }

    if (!token) { // Checking if token exists
      return res.status(401).json({ // Sending error response
        status: 'error',
        message: 'You are not logged in! Please log in to get access.'
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET); // Verifying JWT token

    const currentUser = await Customer.findById(decoded.id); // Finding user by decoded token ID

    if (!currentUser) { // Checking if user exists
      return res.status(401).json({ // Sending error response
        status: 'error',
        message: 'The user belonging to this token does no longer exist.'
      });
    }

    req.user = currentUser; // Assigning current user to request object
    next(); // Calling next middleware
  } catch (error) { // Handling errors
    res.status(401).json({ // Sending error response
      status: 'error',
      message: 'Invalid token. Please log in again.'
    });
  }
};
