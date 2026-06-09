import React from "react";
import { 
  HeaderContainer, 
} from "./HolidayHeading.styles";
import HolidayIcon from "../assets/payroll.svg"; 
import EmployeeTitle from "./EmployeeTitle";


const Header = ({ onReportClick }) => {
  return (
    <HeaderContainer>
      {/* Left Section */}       

      <EmployeeTitle
  iconSrc={HolidayIcon}
  title="Holiday"
  subtitle="Unifying Teams Simplifying Operations"
  // buttonText="Add Department"
  // searchValue={search}
  // onSearchChange={setSearch}
  // onAddClick={() => setShowModal(true)} 
  showDropdown={false}
  showBackArrow={false}
  showTabs={false}
  showAddButton={false}
  showSearch={false}
  showReportButton={true}
    onReportClick={onReportClick} 
/>
    </HeaderContainer>
  );
};

export default Header;
