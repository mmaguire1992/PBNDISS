import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const PaintAlongGuide = () => {
  const handleGoBack = () => {
    window.history.back(); 
  };

  return (
    <Container fluid className="paint-guide-container overlay">
      <Row className="justify-content-center mb-3">
        <Col lg={12}>
          <Button onClick={handleGoBack} variant="primary" className="mb-3">Back</Button>
          <h2>Getting Started</h2>
        </Col>
      </Row>
      <Row className="justify-content-center mb-3">
        <Col lg={12}>
          <h2>Painting</h2>
          <ul>
            <li><strong>Choose Your Brush:</strong> Customise your brush size and shape to match your painting preference. Use the slider to adjust the size and select from the dropdown menu to choose between a round or square brush.</li>
            <li><strong>Pick a Colour:</strong> Click on the colour key canvas to select a colour. The colour you pick will be immediately available for painting on the main canvas.</li>
            <li><strong>Start Painting:</strong> Click and hold your mouse button down on the main canvas to begin painting. You can release the button to stop. Move your mouse while holding the button down to continue painting.</li>
          </ul>
        </Col>
      </Row>
      <Row className="justify-content-center mb-3">
        <Col lg={12}>
          <h2>Editing</h2>
          <ul>
            <li><strong>Undo/Redo:</strong> Made a mistake? Click the "Undo" button to revert your last action. You can use the "Redo" button to reapply it if needed.</li>
            <li><strong>Zoom In/Out:</strong> Use the "Zoom In" and "Zoom Out" buttons to get a closer look or to view more of the canvas at once. Use the "Reset Zoom" button to return to the original view.</li>
            <li><strong>Reset:</strong> Want to start over? The "Reset" button clears your current progress and reloads the original image.</li>
          </ul>
        </Col>
      </Row>
      <Row className="justify-content-center mb-3">
        <Col lg={12}>
          <h2>Saving and Sharing</h2>
          <ul>
            <li><strong>Download Image:</strong> When you're happy with your masterpiece, use the "Download Image" button to save it to your device.</li>
            <li><strong>Print Image:</strong> Ready to display your art? The "Print Image" button prepares your painting for printing.</li>
          </ul>
        </Col>
      </Row>
      <Row className="justify-content-center mb-3">
        <Col lg={12}>
          <h2>Tips</h2>
          <ul>
            <li>Take advantage of the colour key to plan your painting strategy.</li>
            <li>Experiment with brush sizes for different areas of the canvas to achieve the desired effect.</li>
            <li>Use zoom functionality for intricate parts of the painting.</li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default PaintAlongGuide;
