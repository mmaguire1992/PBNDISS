import React, { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';

function MainPageBody() {
  const [image, setImage] = useState(null);
  const [imagePath, setImagePath] = useState('');
  const [difficulty, setDifficulty] = useState('easy');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePath(URL.createObjectURL(file));
    }
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  const handleSubmit = async () => {
    if (!image) {
      alert('Please select an image to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('image', image);
    formData.append('imagePath', imagePath);
    formData.append('difficulty', difficulty);

    try {
      const response = await fetch('http://localhost:4000/api/generatePBN', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();

        const queryString = `?pbnOutputUrl=${data.pbnOutputUrl}&coloredOutputUrl=${data.coloredOutputUrl}&colorKeyUrl=${data.colorKeyUrl}`;
        const newUrl = `/results${queryString}`;

        window.location.href = newUrl;
      } else {
        const data = await response.json();
        alert('PBN generation failed: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while generating the PBN.');
    }
  };

  return (
    <Container fluid className="bg-light px-0">
      <Row className="justify-content-center align-items-center text-center" style={{ height: '300px' }}>
        <Col xs={12} md={6} lg={4}>
          <h1 className="fw-bold">Welcome to Your Site</h1>
          <p>Upload your image to create a unique paint-by-numbers masterpiece.</p>
          <div className="d-grid gap-2">
            <input type="file" accept="image/*" className="form-control" onChange={handleImageChange} hidden />
            <Button variant="primary" onClick={() => document.querySelector('input[type=file]').click()}>Upload Photo</Button>
            <Form.Select aria-label="Difficulty select" value={difficulty} onChange={handleDifficultyChange}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Form.Select>
            <Button variant="success" onClick={handleSubmit}>Submit</Button>
          </div>
          {image && (
            <div className="mt-3">
              <img src={URL.createObjectURL(image)} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '200px' }} />
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default MainPageBody;
