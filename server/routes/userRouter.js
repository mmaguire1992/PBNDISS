const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); 

// Define route for user signup
router.post('/signup', authController.signup);

// Define route for user login
router.post('/login', authController.login);

// Define route for user logout
router.get('/logout', authController.logout);

// Define route for changing password
router.patch('/changePassword', authController.protect, authController.changePassword);

// Define route for deleting account
router.delete('/deleteAccount', authController.protect, authController.deleteAccount);

module.exports = router;
