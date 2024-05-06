import React from 'react';
import { Card, Button } from 'react-bootstrap';

// Component for rendering an image card
const ImageCard = ({ image, onEditClick, onDeleteClick, onImageClick }) => {
    // Function to handle image click
    const handleImageClick = () => {
        onImageClick(image);
    };

    // Function to handle edit button click
    const handleEditClick = (e) => {
        onEditClick(e, image);
    };

    // Function to handle delete button click
    const handleDeleteClick = (e) => {
        onDeleteClick(e, image._id);
    };

    return (
        <Card className="art-card" onClick={handleImageClick} id={`image-card-${image._id}`}>
            <Card.Img variant="top" src={image.colouredOutputUrl} id={`image-card-image-${image._id}`} />
            <Card.Body>
                <Card.Title id={`image-card-title-${image._id}`}>{image.name}</Card.Title>
                <Button variant="primary" onClick={handleEditClick} className="btn-orange" id={`image-card-edit-${image._id}`}>Edit</Button>
                <Button variant="danger" onClick={handleDeleteClick} style={{ marginLeft: '10px' }} className="btn-orange" id={`image-card-delete-${image._id}`}>Delete</Button>
            </Card.Body>
        </Card>
    );
};

export default ImageCard;
