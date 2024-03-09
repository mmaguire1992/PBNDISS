import React, { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function MainPageBody() {
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleImageNameChange = (e) => {
    setImageName(e.target.value);
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  const handleUploadClick = () => {
    document.querySelector('input[type=file]').click();
  };

  const handleSubmit = async () => {
    if (!image) {
      alert('Please select an image to upload.');
      return;
    }

    if (!imageName) {
      alert('Please enter a name for the image.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You are not logged in. Please log in to upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', imageName);
    formData.append('difficulty', difficulty);

    try {
      const response = await fetch('http://localhost:4000/api/generatePBN', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        const data = await response.json();
        const queryString = `?pbnOutputUrl=${encodeURIComponent(data.pbnOutputUrl)}&coloredOutputUrl=${encodeURIComponent(data.coloredOutputUrl)}&colorKeyUrl=${encodeURIComponent(data.colorKeyUrl)}`;
        navigate(`/results${queryString}`);
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
            <Form.Control
              type="text"
              placeholder="Enter image name"
              value={imageName}
              onChange={handleImageNameChange}
            />
            <input type="file" accept="image/*" className="form-control" onChange={handleImageChange} hidden />
            <Button variant="primary" onClick={handleUploadClick}>Upload Photo</Button>
            <Form.Select aria-label="Difficulty select" value={difficulty} onChange={handleDifficultyChange}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Form.Select>
            <Button variant="success" onClick={handleSubmit}>Submit</Button>
          </div>
          {image && (
            <div className="mt-3">
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default MainPageBody;
