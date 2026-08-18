import React from "react";
import { 
  HeaderContainer, 
} from "./HolidayHeading.styles";
import HolidayIcon from "../assets/payroll.svg"; 
import EmployeeTitle from "./EmployeeTitle";

const Header = ({ onReportClick }) => {
  return (
    <HeaderContainer>
      <EmployeeTitle
  iconSrc={HolidayIcon}
  title="Holiday"
  subtitle="Unifying Teams Simplifying Operations"
  showDropdown={false}
  showBackArrow={false}
  showTabs={false}
  showAddButton={false}
  showSearch={false}
  showReportButton={false}
    onReportClick={onReportClick} 
/>
    </HeaderContainer>
  );
};
export default Header;
