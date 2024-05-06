const { spawn } = require('child_process');
const { Storage } = require('@google-cloud/storage');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const Customer = require('../models/customer');
const config = require('../config');

// Access the keyFilename property from the configuration
const keyFilename = config.googleCloud.keyFilename;

// Create a new instance of Storage using the GCS key file
const storage = new Storage({
  keyFilename: keyFilename
});

// Function to download an image from a given URL
async function downloadImage(url, imagePath) {
  try {
    // Fetch image data from the provided URL
    const response = await fetch(url);
    if (!response.ok) {
      // If fetching fails, throw an error
      throw new Error(`Failed to fetch image from URL: ${url} - Server responded with status: ${response.status}`);
    }
    // Read the image data as a buffer
    const buffer = await response.buffer();

    // Create directory if it doesn't exist to store the image
    const dir = path.dirname(imagePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the image buffer to the specified path
    fs.writeFileSync(imagePath, buffer);
  } catch (error) {
    // If any error occurs during image download, throw an error
    throw new Error(`Error downloading image from URL: ${url} - ${error.message}`);
  }
}

const generatePBN = async (req, res) => {
  // Access the socket.io instance from the Express app
  const io = req.app.get('io');
  let imagePath = req.file ? req.file.path : null;
  const userId = req.user.id;
  const difficulty = req.body.difficulty;
  const imageName = req.body.name || 'Untitled';

  // Validate if difficulty level is provided
  if (!difficulty) {
    return res.status(400).json({ message: 'Difficulty level must be specified.' });
  }

  // Check if no local file provided and there's an image URL, download the image
  if (!req.file && req.body.imageUrl) {
    const imageUrl = req.body.imageUrl;
    imagePath = path.join(__dirname, '..', 'temp', `${Date.now()}_image.jpg`);
    try {
      await downloadImage(imageUrl, imagePath);
    } catch (error) {
      return res.status(500).json({ message: `Error downloading image: ${error.message}` });
    }
  }

  // Validate if imagePath is available
  if (!imagePath) {
    return res.status(400).json({ message: 'An image file or image URL is required.' });
  }

  // Check for image format if image is from a file upload
  if (req.file && !['image/jpeg', 'image/png'].includes(req.file.mimetype)) {
    return res.status(400).json({ message: 'Unsupported image format. Please upload JPEG or PNG.' });
  }

  // Define bucket and folder names for storing generated images
  const bucketName = 'qubpbn';
  const folderName = 'QUBGOOGLECLOUD';
  // Define the path to the Python script responsible for generating PBN
  const pythonScriptPath = '/Users/michaelmaguire/Library/Mobile Documents/com~apple~CloudDocs/new PbnDss/PBNDiss/server/utils/main.py';

  // Spawn a new Python process to execute the PBN generation script
  const pythonProcess = spawn('python3', [
    pythonScriptPath,
    imagePath,
    bucketName,
    folderName,
    difficulty,
  ]);

  let scriptOutput = '';
  // Handle standard output from the Python script
  pythonProcess.stdout.on('data', (data) => {
    scriptOutput += data.toString();
    // Extract progress information from script output and emit it via socket.io
    const progressMatch = data.toString().match(/PROGRESS: (.+?) (\d+)%/);
    if (progressMatch) {
      io.emit('progressUpdate', { userId: userId, progress: parseInt(progressMatch[2], 10), message: progressMatch[1] });
    }
  });

  // Handle standard error output from the Python script
  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data.toString()}`);
  });

  // Handle the completion of the Python script execution
  pythonProcess.on('close', async (code) => {
    // Remove the temporary image file if it was downloaded
    if (imagePath && imagePath.startsWith('/tmp')) {
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting temporary file:', err);
      });
    }

    // Handle different exit codes from the Python script
    if (code === 0) {
      try {
        // Parse the output data from the Python script
        const outputData = JSON.parse(scriptOutput.trim().split('\n').pop());
        // Prepare update data to add generated image URLs to the user's profile
        const updateData = {
          $push: { images: {
              name: imageName,
              pbnOutputUrl: outputData.pbnOutputUrl,
              colouredOutputUrl: outputData.colouredOutputUrl,
              colourKeyUrl: outputData.colourKeyUrl,
              colourCodes: outputData.colourCodes,
              createdAt: new Date()
            }}
        };

        // Update the user's profile with the generated image URLs
        await Customer.findByIdAndUpdate(userId, updateData, { new: true });

        // Respond with success message and generated image data
        res.json({
          message: 'PBN generation successful. Image URLs added to your profile.',
          ...outputData
        });
      } catch (error) {
        console.error('Error processing output from Python script:', error);
        res.status(500).json({ message: `Error processing output from Python script: ${error.message}` });
      }
    } else {
      console.error('PBN generation script exited with error code:', code);
      res.status(500).json({ message: 'PBN generation script exited with an error.' });
    }
  });
};
// Function to retrieve a user's images
const getUserImages = async (req, res) => {
  // Extract user ID from the request
  const userId = req.user.id;
  
  try {
    // Attempt to find the user in the database
    const user = await Customer.findById(userId);
    // If user not found, send appropriate response
    if (!user) {
      return res.status(404).json({ message: 'User not found in the database.' });
    }
    // Send user's images as JSON response
    res.json(user.images);
  } catch (error) {
    // If an error occurs during image retrieval, log it and send an error response
    console.error('Error fetching user images from database:', error);
    res.status(500).json({ message: `Failed to retrieve images due to server error: ${error.message}` });
  }
};

// Function to update an image's name
const updateImageName = async (req, res) => {
  // Extract image ID and new name from the request body
  const { imageId, newName } = req.body;
  // Extract user ID from the request
  const userId = req.user._id;

  try {
    // Attempt to find the user and update the image name
    const user = await Customer.findOneAndUpdate(
      { "_id": userId, "images._id": imageId },
      { "$set": { "images.$.name": newName } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'Image not found in user profile for ID: ' + imageId });
    }
    // Send success response with updated user data
    res.json({ status: 'success', data: { user } });
  } catch (error) {
    // If an error occurs during the update, send an error response
    res.status(400).json({ status: 'error', message: `Failed to update image name due to: ${error.message}` });
  }
};

// Function to delete an image
const deleteImage = async (req, res) => {
  // Extract image ID from the request body
  const { imageId } = req.body;
  // Extract user ID from the request
  const userId = req.user._id;

  try {
    // Attempt to find the user and delete the image
    const user = await Customer.findByIdAndUpdate(
      userId,
      { "$pull": { "images": { "_id": imageId } } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'Failed to find image with ID: ' + imageId + ' for deletion.' });
    }
    // Send success response with updated user data
    res.json({ status: 'success', data: { user } });
  } catch (error) {
    // If an error occurs during deletion, send an error response
    res.status(400).json({ status: 'error', message: `Error deleting image: ${error.message}` });
  }
};

// Function to upload an image to ArtFeed
const uploadArtFeedImage = async (req, res) => {
  // Check if no image was uploaded
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded. Please provide an image.' });
  }
  // Extract image name and user ID from the request
  const { name } = req.body;
  const userId = req.user.id;

  // Define bucket name for storing images
  const bucketName = 'qubpbn';
  const bucket = storage.bucket(bucketName);

  // Generate unique filename for the uploaded image
  const fileName = `${Date.now()}-${req.file.originalname}`;
  const file = bucket.file(fileName);

  // Stream the uploaded image to Google Cloud Storage
  fs.createReadStream(req.file.path)
    .pipe(file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype
      }
    }))
    .on('error', (err) => {
      // If an error occurs during upload, send an error response
      console.error('Error during image upload to Google Cloud:', err);
      res.status(500).json({ message: `Failed to upload image to Google Cloud Storage: ${err.message}` });
    })
    .on('finish', async () => {
      // On successful upload, generate public URL for the image
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

      try {
        // Update user's profile with the uploaded image details
        const user = await Customer.findByIdAndUpdate(userId, {
          $push: { artFeedImages: { name, imageUrl: publicUrl, likes: 0, postedAt: new Date() } }
        }, { new: true });

        // Send success response with uploaded image details
        res.status(201).json({
          status: 'success',
          data: {
            message: 'Image uploaded to ArtFeed and database updated successfully.',
            artFeedImage: user.artFeedImages.slice(-1)[0]
          }
        });
      } catch (error) {
        // If an error occurs during database update, send an error response
        console.error('Error updating user profile with new image:', error);
        res.status(500).json({ message: `Error updating database with new image details: ${error.message}` });
      }

      // Delete the temporary file after successful upload
      fs.unlink(req.file.path, err => {
        if (err) console.error('Error deleting temporary file after upload:', err);
      });
    });
};

// Function to fetch all ArtFeed images
const getArtFeedImages = async (req, res) => {
  try {
    // Retrieve all users from the database
    const users = await Customer.find({});
    // Flatten the array of artFeedImages from each user into a single array
    const artFeedImages = users.reduce((acc, user) => acc.concat(user.artFeedImages), []);
    // Send the array of artFeedImages as JSON response
    res.json(artFeedImages);
  } catch (error) {
    // If an error occurs during fetching, send an error response
    console.error('Error fetching ArtFeed images:', error);
    res.status(500).json({ message: `Failed to retrieve ArtFeed images: ${error.message}` });
  }
};

// Function to like an ArtFeed image
const likeArtFeedImage = async (req, res) => {
  // Extract image ID from the request parameters
  const { imageId } = req.params;

  try {
    // Increment the like count of the specified image
    const updateResult = await Customer.findOneAndUpdate(
      {"artFeedImages._id": imageId},
      {$inc: {"artFeedImages.$.likes": 1}},
      {new: true}
    );
    if (!updateResult) {
      return res.status(404).json({ message: 'ArtFeed image not found to like.' });
    }
    // Send success response
    res.status(200).json({
      status: 'success',
      message: 'Image liked successfully.',
      updatedLikes: updateResult.artFeedImages.find(img => img._id.toString() === imageId).likes
    });
  } catch (error) {
    // If an error occurs during liking, send an error response
    console.error('Error liking the ArtFeed image:', error);
    res.status(500).json({ message: `Failed to like the ArtFeed image: ${error.message}` });
  }
};

// Function to add a comment to an ArtFeed image
const addArtFeedComment = async (req, res) => {
  // Extract image ID and comment text from the request parameters and body
  const { imageId } = req.params;
  const { comment } = req.body;

  try {
    // Find the customer and update the art feed image with the new comment
    const result = await Customer.findOneAndUpdate(
      {"artFeedImages._id": imageId},
      {$push: {"artFeedImages.$.comments": {commentText: comment, commentedAt: new Date()}}},
      {new: true}
    );
    if (!result) {
      return res.status(404).json({ message: 'Art feed image not found for commenting.' });
    }
    // Send success response with updated image details
    res.status(200).json({ message: 'Comment added successfully.', result });
  } catch (error) {
    // If an error occurs during adding comment, send an error response
    console.error('Failed to add comment to the art feed image:', error);
    res.status(500).json({ message: `Failed to add comment to the ArtFeed image: ${error.message}` });
  }
};

module.exports = {
  generatePBN,
  getUserImages,
  updateImageName,
  deleteImage,
  uploadArtFeedImage,
  getArtFeedImages,
  likeArtFeedImage,
  addArtFeedComment,
};
