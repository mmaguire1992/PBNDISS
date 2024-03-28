const { spawn } = require('child_process'); 
const { Storage } = require('@google-cloud/storage');
const fetch = require('node-fetch'); 
const fs = require('fs'); 
const path = require('path'); 
const Customer = require('../models/customer'); 

// Creating a new instance of Storage
const storage = new Storage({ keyFilename: '/Users/michaelmaguire/Downloads/maximal-kingdom-414314-57f47cd90afb.json' }); 

// Function to download image 
async function downloadImage(url, imagePath) { 
    const response = await fetch(url); 
    if (!response.ok) throw new Error('Failed to fetch image');
    const buffer = await response.buffer(); 

    // Getting directory name from image path
    const dir = path.dirname(imagePath); 
    if (!fs.existsSync(dir)) { 
        fs.mkdirSync(dir, { recursive: true }); 
    }

    fs.writeFileSync(imagePath, buffer); 
}
// Function to generate PBN
const generatePBN = async (req, res) => { 
    const io = req.app.get('io'); // Accessing io from the Express
    let imagePath = req.file ? req.file.path : null; 
    const userId = req.user.id; 
    const difficulty = req.body.difficulty; //
    const imageName = req.body.name || 'Untitled'; // Getting image name from request or setting it to 'Untitled'

    if (!difficulty) { // Checking if difficulty level is provided
        return res.status(400).send({ message: 'Difficulty level is required.' }); 
    }

    if (!req.file && req.body.imageUrl) { // Checking if image file or URL is provided
        const imageUrl = req.body.imageUrl; // Getting image URL from request
        imagePath = path.join(__dirname, '..', 'temp', `${Date.now()}_image.jpg`); // Creating image path
        try {
            await downloadImage(imageUrl, imagePath); // Downloading image
        } catch (error) {
            console.error('Error downloading image:', error); 
            return res.status(500).send({ message: 'Error downloading image.' }); 
        }
    }

    if (!imagePath) { 
        return res.status(400).send({ message: 'An image file or image URL is required.' });
    }

    const bucketName = 'qubpbn'; 
    const folderName = 'QUBGOOGLECLOUD'; 
    const pythonScriptPath = '/Users/michaelmaguire/Library/Mobile Documents/com~apple~CloudDocs/new PbnDss/PBNDiss/server/utils/main.py'; 

    const pythonProcess = spawn('python3', [ // Spawning Python process
        pythonScriptPath,
        imagePath,
        bucketName,
        folderName,
        difficulty,
    ]);

    // Variable to store script output
    let scriptOutput = ''; 
    pythonProcess.stdout.on('data', (data) => { 
        scriptOutput += data.toString(); // Appending data to script output
        const progressMatch = data.toString().match(/PROGRESS: (.+?) (\d+)%/); // Matching progress data
        if (progressMatch) { 
            io.emit('progressUpdate', { userId: userId, progress: parseInt(progressMatch[2], 10), message: progressMatch[1] }); // Emitting progress update
        }
    });

    pythonProcess.stderr.on('data', (data) => { 
        console.error(`stderr: ${data.toString()}`); 
    });

    pythonProcess.on('close', async (code) => { // Handling process close event
        if (imagePath && imagePath.startsWith('/tmp')) { 
            fs.unlink(imagePath, (err) => { // Deleting temporary file
                if (err) console.error('Error deleting temporary file:', err); 
            });
        }

        if (code === 0) { // Checking process exit code
            try {
               
                const outputData = JSON.parse(scriptOutput.trim().split('\n').pop()); // Parsing script output
                const updateData = { // Setting update data
                    $push: { images: {
                        name: imageName,
                        pbnOutputUrl: outputData.pbnOutputUrl,
                        colouredOutputUrl: outputData.colouredOutputUrl,
                        colourKeyUrl: outputData.colourKeyUrl,
                        colourCodes: outputData.colourCodes,
                        createdAt: new Date()
                    }}
                };

                await Customer.findByIdAndUpdate(userId, updateData, { new: true }); // Updating customer data

                res.json({ 
                    message: 'PBN generation successful, and image URLs added to user profile.',
                    ...outputData
                });
            } catch (error) {
                console.error('Error processing output from Python script:', error); 
                res.status(500).send({ message: 'Error processing output from Python script.' }); 
            }
        } else {
            console.error('PBN generation script exited with an error code:', code); 
            res.status(500).send({ message: 'PBN generation script exited with an error.' }); 
        }
    });
};

const getUserImages = async (req, res) => { // Function to get user images
    const userId = req.user.id; // Getting user ID from request

    try {
        // Finding user by ID
        const user = await Customer.findById(userId); 
        if (!user) { 
            return res.status(404).send({ message: 'User not found.' }); 
        }
        res.json(user.images); 
    } catch (error) {
        console.error('Error fetching user images:', error); 
        res.status(500).send({ message: 'Failed to fetch user images.' }); 
    }
};
// Function to update image name
const updateImageName = async (req, res) => { 
    const { imageId, newName } = req.body; 
    const userId = req.user._id; 

    try {
        // Finding user and updating image name
        const user = await Customer.findOneAndUpdate( 
            { "_id": userId, "images._id": imageId },
            { "$set": { "images.$.name": newName } },
            { new: true }
        );
        res.json({ status: 'success', data: { user } }); 
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Could not update image name', error: error.message }); 
    }
};

// Function to delete image
const deleteImage = async (req, res) => { 
    const { imageId } = req.body; 
    const userId = req.user._id; 

    try {
        // Finding user and deleting image
        const user = await Customer.findByIdAndUpdate( 
            userId,
            { "$pull": { "images": { "_id": imageId } } },
            { new: true }
        );
        res.json({ status: 'success', data: { user } }); 
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Could not delete image', error: error.message }); 
    }
};

module.exports = {
    generatePBN,
    getUserImages,
    updateImageName,
    deleteImage,
};
