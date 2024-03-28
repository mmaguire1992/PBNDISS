import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Form, ProgressBar } from 'react-bootstrap';
import io from 'socket.io-client'; 
import BackgroundVideo from './BackgroundVideo'; 
import '../css/MainPageBody.css'; 

function MainPageBody() {
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(''); 
    const [imageName, setImageName] = useState(''); 
    const [difficulty, setDifficulty] = useState('easy'); 
    const [progress, setProgress] = useState(0); 
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate(); 
    const location = useLocation(); 

    // Effect hook for socket connection and progress updates
    useEffect(() => {
        if (location.state && location.state.selectedImage) {
            setImageUrl(location.state.selectedImage);
            setImageName('Selected Art');
        }

        const socket = io('http://localhost:4000'); // Socket connection
        socket.on('progressUpdate', (data) => {
            setProgress(data.progress); // Update progress
            setLoading(true); // Set loading state
        });

        return () => socket.disconnect(); // Disconnect socket on component unmount
    }, [location.state]);

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImageName(file.name.split('.')[0]);
            setImageUrl('');
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image && !imageUrl) {
            alert('Please select an image to upload.'); // Alert if no image selected
            return;
        }

        setLoading(true); // Set loading state
        setProgress(0); // Reset progress

        const formData = new FormData(); // Form data for image upload
        if (image) formData.append('image', image);
        if (imageUrl) formData.append('imageUrl', imageUrl);
        formData.append('name', imageName);
        formData.append('difficulty', difficulty);

        const token = localStorage.getItem('token');
        if (!token) {
            alert('You are not logged in. Please log in to upload an image.'); // Alert if user not logged in
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/api/generatePBN', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to generate PBN. Response status: ' + response.status);
            }

            const data = await response.json();
            alert('PBN generation successful!'); // Alert on successful PBN generation
            navigate(`/results?${new URLSearchParams(data).toString()}`); // Navigate to results page
        } catch (error) {
            console.error('Error during form submission:', error); 
            alert('An error occurred while generating the PBN.'); 
        } finally {
            setLoading(false); // Reset loading state
            setProgress(100); // Set progress to 100
        }
    };

    return (
        <>
            <BackgroundVideo />
            <Container fluid className="main-page-content">
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col md={8} lg={6} xl={5} className="text-center overlay">
                        <div>
                            <h1 className="main-heading mb-4">Paint By Numbers</h1>
                            <p className="lead mb-4">Upload your image to create a unique paint-by-numbers masterpiece.</p>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Control
                                        size="lg"
                                        type="text"
                                        placeholder="Enter image name"
                                        value={imageName}
                                        onChange={(e) => setImageName(e.target.value)}
                                        className="mb-3 text-input"
                                    />
                                    <Form.Control
                                        size="lg"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="mb-3"
                                    />
                                    <Form.Select
                                        size="lg"
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="mb-3 select-input"
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </Form.Select>
                                    <Button variant="warning" size="lg" type="submit" className="w-100">
                                        Submit
                                    </Button>
                                </Form.Group>
                            </Form>
                            {loading && (
                                <div className="mt-3">
                                    <ProgressBar now={progress} label={`${progress}%`} animated variant="success" />
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

