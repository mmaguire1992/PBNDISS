const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs'); 
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

// Define a schema for comments within art feed images
const commentSchema = new mongoose.Schema({
  commentText: {
    type: String,
    required: [true, 'Comment text is required.'], // Validation for required comment text
  },
  commentedBy: {
    type: String,
    required: false, // Make commenter identifier optional
  },
  commentedAt: {
    type: Date,
    default: Date.now, // Default timestamp for comment creation
  }
}, { _id: true });

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name.'], // Validation for required name
  },
  email: {
    type: String,
    required: [true, 'Please provide your email.'], // Validation for required email
    unique: true,
    match: [/.+@.+\..+/, 'Please provide a valid email address'], // Validation for valid email format
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'], // Validation for required password
    validate: {
      validator: function(value) {
        return passwordSchema.validate(value); // Custom validation for password using password schema
      },
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.' // Error message for password validation failure
    },
    select: false, 
  },
  images: [{
    name: { type: String, required: true }, // Validation for required image name
    pbnOutputUrl: { type: String, required: true }, // Validation for required PBN output URL
    colouredOutputUrl: { type: String, required: true }, // Validation for required coloured output URL
    colourKeyUrl: { type: String, required: true }, // Validation for required colour key URL
    createdAt: { type: Date, default: Date.now }, // Default timestamp for image creation
  }],
  artFeedImages: [{
    name: { type: String, required: true }, // Validation for required art feed image name
    imageUrl: { type: String, required: true }, // Validation for required image URL
    likes: { type: Number, default: 0 }, // Default value for likes
    postedAt: { type: Date, default: Date.now }, // Default timestamp for image posting
    comments: [commentSchema] // Embedded comments within each art feed image
  }],
}, { timestamps: true }); // Automatic timestamps for schema creation and updates

// Middleware to hash password before saving
customerSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) return next(); // Proceed to next middleware if password is not modified
    this.password = await bcrypt.hash(this.password, 12); // Hashing the password with bcrypt
    next(); // Proceed to next middleware
  } catch (error) {
    next(error); // Pass any error to the next middleware
  }
});

// Method to compare passwords
customerSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword); // Comparing  password with user password hash
};

customerSchema.index({ email: 1 }, { unique: true }); // Indexing email field for uniqueness

const Customer = mongoose.model('Customer', customerSchema); // Creating Customer model

module.exports = Customer; 
