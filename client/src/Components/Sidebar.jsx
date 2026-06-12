import React, { useState, useEffect } from 'react';
import { RiHome5Line } from "react-icons/ri";
import { FaUsers, FaSitemap, FaTasks } from "react-icons/fa";
import { MdOutlineLaptopChromebook } from "react-icons/md";
import { BsFillBuildingsFill } from "react-icons/bs";
import { FaMoneyCheckAlt, FaUmbrellaBeach, FaReceipt } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MdContentPasteSearch } from "react-icons/md";
import {
  SidebarContainer,
  Logo,
  Nav,
  ToggleButton,
  CustomLink,
  TopSection,
  LinkIcon,
  BottomText,
  SubMenuLink,
  SubMenu,
} from './Sidebar.styles';
import API from '../services/api';
import { NavLink } from "react-router-dom";
import { TfiFiles } from "react-icons/tfi";
import { FaAngleRight,FaAngleUp } from "react-icons/fa6";
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const reduxUser = useSelector((state) => state.auth.user);
const [reportOpen, setReportOpen] = useState(false);
  const storedUser = useSelector((state) => state.auth.user);
  const user = reduxUser || storedUser;
  const modules = user?.company_modules || {};

  useEffect(() => {
  }, [user]);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return;

      await API.post("/logout/", { refresh: refreshToken });

      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    } catch (error) {
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
          <CustomLink as={NavLink} to="/superadmin-dashboard" className={`${collapsed ? 'collapsed' : ''} ${isActive("/superadmin-dashboard")}`}>
            <MdOutlineLaptopChromebook />
            <span>Dashboard</span>
          </CustomLink>

        )}
        {user?.is_superadmin && (
          <CustomLink
            as={NavLink}
            to="/superadmin"
            className={({ isActive }) => `${collapsed ? 'collapsed' : ''} ${isActive ? 'active' : ''}`}
          >
            <BsFillBuildingsFill />
            <span>Companys</span>
          </CustomLink>

        )}
        {user?.is_superadmin && (
          <CustomLink
            as={NavLink}
            to="/finance"
            className={({ isActive }) => `${collapsed ? 'collapsed' : ''} ${isActive ? 'active' : ''}`}
          >
            <FaReceipt />
            <span>Finance</span>
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
             {modules.finance && (
              <CustomLink to="/finance" className={`${collapsed ? 'collapsed' : ''} ${isActive("/finance")}`}>
                <FaReceipt /><span>Finance</span>
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

            {modules.project && (
              <CustomLink
                to="/project"
                className={`${collapsed ? "collapsed" : ""} ${isActive("/project")}`}
              >
                   <MdContentPasteSearch />
                <span>Project</span>
              </CustomLink>
            )}
{modules.project && (
  <>
    <CustomLink
      as="div"
      onClick={() => setReportOpen(!reportOpen)}
      className={`${collapsed ? "collapsed" : ""}`}
      style={{ cursor: "pointer" }}
    >
      <TfiFiles />
      <span>Report</span>

      {!collapsed &&
        (reportOpen ? <FaAngleUp /> : <FaAngleRight />)}
    </CustomLink>

    {reportOpen && !collapsed && (
      <SubMenu>
        <SubMenuLink
          to="/reports/attendance"
          className={isActive("/reports/attendance")}
        >
          Attendance Report
        </SubMenuLink>

        <SubMenuLink
          to="/reports/leave"
          className={isActive("/reports/leave-request")}
        >
          Leave Report
        </SubMenuLink>
      </SubMenu>
    )}
  </>
)}       </>
        )}
      
      </Nav>

<BottomText className={collapsed ? "collapsed" : ""}>
  Powered by <span>REKORY</span>
</BottomText>
    </SidebarContainer>
  );
}
