import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const UploadForm = ({ newArtName, setNewArtName, newArtFile, setNewArtFile, fetchArtFeed }) => {
    // State for error message and confirmation pop-up
    const [errorMessage, setErrorMessage] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Function to handle uploading art
    const uploadArt = async (e) => {
        e.preventDefault(); 
        if (!newArtFile || !newArtName) return; // Return if art file or name is missing

        const formData = new FormData(); // Create form data
        formData.append('image', newArtFile); // Append image file
        formData.append('name', newArtName); // Append art name

        try {
            const token = localStorage.getItem('token'); 
            await axios.post('http://localhost:4000/api/artFeed/upload', formData, { 
                headers: {
                    'Content-Type': 'multipart/form-data', 
                    'Authorization': `Bearer ${token}`, 
                },
            });
            fetchArtFeed(); // Fetch updated art feed
            setShowConfirmation(true); // Show confirmation message upon successful upload
        } catch (error) {
            console.error('Failed to upload art:', error);
            setErrorMessage('Failed to upload art. Please try again.'); // Set error message if upload fails
        }

        setNewArtName(''); 
        setNewArtFile(null); 
    };

    // Function to handle file change
    const handleFileChange = (event) => {
        setNewArtFile(event.target.files[0]); // Set new art file
    };

    // Render upload form component
    return (
        <form onSubmit={uploadArt} className="mb-4" id="upload-form">
            {errorMessage && <div className="alert alert-danger" id="error-message">{errorMessage}</div>}
            {showConfirmation && ( // Display confirmation message when showConfirmation is true
                <div className="alert alert-success" role="alert" id="confirmation-message">
                    Image uploaded successfully!
                </div>
            )}
            <div className="d-flex align-items-center">
                <div className="form-group flex-grow-1 mr-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Art Name"
                        value={newArtName}
                        onChange={(e) => setNewArtName(e.target.value)}
                        required
                        id="art-name-input"
                    />
                </div>
                <div className="form-group flex-grow-1 mr-2">
                    <input
                        type="file"
                        className="form-control-file"
                        onChange={handleFileChange}
                        required
                        id="art-file-input"
                    />
                </div>
                <Button type="submit" className="btn btn-orange" id="upload-button">
                    Upload
                </Button>
            </div>
        </form>
    );
};

// PropTypes for type checking
UploadForm.propTypes = {
    newArtName: PropTypes.string.isRequired,
    setNewArtName: PropTypes.func.isRequired,
    newArtFile: PropTypes.any,
    setNewArtFile: PropTypes.func.isRequired,
    fetchArtFeed: PropTypes.func.isRequired,
};

export default UploadForm; 
