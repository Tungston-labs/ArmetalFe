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
import { HiUser } from "react-icons/hi2";

const EmployeeDetails = ({ employee }) => {
  const [activeTab, setActiveTab] = useState("work");
  const [isMailOpen, setIsMailOpen] = useState(false);

    const formatDate = (date) => {
  if (!date) return "-";

  const d = new Date(date);

  if (isNaN(d)) return date;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};
  if (!employee) return <p>Loading...</p>;
  const statsData = [
    { number: employee.pending_leave ?? "00", label: "Balance Leaves", icon: <PiUsersThreeLight size={22} /> },
    { number: employee.leave_taken ?? "00", label: "Leaves Taken", icon: <CiAlarmOn size={22} /> },
    { number: employee.projects?.ongoing_count ?? 0, label: "Ongoing Projects", icon: <TbReportSearch size={22} /> },
    { number: employee.projects?.completed_count ?? 0, label: "Completed Projects", icon: <LuFileCheck size={22} /> }
  ];

  const workInfo = [
    { title: "Job Title :", value: employee.designation,title2: "Username :", value2: employee.employee_id },
    { title: "Role :", value: employee.role, title2: "Salary :",value2: employee.salary },
    { title2: "Department :", value2: employee.department, title: "Joining Date :", value: formatDate(employee.joining_date) },
    {  title: "Email Id :", value: employee.email },
  ];
  const personalInfo = [
    { title: "Date Of Birth :",value: formatDate(employee.dob), title2: "Contact Number :", value2: employee.phno },
    { title: "Aadhaar Number :", value: employee.aadar_number, title2: "PAN Number :", value2: employee.pan_number },
    { title: "Account Number :", value: employee.account_number, title2: "Passport Number :", value2: employee.passport_number },
    { title: "Address :", value: employee.address, title2: "", value2: "" }
  ];

  return (
    <Wrapper>
      <HeaderRow>
        <LeftHeader>
          <h3>Profile</h3>
          <Status>
            <span
              className="dot"
              style={{
                backgroundColor: employee.is_active ? "green" : "red"
              }}></span>

            {employee.is_active ? "Active" : "Inactive"}
          </Status>

        </LeftHeader>
        <MailButton onClick={() => setIsMailOpen(true)}>Send Mail</MailButton>
      </HeaderRow>

      <TopSection>
        <ProfileLeft>
          <ProfileSection>
          <Avatar>
  {employee?.profile_pic ? (
    <img src={employee.profile_pic} alt={employee.name} />
  ) : (
    <HiUser size={55} />
  )}
</Avatar>
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
   employee={employee} 
      />
    </Wrapper>
  );
};

export default EmployeeDetails;
