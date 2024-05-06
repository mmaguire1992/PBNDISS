import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Image, Alert } from 'react-bootstrap';

// ImageDetail component definition
function ImageDetail() {
    // Extracting image data from location state
    const { state } = useLocation();
    const { image } = state;

    // Check if image data exists
    if (!image) {
        return (
            <Container fluid className="main-page-content">
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col lg={10}>
                        <Alert variant="danger">Image data not found!</Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    // JSX return
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

    // Function to handle image download
    const handleDownload = async () => {
        try {
            // Fetch image data
            const response = await fetch(src);
            const blob = await response.blob();
            
            // Create a URL for the blob
            const blobUrl = URL.createObjectURL(blob);

            // Create a link element and trigger download
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            // Cleanup
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading image:', error);
        }
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
            <button className="btn btn-primary w-100" onClick={handleDownload}>
                {downloadText}
            </button>
            <button className="btn btn-secondary w-100 mt-2" onClick={handlePrint}>
                {printText}
            </button>
        </Card.Body>
    );
};

export default ImageDetail;
