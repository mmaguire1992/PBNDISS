const express = require('express');
const multer = require('multer');
const imageController = require('../controllers/imageController');
const authController = require('../controllers/authController');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

router.post('/generatePBN', authController.protect, upload.single('image'), imageController.generatePBN);

router.get('/myImages', authController.protect, imageController.getUserImages);

module.exports = router;
