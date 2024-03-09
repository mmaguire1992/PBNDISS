import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function ResultsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const pbnOutputUrl = decodeURIComponent(urlParams.get('pbnOutputUrl'));
  const coloredOutputUrl = decodeURIComponent(urlParams.get('coloredOutputUrl'));
  const colorKeyUrl = decodeURIComponent(urlParams.get('colorKeyUrl'));

  console.log("PBN Output URL:", pbnOutputUrl);
  console.log("Colored Output URL:", coloredOutputUrl);
  console.log("Color Key URL:", colorKeyUrl);

  return (
    <Container fluid className="bg-light px-0">
      <Row className="justify-content-center align-items-center text-center" style={{ minHeight: '100vh' }}>
        <Col>
          <h1>Results Page</h1>
          <h3>Paint by Numbers Output</h3>
          {pbnOutputUrl && (
            <img
              src={pbnOutputUrl}
              alt="PBN Output"
              style={{ maxWidth: '100%' }}
            />
          )}
          <h3>Colored Output</h3>
          {coloredOutputUrl && (
            <img
              src={coloredOutputUrl}
              alt="Colored Output"
              style={{ maxWidth: '100%' }}
            />
          )}
          <h3>Color Key</h3>
          {colorKeyUrl && (
            <img
              src={colorKeyUrl}
              alt="Color Key"
              style={{ maxWidth: '100%' }}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ResultsPage;
