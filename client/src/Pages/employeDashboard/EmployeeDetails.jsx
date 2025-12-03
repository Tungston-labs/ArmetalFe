import React, { useState } from "react";
import {
  Wrapper,
  HeaderRow,
  LeftHeader,
  Status,
  MailButton,
  TopSection,
  ProfileLeft,
  ProfileSection,
  Avatar,
  Info,
  Name,
  Role,
  RightCards,
  StatsGrid,
  StatCard,
  StatNumber,
  StatLabel,
  IconRight,
  Tabs,
  TabButton,
  ContentSection,
  InfoGrid,
  InfoRow,
  InfoTitle,
  InfoValue,
  Title
} from "./EmployeeDetails.styles";

import { PiUsersThreeLight } from "react-icons/pi";
import { CiAlarmOn } from "react-icons/ci";
import { TbReportSearch } from "react-icons/tb";
import { LuFileCheck } from "react-icons/lu";
import MailModal from "./MailModal";

const EmployeeDetails = () => {
  const [activeTab, setActiveTab] = useState("work");

  // ⭐ MODAL STATE
  const [isMailOpen, setIsMailOpen] = useState(false);

  // ⭐ Stats Data
  const statsData = [
    { number: "04", label: "Balance Leaves", icon: <PiUsersThreeLight size={22} /> },
    { number: "02", label: "Leaves Taken", icon: <CiAlarmOn size={22} /> },
    { number: "02", label: "Ongoing Projects", icon: <TbReportSearch size={22} /> },
    { number: "07", label: "Completed Projects", icon: <LuFileCheck size={22} /> }
  ];

  // ⭐ Work Info
  const workInfo = [
    { title: "Job Title :", value: "Software Developer", title2: "Salary:", value2: "10000" },
    { title: "Employee ID :", value: "TUNDEVTV", title2: "Email Id :", value2: "ajaytungstonlabs@gmail.com" },
    { title: "Department :", value: "Development", title2: "Joining Date :", value2: "17-02-2025" },
    { title: "Role :", value: "Employee", title2: "Contract VISA Expiry :", value2: "11-02-2027" }
  ];

  // ⭐ Personal Info
  const personalInfo = [
    { title: "Date Of Birth :", value: "17-02-2025", title2: "Contact Number :", value2: "9585242423263" },
    { title: "Aadhaar Number :", value: "0000000000", title2: "PAN Number :", value2: "00000000" },
    { title: "Account Number :", value: "0000000000", title2: "Passport Number :", value2: "00000000" },
    { title: "Address :", value: "oooooooooo ooooooo oooooo", title2: "", value2: "" }
  ];


  return (
    <Wrapper>
      <HeaderRow>
        <LeftHeader>
          <h3>Profile</h3>
          <Status>
            <span className="dot"></span> Active
          </Status>
        </LeftHeader>

        {/* ⭐ OPEN MODAL */}
        <MailButton onClick={() => setIsMailOpen(true)}>Send Mail</MailButton>
      </HeaderRow>

      <TopSection>
        <ProfileLeft>
          <ProfileSection>
            <Avatar />
            <Info>
              <Name>Ajay Kumar</Name>
              <Role>Software Developer</Role>
            </Info>
          </ProfileSection>
        </ProfileLeft>

        <RightCards>
          <StatsGrid>
            {statsData.map((item, index) => (
              <StatCard key={index}>
                <StatNumber>{item.number}</StatNumber>
                <StatLabel>{item.label}</StatLabel>
                <IconRight>{item.icon}</IconRight>
              </StatCard>
            ))}
          </StatsGrid>
        </RightCards>
      </TopSection>

      {/* ⭐ TABS */}
      <Tabs>
        <TabButton active={activeTab === "work"} onClick={() => setActiveTab("work")}>
          Work Info
        </TabButton>

        <TabButton active={activeTab === "personal"} onClick={() => setActiveTab("personal")}>
          Personal Details
        </TabButton>
      </Tabs>

      {/* ⭐ CONTENT */}
      <ContentSection>
        {activeTab === "work" && (
          <>
            <Title>Work Info</Title>
            <InfoGrid>
              {workInfo.map((row, index) => (
                <InfoRow key={index}>
                  <InfoTitle>{row.title}</InfoTitle>
                  <InfoValue>{row.value}</InfoValue>

                  <InfoTitle>{row.title2}</InfoTitle>
                  <InfoValue>{row.value2}</InfoValue>
                </InfoRow>
              ))}
            </InfoGrid>
          </>
        )}

        {activeTab === "personal" && (
          <>
            <Title>Personal Details</Title>
            <InfoGrid>
              {personalInfo.map((row, index) => (
                <InfoRow key={index}>
                  <InfoTitle>{row.title}</InfoTitle>
                  <InfoValue>{row.value}</InfoValue>

                  {row.title2 && (
                    <>
                      <InfoTitle>{row.title2}</InfoTitle>
                      <InfoValue>{row.value2}</InfoValue>
                    </>
                  )}
                </InfoRow>
              ))}
            </InfoGrid>
          </>
        )}
      </ContentSection>

      {/* ⭐ MAIL MODAL RENDERED HERE */}
      <MailModal
        isOpen={isMailOpen}
        onClose={() => setIsMailOpen(false)}
        employee={{ email: "ajaytungstonlabs@gmail.com" }}
      />
    </Wrapper>
  );
};

export default EmployeeDetails;
