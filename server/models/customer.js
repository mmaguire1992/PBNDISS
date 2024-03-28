const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema({
  // Define customer schema
  name: {
    type: String,
    required: [true, 'Please provide your name.'], // Name field required
  },
  email: {
    type: String,
    required: [true, 'Please provide your email.'], // Email field required
    unique: true, // Email field should be unique
    match: [/.+\@.+\..+/, 'Please fill a valid email address'], // Email format validation
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'], // Password field required
    minlength: 6, // Minimum length for password
    select: false, // Do not include password in query results
  },
  images: [{
    // Define array of images
    name: { type: String, required: true }, 
    pbnOutputUrl: { type: String, required: true }, // URL for PBN output image
    colouredOutputUrl: { type: String, required: true }, // URL for coloured output image
    colourKeyUrl: { type: String, required: true }, // URL for colour key image
    createdAt: {
      type: Date,
      default: Date.now, // Default creation date for images
    },
  }],
}, { timestamps: true }); // Enable timestamps for schema

customerSchema.pre('save', async function(next) {
  // Middleware to hash password before saving
  if (!this.isModified('password')) return next(); // Proceed if password is modified
  this.password = await bcrypt.hash(this.password, 12); // Hash password with bcrypt
  next(); // Move to the next middleware
});

customerSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  // Method to compare candidate password with user password
  return await bcrypt.compare(candidatePassword, userPassword); // Compare passwords using bcrypt
};

customerSchema.index({ email: 1 }, { unique: true }); // Create unique index on email field

const Customer = mongoose.model('Customer', customerSchema); // Create Customer model

module.exports = Customer;
