import React from "react";
import { 
  HeaderContainer, 
  LeftSection, 
  BackButton, 
  TitleContainer, 
  Icon, 
  Title, 
  Subtitle, 
  SearchBox, 
  SearchInput, 
  EmployeeImage,
  TextBlock
} from "./HolidayHeading.styles";

import { FiArrowLeft, FiSearch } from "react-icons/fi";
import HolidayIcon from "../assets/payroll.svg"; 
import EmployeeTitle from "./EmployeeTitle";

const Header = () => {
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
/>
    </HeaderContainer>
  );
};

export default Header;
