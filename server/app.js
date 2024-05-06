const express = require('express');
const path = require('path');
const cors = require('cors');

// Import routers for user and image routes
const userRouter = require('./routes/userRouter');
const imageRouter = require('./routes/imageRouter');

// Create express app instance
const app = express();

// Set view engine and views directory for EJS templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use built-in middleware for URL-encoded bodies (replacing bodyParser.urlencoded)
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static('public'));

// Use built-in middleware for JSON bodies 
app.use(express.json());

// CORS configuration for all routes
app.use(cors({
  origin: '*', // Consider specifying your frontend's origin in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true, // True to send credentials such as cookies
}));

// Define routes for image-related endpoints
app.use('/api', imageRouter);

// Define routes for user-related endpoints
app.use('/api/users', userRouter);

module.exports = app; 
