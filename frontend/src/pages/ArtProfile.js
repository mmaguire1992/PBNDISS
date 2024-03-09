import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function ArtProfile() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/myImages', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setImages(data);
            } else {
                console.error('Failed to fetch images');
            }
        };

        fetchImages();
    }, []);

    return (
        <Container className="mt-4">
            <Row>
                {images.map((image, index) => (
                    <Col key={index} md={4} className="mb-4">
                        <Card>
                            <Card.Img variant="top" src={image.pbnOutputUrl} />
                            <Card.Body>
                                <Card.Title>{image.name ? image.name : 'Paint By Numbers Output'}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default ArtProfile;
