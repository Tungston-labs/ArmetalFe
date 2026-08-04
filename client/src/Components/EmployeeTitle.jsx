import React, { useRef } from "react";
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
  ReportButton,
} from "./EmployeeTitle.Styles";
import { LuCirclePlus } from "react-icons/lu";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { FiBarChart2, FiSearch } from "react-icons/fi";

const EmployeeTitle = ({
  showIcon = true,
  showTitle = true,
  showSubtitle = true,
  showAddButton = true,
  showSearch = true,
  showDropdown = true,
  showTabs = true,
  showBackArrow = true,
  buttonIcon,
  rightElement,
  iconSrc,
  title = "Employee",
  subtitle = "Manage your employees",
  buttonText = "Add Employee",
  searchPlaceholder = "Search Here...",
  searchValue = "",
  showReportButton = true,
  reportButtonText = "Reports",
  onReportClick,

  tabs = [
    { path: "/employee", label: "Total Employee" },
    { path: "/employee-leave-request", label: "Employee Leave Request" },
    { path: "/employee-attendance", label: "Employee Attendance" },
    {
      path: "/employee-Contract-Visa-Expiry",
      label: "Employee Contract & Visa Expiry",
    },
    {
      path: "/employee-attendance-report",
      label: "Employee Attendance Report",
    },
    //  { path: "/request", label: "Employee Attendance Request" },
  ],

  dropdownOptions = [],
  dropdownLoading = false,
  selectedDropdownValue = "",
  dropdownPlaceholder = "All",
  onDropdownChange,
  onAddClick,
  onSearchChange,
  onTabChange,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const rowRef = useRef(null);

  const checkScroll = () => {
    const el = rowRef.current;
    if (!el) return;
  };

  const renderOption = (option, index) => {
    if (typeof option === "string" || typeof option === "number") {
      return (
        <option key={index} value={String(option)}>
          {String(option)}
        </option>
      );
    }
    const value = option.id ?? option.key ?? option.value ?? option._id ?? "";
    const label =
      option.name ??
      option.label ??
      option.text ??
      option.title ??
      String(value);
    const key = value || index;

    return (
      <option key={key} value={String(value)}>
        {label}
      </option>
    );
  };

  let dropdownContent;

  if (dropdownLoading) {
    dropdownContent = <option disabled>Loading...</option>;
  } else if (dropdownOptions && dropdownOptions.length > 0) {
    dropdownContent = dropdownOptions.map((opt, idx) => renderOption(opt, idx));
  } else {
    dropdownContent = <option disabled>No options available</option>;
  }

  return (
    <Container>
      <TopSection>
        <LeftBlock>
          {showBackArrow && (
            <BackArrow data-testid="back-arrow" onClick={() => navigate(-1)}>
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

        {(showAddButton || showReportButton) && (
          <RightBlock>
            {showAddButton && (
              <>
                {rightElement ? (
                  rightElement
                ) : (
                  <Button
                    onClick={onAddClick || (() => navigate("/basic-details"))}
                  >
                    {buttonIcon ? (
                      <img
                        src={buttonIcon}
                        alt={`${buttonText} icon`}
                        style={{
                          width: "18px",
                          height: "18px",
                          marginRight: "6px",
                        }}
                      />
                    ) : (
                      <LuCirclePlus size={18} style={{ marginRight: "6px" }} />
                    )}

                    {buttonText}
                  </Button>
                )}
              </>
            )}

            {showReportButton && (
              <ReportButton onClick={() => onReportClick?.("excel")}>
                <FiBarChart2 size={18} />
                Export Excel
              </ReportButton>
            )}
          </RightBlock>
        )}
      </TopSection>

      {(showSearch || showDropdown) && (
        <SearchSection>
          {showSearch && (
            <SearchWrapper>
              <FiSearch />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) =>
                  onSearchChange && onSearchChange(e.target.value)
                }
              />
            </SearchWrapper>
          )}

          {showDropdown && (
            <Dropdown
              value={String(selectedDropdownValue ?? "")}
              onChange={(e) =>
                onDropdownChange && onDropdownChange(String(e.target.value))
              }
            >
              <option value="">{dropdownPlaceholder}</option>
              {dropdownContent}
            </Dropdown>
          )}
        </SearchSection>
      )}

      {showTabs && (
        <>
          <TabsRowContainer>
            <TabsRow ref={rowRef} onScroll={checkScroll}>
              {tabs.map((tab) => (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  style={{ textDecoration: "none" }}
                >
                  <TabButton $active={location.pathname === tab.path}>
                    {tab.label}
                  </TabButton>
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
