// ReimbursementDetail.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import {
  PageWrapper,
  Header,
  HeaderLeft,
  HeaderIcon,
  HeaderTitle,
  HeaderSubtitle,
  ProfileSection,
  ProfileImage,
  ProfileInfo,
  Label,
  Value,
  Row,
  DateSection,
  DescriptionBox,
  BillsSection,
  BillsGrid,
  BillImage,
  SelectBox,
} from "./Reimb_info.Styles";
import RemiIcon from "../../assets/remi.svg";
const ReimbursementDetail = () => {
  const navigate = useNavigate();

  const bills = [
    "https://via.placeholder.com/150x200.png?text=Bill+1",
    "https://via.placeholder.com/150x200.png?text=Bill+2",
    "https://via.placeholder.com/150x200.png?text=Bill+3",
    "https://via.placeholder.com/150x200.png?text=Bill+4",
    "https://via.placeholder.com/150x200.png?text=Bill+5",
  ];

  return (
    <PageWrapper>
      {/* Header */}
      <Header>
        <HeaderLeft>
          {/* Back Arrow */}
          <HiArrowLeft
            size={22}
            style={{ cursor: "pointer", color: "#3250B5", marginRight: "10px" }}
            onClick={() => navigate(-1)} 
          />
          {/* Logo / Icon */}
         <div className="icon-box">
            <img src={RemiIcon} alt="employeeIcon" style={{ height: "60px" }} />
             </div>
          <div>
            <HeaderTitle>Reimbursement</HeaderTitle>
            <HeaderSubtitle>
              Manage all departments within the organization.
            </HeaderSubtitle>
          </div>
        </HeaderLeft>
        <SelectBox>
          <option>Select</option>
          <option>Verified</option>
          <option>Hold</option>
          <option>In Review</option>
        </SelectBox>
      </Header>

      {/* Profile */}
      <ProfileSection>
        <ProfileImage
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="profile"
        />
        <ProfileInfo>
          <Row>
            <Label>Name</Label>
            <Value>Dummy</Value>
          </Row>
          <Row>
            <Label>Position</Label>
            <Value>UI/UX Designer</Value>
          </Row>
          <Row>
            <Label>Employee ID</Label>
            <Value>EMP-1023</Value>
          </Row>
        </ProfileInfo>
      </ProfileSection>

      {/* Date */}
      <DateSection>
        <Label>Date</Label>
        <Value>12 June 2025</Value>
      </DateSection>

      {/* Description */}
        <h3>Note</h3>
      <DescriptionBox>
      
        Lorem ipsum dolor sit amet consectetur. In lectus donec sit ut. Diam arcu
        au gravida habitant accumsan nibh tellus diam eu. Pellentesque elit purus
        sed nec senectus ullamcorper sollicitudin. Et aliquet nullam dui adipiscing
        quis dui. Consequat neque senectus malesuada suscipit amet pulvinar risus
        vel dignissim. Aenean diam placerat phasellus placerat dolor sit neque
        auctor aliquam. Sollicitudin eu tristique nisl neque est fames consequat
        commodo pharetra. Fusce magna tincidunt commodo laoreet. Nunc nunc non
        ornare natoque pretium consequat eget libero.
      </DescriptionBox>

      {/* Bills */}
      <BillsSection>
        <Label>📑 Bills uploaded</Label>
        <BillsGrid>
          {bills.map((bill, idx) => (
            <BillImage key={idx} src={bill} alt={`bill-${idx}`} />
          ))}
        </BillsGrid>
      </BillsSection>
    </PageWrapper>
  );
};

export default ReimbursementDetail;
