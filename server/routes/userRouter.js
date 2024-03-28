const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); 

// Define route for user signup
router.post('/signup', authController.signup);

// Define route for user login
router.post('/login', authController.login);

// Define route for user logout
router.get('/logout', authController.logout);

module.exports = router;
