import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Button, Form, Modal } from 'react-bootstrap';
import '../css/ImagePicker.css'; 

const ImagePicker = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();
    const apiKey = 'zDxoCANI2u3h8whwrsB2aKofGfYfYP1MQIEV3JiXlTTutpeygmLXOs3d'; 
    
    const categoryNames = [ // List of predefined categories
    'Landscape', 'Cars', 'Nature', 'Animals', 'Travel', 'Food', 'Architecture', 'Technology', 'Fashion', 'Sports',
    'Art', 'Music', 'Health', 'Fitness', 'Education', 'Business', 'People', 'Family', 'Work', 'Hobbies',
    'Beach', 'Mountains', 'City', 'Sunset', 'Winter', 'Summer', 'Spring', 'Autumn', 'Pets', 'Wildlife',
    'Books', 'Movies', 'Gardening', 'Cooking', 'DIY', 'Photography', 'Shopping', 'Adventure', 'History', 'Science'
];

// Fetches images based on the selected category
const fetchCategoryImages = async (category) => {
    try {
        const response = await fetch(`https://api.pexels.com/v1/search?query=${category}&per_page=40`, {
            headers: new Headers({
                Authorization: apiKey
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return { category, images: data.photos };
    } catch (error) {
        console.error(`Fetching ${category} images failed:`, error);
        return { category, images: [] };
    }
};

// Handles the selection of an image
const handleImageSelect = (image) => {
    setSelectedImage(image.src.original);
    setShowModal(true);
};

// Confirms the selected image and navigates to the main page
const handleConfirmation = () => {
    navigate('/main', { state: { selectedImage: selectedImage } });
    setShowModal(false);
};

// Fetches images based on the search term
const fetchSearchImages = async () => {
    if (searchTerm.trim() !== '') {
        setLoading(true);
        try {
            const response = await fetch(`https://api.pexels.com/v1/search?query=${searchTerm}&per_page=40`, {
                headers: new Headers({
                    Authorization: apiKey
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCategories([{ category: searchTerm, images: data.photos }]);
            setLoading(false);
        } catch (error) {
            console.error('Fetching search results failed:', error);
            setLoading(false);
        }
    }
};

// Handles input change in the search field
const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
};

// Handles the search button click
const handleSearchButtonClick = () => {
    fetchSearchImages();
};

// Handles the click event of category buttons
const handleCategoryButtonClick = async (category) => {
    setLoading(true);
    const categoryImages = await fetchCategoryImages(category);
    setCategories([categoryImages]);
    setLoading(false);
};

// JSX return
return (
    <Container className="image-picker-container mt-5">
        <Row>
            <Col>
                {/* Title and search form */}
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
                    <Button variant="primary" onClick={handleSearchButtonClick}>
                        Search
                    </Button>
                </Form>
                {/* Category buttons */}
                <div className="category-buttons">
                    {categoryNames.map((category, index) => (
                        <Button key={index} variant="secondary" onClick={() => handleCategoryButtonClick(category)}>
                            {category}
                        </Button>
                    ))}
                </div>
                {/* Loading spinner */}
                {loading ? (
                    <div className="spinner-container">
                        <Spinner animation="border" role="status" />
                    </div>
                ) : (
                    <>
                        {/* Display categories and their images */}
                        {categories.map((category, index) => (
                            <div key={index}>
                                <h3>{category.category}</h3>
                                <div className="scroll-container">
                                    <Row>
                                        {category.images.map((image) => (
                                            <Col key={image.id} md={4} className="mb-4">
                                                <Card 
                                                    className="image-card" 
                                                    onClick={() => handleImageSelect(image)}
                                                >
                                                    <Card.Img variant="top" src={image.src.medium} alt="Selected Image" />
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </Col>
        </Row>
        {/* Modal for confirmation */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Image Selection</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Please confirm if this is the image you want:</p>
                {/* Display selected image here */}
                {selectedImage && <img src={selectedImage} alt="Selected Image" className="confirmation-image" style={{ maxWidth: '70%', margin: '0 auto' }} />}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleConfirmation}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    </Container>
);
};

export default ImagePicker;