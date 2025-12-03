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

const EmployeeDetails = ({employee}) => {
  const [activeTab, setActiveTab] = useState("work");
  const [isMailOpen, setIsMailOpen] = useState(false);
  if (!employee) return <p>Loading...</p>;
  const statsData = [
    { number: employee.pending_leave ?? "00", label: "Balance Leaves", icon: <PiUsersThreeLight size={22} /> },
    { number: employee.leave_taken ?? "00", label: "Leaves Taken", icon: <CiAlarmOn size={22} /> },
    { number: employee.projects?.length ?? 0, label: "Ongoing Projects", icon: <TbReportSearch size={22} /> },
    { number: "00", label: "Completed Projects", icon: <LuFileCheck size={22} /> }
  ];
  const workInfo = [
    { title: "Job Title :", value: employee.designation, title2: "Salary :", value2: employee.salary },
    { title: "Employee ID :", value: employee.employee_id, title2: "Email Id :", value2: employee.email },
    { title: "Department :", value: employee.department, title2: "Joining Date :", value2: employee.joining_date },
    { title: "Role :", value: employee.role, title2: "Contract Expiry :", value2: employee.contract }
  ];
  const personalInfo = [
    { title: "Date Of Birth :", value: "17-02-2025", title2: "Contact Number :", value2:employee.phno },
    { title: "Aadhaar Number :", value: "0000000000", title2: "PAN Number :", value2: "00000000" },
    { title: "Account Number :", value: "0000000000", title2: "Passport Number :", value2: "00000000" },
    { title: "Address :", value: employee.address, title2: "", value2: "" }
  ];

  // Personal info
  const personalInfo = [
    { title: "Date Of Birth :", value: "-", title2: "Contact Number :", value2: employee.phno },
    { title: "Address :", value: employee.address, title2: "", value2: "" }
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
        <MailButton onClick={() => setIsMailOpen(true)}>Send Mail</MailButton>
      </HeaderRow>

      <TopSection>
        <ProfileLeft>
          <ProfileSection>
             <Avatar style={{ backgroundImage: `url(${employee.profile_pic})` }} />
            <Info>
              <Name>{employee.name}</Name>
              <Role>{employee.designation}</Role>
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
      <Tabs>
        <TabButton active={activeTab === "work"} onClick={() => setActiveTab("work")}>
          Work Info
        </TabButton>

        <TabButton active={activeTab === "personal"} onClick={() => setActiveTab("personal")}>
          Personal Details
        </TabButton>
      </Tabs>
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
      <MailModal
        isOpen={isMailOpen}
        onClose={() => setIsMailOpen(false)}
        employee={{ email: "ajaytungstonlabs@gmail.com" }}
      />
    </Wrapper>
  );
};

export default EmployeeDetails;
