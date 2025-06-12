// src/Components/Sidebar.jsx
import React, { useState } from 'react';
import { RiHome5Line } from "react-icons/ri";
import { FaUsers, FaSitemap, FaTasks } from "react-icons/fa";
import { MdOutlineLaptopChromebook } from "react-icons/md";
import { HiMiniArrowRightEndOnRectangle } from "react-icons/hi2";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

import {
  SidebarContainer,
  TopSection,
  Logo,
  Nav,
  BottomSection,
  LogoutButton,
  ToggleButton,
  CustomLink
} from './Sidebar.styles';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")); // Get user info from localStorage

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.error("No refresh token found.");
        return;
      }

      await axios.post(
        "http://127.0.0.1:8000/api/logout/",
        { refresh: refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  return (
    <SidebarContainer className={collapsed ? 'collapsed' : ''}>
      <TopSection>
        <ToggleButton onClick={() => setCollapsed(!collapsed)}>☰</ToggleButton>
        <Logo className={collapsed ? 'hidden' : ''}>
          <img src="/images/logo.png" alt="ARMETAL Logo" />
        </Logo>
      </TopSection>

      <Nav>
        
       

        {/* Superadmin and HR admin shared tabs */}
        {(user?.is_hr_admin) && (
          <>
           <CustomLink to="/" className={collapsed ? 'collapsed' : ''}>
          <RiHome5Line /><span>Dashboard</span>
        </CustomLink>
            <CustomLink to="/employee" className={collapsed ? 'collapsed' : ''}>
              <FaUsers /><span>Employee</span>
            </CustomLink>
            <CustomLink to="/department" className={collapsed ? 'collapsed' : ''}>
              <FaSitemap /><span>Department</span>
            </CustomLink>
            <CustomLink to="/daily-task" className={collapsed ? 'collapsed' : ''}>
              <FaTasks /><span>Daily Task</span>
            </CustomLink>
            <CustomLink to="/payroll" className={collapsed ? 'collapsed' : ''}>
              <FaTasks /><span>Payroll</span>
            </CustomLink>
            <CustomLink to="/holiday" className={collapsed ? 'collapsed' : ''}>
              <FaTasks /><span>Holiday</span>
            </CustomLink>
          </>
        )}

        {/* Only superadmin sees this */}
        {user?.is_superadmin && (
          <CustomLink to="/superadmin" className={collapsed ? 'collapsed' : ''}>
            <MdOutlineLaptopChromebook /><span>Super Admin</span>
          </CustomLink>
        )}
      </Nav>

      <BottomSection>
        <LogoutButton onClick={handleLogout}>
          <HiMiniArrowRightEndOnRectangle />
          <span>Log out</span>
        </LogoutButton>
      </BottomSection>
    </SidebarContainer>
  );
}
