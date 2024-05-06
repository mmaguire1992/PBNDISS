const express = require('express');
const multer = require('multer');
const imageController = require('../controllers/imageController');
const authController = require('../controllers/authController');

//  router for handling routes
const router = express.Router();

// storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

// Initialise multer with storage configuration
const upload = multer({ storage: storage });

// Full list of image routes
router.post('/generatePBN', authController.protect, upload.single('image'), imageController.generatePBN); // Route for generating PBN
router.patch('/updateImageName', authController.protect, imageController.updateImageName); // Route for updating image name
router.delete('/deleteImage', authController.protect, imageController.deleteImage); // Route for deleting image
router.get('/myImages', authController.protect, imageController.getUserImages); // Route for getting user images
router.post('/artFeed/upload', authController.protect, upload.single('image'), imageController.uploadArtFeedImage); // Upload image to ArtFeed
router.get('/artFeed', authController.protect, imageController.getArtFeedImages); // Get all ArtFeed images
router.post('/artFeed/:imageId/comment', authController.protect, imageController.addArtFeedComment); // Route for adding a comment to an ArtFeed image
router.patch('/artFeed/like/:imageId', authController.protect, imageController.likeArtFeedImage); // Add a like to an ArtFeed image

// Export router
module.exports = router;
