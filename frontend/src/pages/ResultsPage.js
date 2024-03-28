import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../css/MainPageBody.css'; 

function ResultsPage() {
  // Retrieve URLs of generated images from query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const pbnOutputUrl = decodeURIComponent(urlParams.get('pbnOutputUrl'));
  const colouredOutputUrl = decodeURIComponent(urlParams.get('colouredOutputUrl'));
  const colourKeyUrl = decodeURIComponent(urlParams.get('colourKeyUrl')); 

  return (
    <Container fluid className="main-page-content results-top-padding">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={8} lg={6} className="overlay">
          <Card className="result-card">
            <Card.Body>
              <h1 className="main-heading">Your Results</h1>
              {/* Render sections for each generated image if URLs are available */}
              {pbnOutputUrl && (
                <ResultSection title="Paint by Numbers Output" imageUrl={pbnOutputUrl} />
              )}
              {colouredOutputUrl && (
                <ResultSection title="Coloured Output" imageUrl={colouredOutputUrl} />
              )}
              {colourKeyUrl && (
                <ResultSection title="Colour Key" imageUrl={colourKeyUrl} />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// Component to render each section for a generated image
const ResultSection = ({ title, imageUrl }) => (
  <div className="mb-4 result-section">
    <h3 className="lead">{title}</h3>
    <img
      src={imageUrl}
      alt={title}
      className="img-fluid rounded"
    />
  </div>
);

export default ResultsPage;
