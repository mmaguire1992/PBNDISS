import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Form, ProgressBar } from 'react-bootstrap';
import io from 'socket.io-client';
import BackgroundVideo from '../BackgroundVideo';

function MainPageBody() {
    // State variables for image, image URL, image name, difficulty, progress, loading state, error message
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imageName, setImageName] = useState('');
    const [difficulty, setDifficulty] = useState('easy');
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    // Hooks for navigation and location
    const navigate = useNavigate();
    const location = useLocation();

    // Effect hook for setting image URL and name, and socket connection
    useEffect(() => {
        if (location.state && location.state.selectedImage) {
            setImageUrl(location.state.selectedImage);
            setImageName('Selected Art');
        }

        // Socket connection for progress updates
        const socket = io('http://localhost:4000');
        socket.on('progressUpdate', (data) => {
            setProgress(data.progress);
            setLoading(true);
        });

        return () => socket.disconnect();
    }, [location.state]);

    // Function to handle changes in the selected image
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImageName(file.name.split('.')[0]);
            setImageUrl('');
        }
    };

    // A function to handle submission of the form
    const handleSubmit = async (e) => {
        // Prevent default form submission behavior
        e.preventDefault();

        // Check if image or image URL is provided
        if (!image && !imageUrl) {
            // Display error message if no image is selected
            setErrorMessage('Please select an image to upload.');
            return;
        }

        // Set loading state and reset progress and error message
        setLoading(true);
        setProgress(0);
        setErrorMessage('');

        // Create form data for image upload
        const formData = new FormData();
        if (image) formData.append('image', image);
        if (imageUrl) formData.append('imageUrl', imageUrl);
        formData.append('name', imageName);
        formData.append('difficulty', difficulty);

        // Retrieve user token from local storage
        const token = localStorage.getItem('token');
        if (!token) {
            // Display error message if user is not logged in
            setErrorMessage('You are not logged in. Please log in to upload an image.');
            setLoading(false);
            return;
        }

        try {
            // Send request to server to generate Paint By Numbers
            const response = await fetch('http://localhost:4000/api/generatePBN', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                // Throw error if failed to generate Paint By Numbers
                throw new Error('Failed to generate Paint By Numbers. Response status: ' + response.status);
            }

            // Parse response data
            const data = await response.json();
            // Display success message
            alert('Paint By Numbers generation successful!');
            // Navigate to results page with generated data
            navigate(`/results?${new URLSearchParams(data).toString()}`);
        } catch (error) {
            // Log and display error if an error occurs during form submission
            console.error('Error during form submission:', error);
            setErrorMessage('An error occurred while generating the Paint By Numbers.');
        } finally {
            // Reset loading state and set progress to 100%
            setLoading(false);
            setProgress(100);
        }
    };


    // Rendering main page body
    return (
        <>
            <BackgroundVideo id="background-video" />
            <Container fluid className="main-page-content" id="main-page-content">
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col md={8} lg={6} xl={5} className="text-center overlay">
                        <div>
                            {/* Main heading and description */}
                            <h1 className="main-heading mb-4" id="main-heading">Paint By Numbers</h1>
                            <p className="lead mb-4" id="main-description">Upload your image to create a unique paint-by-numbers masterpiece.</p>
                            {/* Form for image upload */}
                            <Form onSubmit={handleSubmit} id="image-upload-form">
                                {errorMessage && <div className="alert alert-danger" id="error-message">{errorMessage}</div>}
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        size="lg"
                                        type="text"
                                        placeholder="Enter image name"
                                        value={imageName}
                                        onChange={(e) => setImageName(e.target.value)}
                                        className="mb-3 text-input"
                                        id="image-name-input"
                                    />
                                    <Form.Control
                                        size="lg"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="mb-3"
                                        id="image-file-input"
                                    />
                                    <Form.Select
                                        size="lg"
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="mb-3 select-input"
                                        id="difficulty-select"
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </Form.Select>
                                    {/* Submit button */}
                                    <Button variant="warning" size="lg" type="submit" className="w-100" id="submit-button">
                                        Submit
                                    </Button>
                                </Form.Group>
                            </Form>
                            {/* Progress bar */}
                            {loading && (
                                <div className="mt-3" id="progress-bar-container">
                                    <ProgressBar now={progress} label={`${progress}%`} animated variant="success" id="progress-bar" />
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default MainPageBody;
