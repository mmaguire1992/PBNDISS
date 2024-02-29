import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function ResultsPage() {

  const urlParams = new URLSearchParams(window.location.search);
  const pbnOutputUrl = urlParams.get('pbnOutputUrl');
  const coloredOutputUrl = urlParams.get('coloredOutputUrl');
  const colorKeyUrl = urlParams.get('colorKeyUrl');

  const [pbnOutputError, setPbnOutputError] = useState(false);
  const [coloredOutputError, setColoredOutputError] = useState(false);
  const [colorKeyError, setColorKeyError] = useState(false);

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
              onError={() => setPbnOutputError(true)}
            />
          )}
          {pbnOutputError && <p>Error loading PBN Output image.</p>}
          <h3>Colored Output</h3>
          {coloredOutputUrl && (
            <img
              src={coloredOutputUrl}
              alt="Colored Output"
              style={{ maxWidth: '100%' }}
              onError={() => setColoredOutputError(true)}
            />
          )}
          {coloredOutputError && <p>Error loading Colored Output image.</p>}
          <h3>Color Key</h3>
          {colorKeyUrl && (
            <img
              src={colorKeyUrl}
              alt="Color Key"
              style={{ maxWidth: '100%' }}
              onError={() => setColorKeyError(true)}
            />
          )}
          {colorKeyError && <p>Error loading Color Key image.</p>}
        </Col>
      </Row>
    </Container>
  );
}

export default ResultsPage;
