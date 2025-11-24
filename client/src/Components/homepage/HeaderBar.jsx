import React from "react";
import { Header, Title, SlideButton } from "./HeaderBar.Styles";

const HeaderBar = ({ onOpen }) => {
  return (
    <Header>
      <Title>Dashboard Overview</Title>
      <SlideButton onClick={onOpen}>➤</SlideButton>
    </Header>
  );
};

export default HeaderBar;
