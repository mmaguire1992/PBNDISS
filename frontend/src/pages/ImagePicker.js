import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Button, Form, Modal, Alert } from 'react-bootstrap';
import { fetchCategoryImages, fetchSearchImages } from '../components/ImagePicker/ImageAPI'; 
import ImageCategoryButton from '../components/ImagePicker/ImageCategoryButton'; 
import '../css/ImagePicker.css';

const ImagePicker = () => {
    // State variables for managing component state
    const [categories, setCategories] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [showModal, setShowModal] = useState(false); 
    const [selectedImage, setSelectedImage] = useState(null); 
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    // Array of predefined category names
    const categoryNames = [
        'Landscape', 'Cars', 'Nature', 'Animals', 'Travel', 'Food', 'Architecture', 'Technology', 'Fashion', 'Sports',
        'Art', 'Music', 'Health', 'Fitness', 'Education', 'Business', 'People', 'Family', 'Work', 'Hobbies',
        'Beach', 'Mountains', 'City', 'Sunset', 'Winter', 'Summer', 'Spring', 'Autumn', 'Pets', 'Wildlife',
        'Books', 'Movies', 'Gardening', 'Cooking', 'DIY', 'Photography', 'Shopping', 'Adventure', 'History', 'Science'
    ];

    // Function to handle click event on category buttons
    const handleCategoryButtonClick = async (category) => {
        setLoading(true); // Set loading state to true
        try {
            const images = await fetchCategoryImages(category);
            setCategories([{ category, images }]);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch images. Please try again later.');
            setLoading(false);
        }
    };

    // Function to handle click event on the search button
    const handleSearchButtonClick = async () => {
        if (searchTerm.trim() !== '') {
            setLoading(true);
            try {
                const images = await fetchSearchImages(searchTerm);
                setCategories([{ category: searchTerm, images }]);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch images. Please try again later.');
                setLoading(false);
            }
        }
    };

    // Function to handle click event on an image card
    const handleImageSelect = (image) => {
        setSelectedImage(image.src.original);
        setShowModal(true);
    };

    // Function to handle change event on the search input
    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Function to handle confirmation of image selection
    const handleConfirmation = () => {
        navigate('/main', { state: { selectedImage: selectedImage } });
        setShowModal(false);
    };

    // Render the ImagePicker component
    return (
        <Container id="image-picker-container" className="image-picker-container mt-5">
            <h2>Select an Image</h2>
            <Form className="mb-3">
                <Form.Group controlId="searchTerm">
                    <Form.Control
                        type="text"
                        placeholder="Search for images..."
                        value={searchTerm}
                        onChange={handleSearchInputChange}
                    />
                </Form.Group>
                <Button id="search-button" variant="primary" onClick={handleSearchButtonClick} className="btn-orange">
                    Search
                </Button>
            </Form>
            {error && <Alert id="error-alert" variant="danger">{error}</Alert>}
            <div id="category-buttons" className="category-buttons">
                {categoryNames.map((category, index) => (
                    <ImageCategoryButton key={index} category={category} onClick={handleCategoryButtonClick} />
                ))}
            </div>
            {loading ? (
                <div id="spinner-container" className="spinner-container">
                    <Spinner id="spinner" animation="border" role="status" />
                </div>
            ) : (
                <>
                    {categories.map((category, index) => (
                        <div id={`category-${index}`} key={index}>
                            <h3>{category.category}</h3>
                            <div id={`scroll-container-${index}`} className="scroll-container">
                                <Row>
                                    {category.images.map((image, i) => (
                                        <Col key={i} md={4} className="mb-4">
                                            <Card
                                                id={`image-card-${image.id}`}
                                                className="image-card"
                                                onClick={() => handleImageSelect(image)}
                                            >
                                                <Card.Img variant="top" src={image.src.medium} />
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        </div>
                    ))}
                </>
            )}
            <Modal id="confirmation-modal" show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Image Selection</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please confirm if this is the image you want:</p>
                    {selectedImage && <img src={selectedImage} alt="Selected Image" className="confirmation-image" style={{ maxWidth: '100%', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />}
                </Modal.Body>
                <Modal.Footer>
                    <Button id="cancel-button" variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button id="confirm-button" variant="primary" onClick={handleConfirmation}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ImagePicker;
