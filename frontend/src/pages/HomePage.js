import React from 'react';
import MainPageBody from "../components/MainPageBody"; 
import { Container } from 'react-bootstrap';
import HowTo from "../components/HowTo"; 

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

