import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../css/ArtProfile.css'; 

function ArtProfile() {
    const [images, setImages] = useState([]); 
    const [showModal, setShowModal] = useState(false); 
    const [currentImage, setCurrentImage] = useState({}); 
    const [newName, setNewName] = useState(''); 
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); 
    const [imageToDelete, setImageToDelete] = useState(null); 
    const navigate = useNavigate(); 
    // Fetch user's images from the server on component mount
    
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from local storage
                const response = await axios.get('http://localhost:4000/api/myImages', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.data && Array.isArray(response.data)) {
                    const sortedImages = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setImages(sortedImages); // Set fetched images to state
                } else {
                    console.error('Failed to fetch images: Unexpected response structure', response.data);
                }
            } catch (error) {
                console.error('Failed to fetch images', error);
            }
        };
    
        fetchImages();
    }, []);

    // Handler for edit button click
    const handleEditClick = (e, image) => {
        e.stopPropagation(); // Prevent event from bubbling to the card's onClick
        setCurrentImage(image);
        setNewName(image.name);
        setShowModal(true);
    };

    // Handler for updating image name
    const handleUpdateImageName = async () => {
        try {
            const response = await axios.patch('http://localhost:4000/api/updateImageName', {
                imageId: currentImage._id,
                newName,
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.status === 200) {
                const updatedImages = images.map(img => img._id === currentImage._id ? { ...img, name: newName } : img);
                setImages(updatedImages);
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error updating image name:', error);
        }
    };

    // Handler for deleting an image
    const handleDeleteImage = (e, imageId) => {
        e.stopPropagation(); // Prevent event from bubbling to the card's onClick
        setImageToDelete(imageId); // Set image ID to delete
        setShowDeleteConfirmation(true); // Show delete confirmation modal
    };

    // Handler for confirming delete operation
    const confirmDeleteImage = async () => {
        try {
            const response = await axios.delete('http://localhost:4000/api/deleteImage', {
                data: { imageId: imageToDelete },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.status === 200) {
                const filteredImages = images.filter(img => img._id !== imageToDelete);
                setImages(filteredImages);
                setShowDeleteConfirmation(true); // Hide delete confirmation modal
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    // Handler for clicking on an image
    const handleImageClick = (image) => {
        navigate('/image-detail', { state: { image } }); // Navigate to image detail page
    };

    // Render the ArtProfile component
    return (
        <Container fluid className="main-page-content">
            <Row className="justify-content-center">
                {images.map((image, index) => (
                    <Col key={index} md={6} lg={4} className="mb-4">
                        <Card className="art-card" onClick={() => handleImageClick(image)}>
                            <Card.Img variant="top" src={image.colouredOutputUrl} /> 
                            <Card.Body>
                                <Card.Title>{image.name}</Card.Title>
                                <Button variant="primary" onClick={(e) => handleEditClick(e, image)}>Edit</Button>
                                <Button variant="danger" onClick={(e) => handleDeleteImage(e, image._id)} style={{ marginLeft: '10px' }}>Delete</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            {/* Modal for editing image name */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Image Name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>New Name:</Form.Label>
                            <Form.Control type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleUpdateImageName}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
            {/* Modal for confirming delete operation */}
            <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this image?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDeleteImage}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default ArtProfile;
