import React from "react";
import { Header, Title, SlideButton, NotificationDot } from "./HeaderBar.Styles";
import { IoNotificationsOutline } from "react-icons/io5";

const HeaderBar = ({ onOpen, hasNotification = true }) => {
  return (
    <Header>
      <Title>Dashboard Overview</Title>

      <SlideButton onClick={onOpen}>
        <IoNotificationsOutline size={20} />
        {hasNotification && <NotificationDot />}
      </SlideButton>
    </Header>
  );
};

export default HeaderBar;