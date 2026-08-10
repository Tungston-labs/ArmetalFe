import React, { useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa6";
import { CiCalendarDate } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa";
import { PiSwap } from "react-icons/pi";
import { LuSunMedium } from "react-icons/lu";
import NotificationModal from "./NotificationModal/NotificationModal";
import {
  Container,
  DateBox,
  DateSection,
  TimeSection,
  RightSection,
  NotificationButton,
  NotificationDot,
  Language,
  Profile,
  Avatar,
  UserInfo,
  Name,
  Role,
  SwitchButton,
} from "./TopBar.styles";

const TopBar = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
const [showNotifications, setShowNotifications] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedTime = currentDateTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <>
    <Container>
      <DateBox>
        <DateSection>
          <CiCalendarDate size={20} />
          <span>{formattedDate}</span>
        </DateSection>


        <TimeSection>
          <LuSunMedium size={16} />
          <span>{formattedTime}</span>
        </TimeSection>
      </DateBox>

      <RightSection>
        <NotificationButton
          onClick={() => setShowNotifications(true)}
        >
          <FaRegBell size={25} />
          <NotificationDot />
        </NotificationButton>

        <Language>
          🇬🇧 English
          <FaChevronDown size={14} />
        </Language>

        <Profile>
          <Avatar
            src="https://i.pravatar.cc/64?img=12"
            alt="profile"
          />

          <UserInfo>
            <Name>ARUN S</Name>
            <Role>Admin</Role>
          </UserInfo>
        </Profile>

        <SwitchButton>
          <PiSwap size={15} />
          SWITCH FINANCE
        </SwitchButton>
      </RightSection>
    </Container>
     <NotificationModal
      isOpen={showNotifications}
      onClose={() => setShowNotifications(false)}
    />
    </>
  );
};

export default TopBar;