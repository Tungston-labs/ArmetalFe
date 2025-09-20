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

const Header = () => {
  return (
    <HeaderContainer>
      {/* Left Section */}       
        <TitleContainer>
           <EmployeeImage  src={HolidayIcon} alt="employeeIcon" />
            <TextBlock>
              <Title>Holiday</Title>
              <Subtitle>Unifying Teams. Simplifying Operations.</Subtitle>
            </TextBlock>
        </TitleContainer>
    </HeaderContainer>
  );
};

export default Header;
