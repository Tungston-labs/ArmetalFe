import React, { useState } from 'react';
import { RiHome5Line } from "react-icons/ri";
import { FaUsers, FaSitemap, FaTasks } from "react-icons/fa";
import { MdOutlineLaptopChromebook } from "react-icons/md";
import { FaMoneyCheckAlt, FaUmbrellaBeach, FaReceipt } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  SidebarContainer,
  Logo,
  Nav,
  ToggleButton,
  CustomLink,
  TopSection,
} from './Sidebar.styles';
import API from '../services/api';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ First try Redux, fallback to localStorage
  const reduxUser = useSelector((state) => state.auth.user);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const user = reduxUser || storedUser; 
  const modules = user?.company_modules || {};

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return;

      await API.post("/logout/", { refresh: refreshToken });

      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/" ? "active" : "";
    return location.pathname.startsWith(path) ? "active" : "";
  };

  if (!user) return null;

  return (
    <SidebarContainer className={collapsed ? 'collapsed' : ''}>
      <TopSection>
        <ToggleButton onClick={() => setCollapsed(!collapsed)}>☰</ToggleButton>
        <Logo className={collapsed ? 'hidden' : ''}>
          {user?.company?.logo ? (
            <img src={user.company.logo} alt="Company Logo" />
          ) : (
            <img src="/images/logos.png" alt="Default Logo" className="default-logo" />
          )}
        </Logo>
      </TopSection>

      <Nav>
        {user?.is_superadmin && (
          <CustomLink to="/superadmin" className={`${collapsed ? 'collapsed' : ''} ${isActive("/superadmin")}`}>
            <MdOutlineLaptopChromebook />
            <span>Super Admin</span>
          </CustomLink>
        )}

        {(user?.is_hr_admin || user?.is_hr) && Object.keys(modules).length > 0 && (
          <>
            {modules.dashboard && (
              <CustomLink to="/" className={`${collapsed ? 'collapsed' : ''} ${isActive("/")}`}>
                <RiHome5Line /><span>Dashboard</span>
              </CustomLink>
            )}
            {modules.employee && (
              <CustomLink to="/employee" className={`${collapsed ? 'collapsed' : ''} ${isActive("/employee")}`}>
                <FaUsers /><span>Employee</span>
              </CustomLink>
            )}
            {modules.department && (
              <CustomLink to="/department" className={`${collapsed ? 'collapsed' : ''} ${isActive("/department")}`}>
                <FaSitemap /><span>Department</span>
              </CustomLink>
            )}
            {modules.daily_task && (
              <CustomLink to="/daily-task" className={`${collapsed ? 'collapsed' : ''} ${isActive("/daily-task")}`}>
                <FaTasks /><span>Daily Task</span>
              </CustomLink>
            )}
            {modules.payroll && (
              <CustomLink to="/payrolldetails" className={`${collapsed ? 'collapsed' : ''} ${isActive("/payrolldetails")}`}>
                <FaMoneyCheckAlt /><span>Payroll</span>
              </CustomLink>
            )}
            {modules.holiday && (
              <CustomLink to="/holiday" className={`${collapsed ? 'collapsed' : ''} ${isActive("/holiday")}`}>
                <FaUmbrellaBeach /><span>Holiday</span>
              </CustomLink>
            )}
            {modules.reimbursement && (
              <CustomLink to="/reimbursement" className={`${collapsed ? 'collapsed' : ''} ${isActive("/reimbursement")}`}>
                <FaReceipt /><span>Reimbursement</span>
              </CustomLink>
            )}
          </>
        )}
      </Nav>
    </SidebarContainer>
  );
}
