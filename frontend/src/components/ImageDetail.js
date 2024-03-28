import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import '../css/MainPageBody.css'; 

function ImageDetail() {
    // Extracting image data from location state
    const { state } = useLocation();
    const { image } = state;

    return (
        <Container fluid className="main-page-content image-detail-top-padding">
            <Row className="justify-content-center align-items-center min-vh-100">
                <Col lg={10}>
                    <Card className="detail-card">
                        <Row>
                            {/* Display Paint By Numbers image */}
                            <Col md={4}>
                                <ImageWrapper
                                    src={image.pbnOutputUrl}
                                    title="Paint By Numbers"
                                    downloadText="Download PBN"
                                    printText="Print PBN"
                                    fileName="pbn_image.jpg"
                                />
                                {/* Link to Paint Along Page */}
                                <Link to="/paint-along" state={{ pbnOutputUrl: image.pbnOutputUrl, colourKeyUrl: image.colourKeyUrl }}>
                                    <button className="btn btn-primary w-100 mt-3">
                                        Go to Paint Along Page
                                    </button>
                                </Link>
                            </Col>
                            {/* Display Coloured Output image */}
                            <Col md={4}>
                                <ImageWrapper
                                    src={image.colouredOutputUrl}
                                    title="Coloured Output"
                                    downloadText="Download Coloured"
                                    printText="Print Coloured"
                                    fileName="coloured_image.jpg"
                                />
                            </Col>
                            {/* Display Colour Key image */}
                            <Col md={4}>
                                <ImageWrapper
                                    src={image.colourKeyUrl}
                                    title="Colour Key"
                                    downloadText="Download Colour Key"
                                    printText="Print Colour Key"
                                    fileName="colour_key_image.jpg"
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

// Component to wrap images with download and print functionality
const ImageWrapper = ({ src, title, downloadText, printText, fileName }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Function to handle image download
    const handleDownload = () => {
        // Perform download action
        const link = document.createElement('a');
        link.href = src;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Function to handle image print
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<img src="${src}" style="max-width: 100%;" />`);
        printWindow.document.close();
        printWindow.print();
    };

    // JSX return
    return (
        <Card.Body className="text-center">
            <Card.Title>{title}</Card.Title>
            <Image src={src} fluid className="mb-3 img-detail" />
            {/* Button for image download */}
            <button className="btn btn-primary w-100" onClick={handleDownload}>
                {downloadText}
            </button>
            {/* Button for image print */}
            <button className="btn btn-secondary w-100 mt-2" onClick={handlePrint}>
                {printText}
            </button>
        </Card.Body>
    );
};

export default ImageDetail;