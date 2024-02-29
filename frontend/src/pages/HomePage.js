import React from 'react';
import MainPageBody from "../components/MainPageBody"; 
import { Container } from 'react-bootstrap';

function HomePage() {
  return (
    <>
      <MainPageBody />
      <Container className="my-5">
        <h2>About Our Service</h2>
        <p>
          Welcome to our unique platform where you can transform your favorite images into paint-by-numbers projects. Our site offers an easy-to-use interface for uploading your photos and converting them into a downloadable format. Whether you're an experienced painter or just looking for a new hobby, our service provides a fun and creative way to enjoy art. Upload your image today and start painting!
        </p>
        <h3>How It Works</h3>
        <p>
          Simply upload an image of your choice, and our tool will convert it into a paint-by-numbers template. Once the conversion is complete, you can download your custom template along with a color guide. Gather your painting supplies, and you're ready to create your masterpiece.
        </p>
      </Container>
    </>
  );
}

export default HomePage;
