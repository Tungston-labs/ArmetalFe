import React, { useState } from "react";
import {
  Container,
  TopSection,
  LeftBlock,
  IconWrapper,
  TitleBlock,
  Title,
  Subtitle,
  RightBlock,
  Button,
  SearchSection,
  SearchWrapper,
  Input,
  Dropdown,
  TabsRow,
  TabButton,
  Divider,
  BackArrow, // ✅ added styled back arrow
} from "./EmployeeTitle.Styles";
import { LuCirclePlus } from "react-icons/lu";
import { IoArrowBackOutline } from "react-icons/io5"; // ✅ back arrow icon
import { useNavigate, useLocation, NavLink } from "react-router-dom";

const EmployeeTitle = ({
  showIcon = true,
  showTitle = true,
  showSubtitle = true,
  showAddButton = true,
  showSearch = true,
  showDropdown = true,
  showTabs = true,
  showBackArrow = true, // ✅ new prop to control back arrow

  iconSrc,
  title = "Employee",
  subtitle = "Manage your employees",
  buttonText = "Add Employee",
  tabs = [
    { path: "/employee", label: "Total Employee" },
    { path: "/employee-leave-request", label: "Employee Leave Request" },
    { path: "/employee-attendance", label: "Employee Attendance" },
    { path: "/employee-Contract-Visa-Expiry", label: "Employee Contract & Visa Expiry" },
    { path: "/employee-on-leave", label: "Employees on Leave" },
  ],

  dropdownOptions = [],
  dropdownLoading = false,

  onAddClick,
  onSearchChange,
  onDropdownChange,
  onTabChange,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(tabs[0]?.path || "");

  const handleTabClick = (path) => {
    setActiveTab(path);
    onTabChange && onTabChange(path);
    navigate(path);
  };

  return (
    <Container>
      <TopSection>
        <LeftBlock>
          {/* ✅ Back Arrow */}
          {showBackArrow && (
            <BackArrow onClick={() => navigate(-1)}>
              <IoArrowBackOutline size={22} />
            </BackArrow>
          )}

          {showIcon && iconSrc && (
            <IconWrapper>
              <img src={iconSrc} alt="icon" />
            </IconWrapper>
          )}

          <TitleBlock>
            {showTitle && <Title>{title}</Title>}
            {showSubtitle && <Subtitle>{subtitle}</Subtitle>}
          </TitleBlock>
        </LeftBlock>

        {showAddButton && (
          <RightBlock>
            <Button onClick={onAddClick || (() => navigate("/basic-details"))}>
              <LuCirclePlus size={18} />
              {buttonText}
            </Button>
          </RightBlock>
        )}
      </TopSection>

      {(showSearch || showDropdown) && (
        <SearchSection>
          {showSearch && (
            <SearchWrapper>
              <Input
                placeholder="Search by name or ID"
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              />
            </SearchWrapper>
          )}
          {showDropdown && (
            <Dropdown onChange={(e) => onDropdownChange && onDropdownChange(e.target.value)}>
              <option value="">All Departments</option>
              {dropdownLoading ? (
                <option>Loading...</option>
              ) : dropdownOptions.length > 0 ? (
                dropdownOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))
              ) : (
                <option>No departments found</option>
              )}
            </Dropdown>
          )}
        </SearchSection>
      )}

      {showTabs && (
        <>
          <TabsRow>
            {tabs.map((tab) => (
              <NavLink key={tab.path} to={tab.path} style={{ textDecoration: "none" }}>
                <TabButton active={location.pathname === tab.path}>
                  {tab.label}
                </TabButton>
              </NavLink>
            ))}
          </TabsRow>
          <Divider />
        </>
      )}
    </Container>
  );
};

export default EmployeeTitle;
