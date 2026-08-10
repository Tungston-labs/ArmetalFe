import React, { useRef } from "react";
import { useLocation, NavLink } from "react-router-dom";
import {
  Container,
  TopSection,
  FormSection,
  TabsRowContainer,
  TabsRow,
  TabButton,
} from "./ViewLayout.Styles";
import EmployeeTitle from "../../../Components/Employee/Headers/EmployeeTitle";
import EmployeeIcon from "../../../assets/employeeicon.svg";
import Header from "../../../Components/Employee/Headers/Header";

const ViewBasicLayout = ({
  id,
  handleTabNavigation,
  departmentList,
  handleSubmit,
  children,
  formData,
  handleChange,
  handleImageChange,
  isIndianCompany, 
}) => {
  const location = useLocation();
  const rowRef = useRef(null);

  const tabs = [
    { path: `/ViewBasic/${id}`, label: "Basic Details" },
    { path: `/ViewBasic/${id}/bank`, label: "Bank & Payment" },
    { path: `/ViewBasic/${id}/documents`, label: "Documents" },
  ];

  return (
    <Container>
      <TopSection>
        <EmployeeTitle
          key={departmentList?.length || 0}
          iconSrc={EmployeeIcon}
          showAddButton={true}
          showTabs={false}
          showSearch={false}
          showDropdown={false}
          onAddClick={handleSubmit}
          buttonText="Save"
          showBackArrow={false}
          showReportButton={false}
        />

        <Header
          employee={formData}
          editable={true}
          onChange={handleChange}
          onImageChange={handleImageChange}
        
        />

 
        <TabsRowContainer>
          <TabsRow ref={rowRef}>
            {tabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={tab.path}
                style={{ textDecoration: "none" }}
              >
                <TabButton active={location.pathname === tab.path}>
                  {tab.label}
                </TabButton>
              </NavLink>
            ))}
          </TabsRow>
        </TabsRowContainer>
      </TopSection>

    <FormSection>{children}</FormSection>

    </Container>
  );
};

export default ViewBasicLayout;
