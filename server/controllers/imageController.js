const { spawn } = require('child_process');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({ keyFilename: '/Users/michaelmaguire/Downloads/maximal-kingdom-414314-57f47cd90afb.json' });

const generatePBN = (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'Image file is required.' });
    }

    const imagePath = req.file.path;
    const difficulty = req.body.difficulty;

    if (!difficulty) {
        return res.status(400).send({ message: 'Difficulty level is required.' });
    }

    const bucketName = 'qubpbn';
    const folderName = 'QUBGOOGLECLOUD';
    const pythonScriptPath = '/Users/michaelmaguire/Downloads/PBNDiss/server/utils/main.py'; 

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

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            const outputLines = scriptOutput.split('\n');
            const urlLines = outputLines.filter(line => line.includes('Uploaded'));
            const urls = urlLines.map(line => line.split(' ').pop());

            if (urls.length === 3) {
                res.json({
                    pbnOutputUrl: urls[0],
                    coloredOutputUrl: urls[1],
                    colorKeyUrl: urls[2],
                });
            } else {
                console.error('Did not receive the correct number of URLs from the Python script:', outputLines);
                res.status(500).send({ message: 'PBN generation failed due to incorrect URL format.' });
            }
        } else {
            res.status(500).send({ message: 'PBN generation script exited with an error.' });
        }
    });
};

module.exports = {
    generatePBN
};
