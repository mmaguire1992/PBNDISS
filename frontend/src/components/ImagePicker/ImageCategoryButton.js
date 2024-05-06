import React from 'react';
import { Button } from 'react-bootstrap';

// Functional component for an image category button
const ImageCategoryButton = ({ category, onClick }) => (
    // Render a button with variant secondary and onClick event handler
    <Button variant="secondary" onClick={() => onClick(category)} id={`image-category-button-${category}`}>
        {category}
    </Button>
);

export default ImageCategoryButton;
