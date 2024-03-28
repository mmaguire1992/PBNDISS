const express = require('express');
const multer = require('multer');
const imageController = require('../controllers/imageController');
const authController = require('../controllers/authController');

// Define router for handling routes
const router = express.Router();

// Define storage configuration for multer
const storage = multer.diskStorage({
    // Set destination folder for uploaded files
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    // Set filename for uploaded files
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

// Initialise multer with storage configuration
const upload = multer({ storage: storage });

// Define route for generating PBN
router.post('/generatePBN', authController.protect, upload.single('image'), imageController.generatePBN);

// Define route for updating image name
router.patch('/updateImageName', authController.protect, imageController.updateImageName);

// Define route for deleting image
router.delete('/deleteImage', authController.protect, imageController.deleteImage);

// Define route for getting user's images
router.get('/myImages', authController.protect, imageController.getUserImages);

// Export router
module.exports = router;
