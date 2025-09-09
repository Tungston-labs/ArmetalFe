// src/Pages/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/Sidebar';
import { Container, ContentArea } from '../Components/Layout.styles';

const LayOut = () => {
  return (
    <Container>
      <Sidebar />
      <ContentArea>
        <Outlet />
      </ContentArea>
    </Container>
  );
};

export default LayOut;
