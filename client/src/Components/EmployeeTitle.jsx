import React, { useState ,useRef} from "react";
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
  BackArrow,
  TabsRowContainer,
  ScrollLeft,
  ScrollRight,
} from "./EmployeeTitle.Styles";
import { LuCirclePlus } from "react-icons/lu";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { FaChevronLeft,FaChevronRight } from "react-icons/fa";

const EmployeeTitle = ({
  showIcon = true,
  showTitle = true,
  showSubtitle = true,
  showAddButton = true,
  showSearch = true,
  showDropdown = true,
  showTabs = true,
  showBackArrow = true, 
  buttonIcon ,
  rightElement,
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
  const rowRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const handleTabClick = (path) => {
    setActiveTab(path);
    onTabChange && onTabChange(path);
    navigate(path);
  };
  const checkScroll = () => {
    const el = rowRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  const scrollLeft = () => {
    rowRef.current.scrollBy({ left: -150, behavior: "smooth" });
    setTimeout(checkScroll, 100);
  };

  const scrollRight = () => {
    rowRef.current.scrollBy({ left: 150, behavior: "smooth" });
    setTimeout(checkScroll, 100);
  };
  return (
    <Container>
      <TopSection>
        <LeftBlock>

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
    {rightElement ? (
      rightElement
    ) : (
      <Button onClick={onAddClick || (() => navigate("/basic-details"))}>
        {buttonIcon ? (
          <img
            src={buttonIcon}
            alt={`${buttonText} icon`}
            style={{ width: "18px", height: "18px", marginRight: "6px" }}
          />
        ) : (
          <LuCirclePlus size={18} style={{ marginRight: "6px" }} />
        )}
        {buttonText}
      </Button>
    )}
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
          <TabsRowContainer>
  <TabsRow ref={rowRef} onScroll={checkScroll}>
    {tabs.map((tab) => (
      <NavLink key={tab.path} to={tab.path} style={{ textDecoration: "none" }}>
        <TabButton active={location.pathname === tab.path}>{tab.label}</TabButton>
      </NavLink>
    ))}
  </TabsRow>
</TabsRowContainer>

          <Divider />
        </>
      )}
    </Container>
  );
};

export default EmployeeTitle;
