const { spawn } = require('child_process');
const { Storage } = require('@google-cloud/storage');
const Customer = require('../models/customer');

const storage = new Storage({ keyFilename: '/Users/michaelmaguire/Downloads/maximal-kingdom-414314-57f47cd90afb.json' });

const generatePBN = async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'Image file is required.' });
    }

    const userId = req.user.id;
    const imagePath = req.file.path;
    const difficulty = req.body.difficulty;
    const imageName = req.body.name;

    if (!difficulty) {
        return res.status(400).send({ message: 'Difficulty level is required.' });
    }

    const bucketName = 'qubpbn';
    const folderName = 'QUBGOOGLECLOUD';
    const pythonScriptPath = '/Users/michaelmaguire/Library/Mobile Documents/com~apple~CloudDocs/new PbnDss/PBNDiss/server/utils/main.py';

    const pythonProcess = spawn('python3', [
        pythonScriptPath,
        imagePath,
        bucketName,
        folderName,
        difficulty
    ]);

    let scriptOutput = '';

    pythonProcess.stdout.on('data', (data) => {
        scriptOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', async (code) => {
        if (code === 0) {
            const outputLines = scriptOutput.split('\n');
            const urlLines = outputLines.filter(line => line.includes('Uploaded'));
            const urls = urlLines.map(line => line.split(' ').pop());

            if (urls.length === 3) {
                try {
                    await Customer.findByIdAndUpdate(userId, {
                        $push: { images: {
                            name: imageName,
                            pbnOutputUrl: urls[0],
                            coloredOutputUrl: urls[1],
                            colorKeyUrl: urls[2],
                            createdAt: new Date()
                        }}
                    }, { new: true });
                    res.json({
                        message: 'PBN generation successful, and image URLs added to user profile.',
                        pbnOutputUrl: urls[0],
                        coloredOutputUrl: urls[1],
                        colorKeyUrl: urls[2],
                    });
                } catch (error) {
                    console.error('Error updating user with image URLs:', error);
                    res.status(500).send({ message: 'Failed to update user with image URLs.' });
                }
            } else {
                console.error('Did not receive the correct number of URLs from the Python script:', outputLines);
                res.status(500).send({ message: 'PBN generation failed due to incorrect URL format.' });
            }
        } else {
            res.status(500).send({ message: 'PBN generation script exited with an error.' });
        }
    });
};

const getUserImages = async (req, res) => {
    const userId = req.user.id;

    try {
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

module.exports = {
    generatePBN,
    getUserImages
};
