import React from 'react';
import MainPageBody from "../components/Homepage/MainPageBody"; 
import { Container } from 'react-bootstrap';
import HowTo from "../components/Homepage/HowTo"; 
import '../css/MainPageBody.css';

function HomePage() {
  return (
    <>
      <MainPageBody />
      <Container className="my-5">
      </Container>
      <HowTo /> 
    </>
  );
}

export default HomePage;

