import React, { useEffect, useState, useRef } from "react";
import { FaRegBell } from "react-icons/fa6";
import { CiCalendarDate } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa";
import { PiSwap } from "react-icons/pi";
import { LuSunMedium } from "react-icons/lu";
import { FiSettings, FiLock, FiLogOut } from "react-icons/fi";

import NotificationModal from "./NotificationModal/NotificationModal";
import ChangePasswordModal from "../../ChangePasswordModal/ChangePasswordModal";

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
  ProfileDropdown,
  DropdownItem,
} from "./TopBar.styles";

const TopBar = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const [showNotifications, setShowNotifications] = useState(false);

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [showChangePassword, setShowChangePassword] =
    useState(false);

  const [companyName] = useState("Rekory");

  const companyInitial = companyName
    .charAt(0)
    .toUpperCase();

  const profileRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleChangePassword = () => {
    setShowProfileMenu(false);
    setShowChangePassword(true);
  };

  const handleConfigure = () => {
    setShowProfileMenu(false);
  };

  const handleLogout = () => {
    setShowProfileMenu(false);

    localStorage.clear();
    sessionStorage.clear();

    window.location.href = "/login";
  };

  const formattedDate =
    currentDateTime.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const formattedTime =
    currentDateTime.toLocaleTimeString("en-IN", {
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
          {/* Notification */}
          <NotificationButton
            onClick={() =>
              setShowNotifications(true)
            }
          >
            <FaRegBell size={25} />
            <NotificationDot />
          </NotificationButton>

          {/* Language */}
          <Language>
            🇬🇧 English
            <FaChevronDown size={14} />
          </Language>

          {/* Profile */}
          <Profile
            ref={profileRef}
            onClick={() =>
              setShowProfileMenu(
                (prev) => !prev
              )
            }
          >
            <Avatar>
              {companyInitial}
            </Avatar>

            <UserInfo>
              <Name>{companyName}</Name>
              <Role>Admin</Role>
            </UserInfo>

            <FaChevronDown size={12} />

            {showProfileMenu && (
              <ProfileDropdown>

                {/* Configure */}
                <DropdownItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleConfigure();
                  }}
                >
                  <FiSettings size={17} />
                  <span>Configure</span>
                </DropdownItem>

                {/* Change Password */}
                <DropdownItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChangePassword();
                  }}
                >
                  <FiLock size={17} />
                  <span>Change Password</span>
                </DropdownItem>

                {/* Logout */}
                <DropdownItem
                  logout
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                  }}
                >
                  <FiLogOut size={17} />
                  <span>Logout</span>
                </DropdownItem>

              </ProfileDropdown>
            )}
          </Profile>

          <SwitchButton>
            <PiSwap size={15} />
            SWITCH FINANCE
          </SwitchButton>
        </RightSection>
      </Container>

      {/* Notifications */}
      <NotificationModal
        isOpen={showNotifications}
        onClose={() =>
          setShowNotifications(false)
        }
      />

      {/* Change Password */}
      {showChangePassword && (
        <ChangePasswordModal
          onClose={() =>
            setShowChangePassword(false)
          }
        />
      )}
    </>
  );
};

export default TopBar;