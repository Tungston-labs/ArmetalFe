// src/Components/Sidebar.jsx
import React, { useState } from 'react';
import { RiHome5Line } from "react-icons/ri";
import { FaUsers, FaSitemap, FaTasks } from "react-icons/fa";
import { MdOutlineLaptopChromebook } from "react-icons/md";
import { HiMiniArrowRightEndOnRectangle } from "react-icons/hi2";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
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
  
      // Clear stored tokens and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
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
        <CustomLink to="/" className={collapsed ? 'collapsed' : ''}>
          <RiHome5Line /><span>Dashboard</span>
        </CustomLink>
        <CustomLink to="/employee" className={collapsed ? 'collapsed' : ''}>
          <FaUsers /><span>Employee</span>
        </CustomLink>
        <CustomLink to="/department" className={collapsed ? 'collapsed' : ''}>
          <FaSitemap /><span>Department</span>
        </CustomLink>
        <CustomLink to="/dailytask" className={collapsed ? 'collapsed' : ''}>
          <FaTasks /><span>Daily Task</span>
        </CustomLink>
        <CustomLink to="/payroll" className={collapsed ? 'collapsed' : ''}>
          <FaTasks /><span>Payroll</span>
        </CustomLink>
        <CustomLink to="/holiday" className={collapsed ? 'collapsed' : ''}>
          <FaTasks /><span>Holiday</span>
        </CustomLink>
        <CustomLink to="/superadmin" className={collapsed ? 'collapsed' : ''}>
          <MdOutlineLaptopChromebook /><span>Super Admin</span>
        </CustomLink>
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
