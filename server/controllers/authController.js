const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs'); 
const Customer = require('../models/customer');
const passwordValidator = require('password-validator'); 

// Create a password schema for validating passwords
const passwordSchema = new passwordValidator();

// Add password requirements to the schema
passwordSchema
  .is().min(8)                                    // Minimum length 8
  .is().max(100)                                  // Maximum length 100
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits()                                 // Must have digits
  .has().symbols();                               // Must have special characters

// Function to sign JWT token
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN // Setting expiration time for the token
  });
};

// Controller function for user signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Validate password against the password schema
    if (!passwordSchema.validate(password)) {
      return res.status(400).json({
        status: 'error',
        message: 'Password does not meet security requirements: 8-100 characters, including uppercase, lowercase, digits, and symbols.'
      });
    }
    // Continue with user creation
    const newUser = await Customer.create({
      name,
      email,
      password
    });
    // Generate JWT token for the newly created user
    const token = signToken(newUser._id);
    // Send success response with token and user data
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser
      }
    });
  } catch (error) {
    // If an error occurs during signup process, send error response
    res.status(400).json({
      status: 'error',
      message: 'Registration failed email already registered' 
    });
  }
};

// Controller function for user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Both email and password must be provided.'
      });
    }

    const user = await Customer.findOne({ email }).select('+password');

    // Check if user exists and if password is correct
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'No user found with this email. Please register.'
      });
    } else if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect password. Access denied.'
      });
    }

    // Generate JWT token for the logged-in user
    const token = signToken(user._id);

    // Send success response with token
    res.status(200).json({
      status: 'success',
      token
    });
  } catch (error) {
    // If an error occurs during login process, send error response
    res.status(400).json({
      status: 'error',
      message: 'Login process failed: ' + error.message
    });
  }
};

// Controller function for user logout
exports.logout = (req, res) => {
  // Send success response for user logout
  res.status(200).json({ status: 'success', message: 'Logout successful.' });
};

// Middleware function to protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Extract JWT token from request headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in. Please log in to get access.'
      });
    }

    // Verify the authenticity of the JWT token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the token
    const currentUser = await Customer.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // Set the current user in the request object
    req.user = currentUser;
    next();
  } catch (error) {
    // If an error occurs during token verification, send error response
    res.status(401).json({
      status: 'error',
      message: 'Token validation failed. Please log in again.'
    });
  }
};

// Controller function for changing user password
exports.changePassword = async (req, res) => {
  try {
    const user = await Customer.findById(req.user.id).select('+password');
    const { currentPassword, newPassword } = req.body;
    // Validate the new password against the password schema
    if (!passwordSchema.validate(newPassword)) {
      return res.status(400).json({
        status: 'error',
        message: 'New password does not meet security requirements.'
      });
    }
    // Continue with password change
    if (!(await user.correctPassword(currentPassword, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Your current password is incorrect.'
      });
    }
    user.password = newPassword;
    await user.save();
    // Send success response for password change
    res.status(200).json({
      status: 'success',
      message: 'Your password has been updated successfully.'
    });
  } catch (error) {
    // If an error occurs during password change process, send error response
    res.status(500).json({
      status: 'error',
      message: 'Password update failed: ' + error.message
    });
  }
};

// Controller function for deleting user account
exports.deleteAccount = async (req, res) => {
  try {
    // Find and delete the user account
    await Customer.findByIdAndDelete(req.user.id);
    // Send success response for account deletion
    res.status(204).json({
      status: 'success',
      message: 'Your account has been deleted successfully.'
    });
  } catch (error) {
    // If an error occurs during account deletion process, send error response
    res.status(500).json({
      status: 'error',
      message: 'Account deletion failed: ' + error.message
    });
  }
};
