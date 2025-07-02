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
  Logo,
  Nav,
  BottomSection,
  LogoutButton,
  ToggleButton,
  CustomLink,TopSection,
  ChangePasswordLink
} from './Sidebar.styles';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const modules = user?.company_modules || {};

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) return;

      await axios.post(
        "http://178.248.112.16:8000/api/logout/",
        { refresh: refreshToken },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post(
        "http://localhost:8000/api/change-password/",
        { old_password: oldPassword, new_password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Password changed successfully");
      setTimeout(() => {
        setShowChangeModal(false);
        setOldPassword('');
        setNewPassword('');
        setMessage('');
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Password change failed.");
    }
  };

  return (
    <>
      <SidebarContainer className={collapsed ? 'collapsed' : ''}>
        {/* Top */}
        <TopSection>
          <ToggleButton onClick={() => setCollapsed(!collapsed)}>☰</ToggleButton>
          <Logo className={collapsed ? 'hidden' : ''}>
            <img src="/images/logo.png" alt="ARMETAL Logo" />
          </Logo>
        </TopSection>

        {/* Navigation */}
        <Nav>
          {user?.is_superadmin && (
            <CustomLink to="/superadmin" className={collapsed ? 'collapsed' : ''}>
              <MdOutlineLaptopChromebook />
              <span>Super Admin</span>
            </CustomLink>
          )}
          {user?.is_hr_admin && user?.company_modules && (
            <>
              {modules.dashboard && (
                <CustomLink to="/" className={collapsed ? 'collapsed' : ''}>
                  <RiHome5Line /><span>Dashboard</span>
                </CustomLink>
              )}
              {modules.employee && (
                <CustomLink to="/employee" className={collapsed ? 'collapsed' : ''}>
                  <FaUsers /><span>Employee</span>
                </CustomLink>
              )}
              {modules.department && (
                <CustomLink to="/department" className={collapsed ? 'collapsed' : ''}>
                  <FaSitemap /><span>Department</span>
                </CustomLink>
              )}
              {modules.daily_task && (
                <CustomLink to="/daily-task" className={collapsed ? 'collapsed' : ''}>
                  <FaTasks /><span>Daily Task</span>
                </CustomLink>
              )}
              {modules.payroll && (
                <CustomLink to="/payrolldetails" className={collapsed ? 'collapsed' : ''}>
                  <FaTasks /><span>Payroll</span>
                </CustomLink>
              )}
              {modules.holiday && (
                <CustomLink to="/holiday" className={collapsed ? 'collapsed' : ''}>
                  <FaTasks /><span>Holiday</span>
                </CustomLink>
              )}
            </>
          )}
        </Nav>

        {/* Bottom Section */}
        <BottomSection>
          <LogoutButton>
            <HiMiniArrowRightEndOnRectangle style={{ marginRight: "30px" }} onClick={handleLogout} />
            {!collapsed && (
              <ChangePasswordLink as="button" onClick={() => setShowChangeModal(true)}>
                Change Password
              </ChangePasswordLink>
            )}
          </LogoutButton>
        </BottomSection>
      </SidebarContainer>

      {/* Modal */}
      {showChangeModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'white', padding: '30px', borderRadius: '10px',
            width: '400px', boxShadow: '0 2px 10px rgba(0,0,0,0.3)', position: 'relative'
          }}>
            <button onClick={() => setShowChangeModal(false)} style={{
              position: 'absolute', top: '10px', right: '10px',
              border: 'none', background: 'transparent', fontSize: '18px', cursor: 'pointer'
            }}>✖</button>

            <h2>Change Password</h2>
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', marginTop: '15px', borderRadius: '5px' }}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', marginTop: '15px', borderRadius: '5px' }}
            />
            <button onClick={handlePasswordChange} style={{
              width: '100%', marginTop: '20px', padding: '10px',
              backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '5px'
            }}>
              Change Password
            </button>
            {message && <p style={{ marginTop: '10px', color: 'green' }}>{message}</p>}
          </div>
        </div>
      )}
    </>
  );
}
