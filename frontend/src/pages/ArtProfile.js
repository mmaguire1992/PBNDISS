import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Modal, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchImages, updateImageName, deleteImage } from '../components/ArtProfile/ArtProfileApi'; 
import ImageCard from '../components/ArtProfile/ImageCard';
import '../css/ArtProfile.css';

function ArtProfile() {
    const [images, setImages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentImage, setCurrentImage] = useState({});
    const [newName, setNewName] = useState('');
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchImages(token)
                .then(data => {
                    const sortedImages = Array.isArray(data) ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
                    setImages(sortedImages);
                })
                .catch(error => {
                    setError('Failed to fetch images. Please try again later.');
                    console.error('Failed to fetch images:', error);
                });
        }
    }, []);

    const handleEditClick = (e, image) => {
        e.stopPropagation();
        setCurrentImage(image);
        setNewName(image.name);
        setShowModal(true);
    };

    const handleUpdateImageName = async () => {
        const token = localStorage.getItem('token');
        if (token && currentImage._id) {
            try {
                await updateImageName(currentImage._id, newName, token);
                const updatedImages = images.map(img => img._id === currentImage._id ? { ...img, name: newName } : img);
                setImages(updatedImages);
                setShowModal(false);
            } catch (error) {
                setError('Failed to update image name. Please try again later.');
                console.error('Error updating image name:', error);
            }
        }
    };

    const handleDeleteImage = (e, imageId) => {
        e.stopPropagation();
        setImageToDelete(imageId);
        setShowDeleteConfirmation(true);
    };

    const confirmDeleteImage = async () => {
        const token = localStorage.getItem('token');
        if (token && imageToDelete) {
            try {
                await deleteImage(imageToDelete, token);
                const filteredImages = images.filter(img => img._id !== imageToDelete);
                setImages(filteredImages);
                setShowDeleteConfirmation(false);
            } catch (error) {
                setError('Failed to delete image. Please try again later.');
                console.error('Error deleting image:', error);
            }
        }
    };

    const handleImageClick = (image) => {
        navigate('/image-detail', { state: { image } });
    };

    return (
        <Container fluid className="main-page-content">
            {error && <Alert variant="danger">{error}</Alert>}
            <Row className="justify-content-center art-cards-grid">
                {images.map((image, index) => (
                    <Col key={index} md={6} lg={4} className="mb-4">
                        <ImageCard 
                            image={image} 
                            onEditClick={handleEditClick} 
                            onDeleteClick={handleDeleteImage} 
                            onImageClick={handleImageClick} 
                        />
                    </Col>
                ))}
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Image Name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>New Name:</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={newName} 
                                onChange={(e) => setNewName(e.target.value)} 
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleUpdateImageName} className="btn-orange">Save Changes</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this image?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDeleteImage} className="btn-orange">Delete</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default ArtProfile;
