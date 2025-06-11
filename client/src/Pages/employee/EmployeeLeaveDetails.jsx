import React from "react";
import {
  Container,
  Breadcrumb,
  InfoGrid,
  ProfileImage,
  TwoColumn,
  ThreeColumn,
  Input,
  SectionTitle,
  TextArea,
  FlexRow,
  // ActionButton,
  ApproveButton,
  DeclineButton,
  TopBar,
  HRManager,
  TitleSection,
  Title,
  Subtitle,
  Hr,
  InfoSection,
  FullWidthInput,
  TwoColumnRow,
TwoColumnRows
} from "./EmployeeLeaveDeails.Styles";

const EmployeeLeaveForm = () => {
  return (
    <Container>
      <TopBar>
        <div />
        <HRManager>
          <img src="https://i.pravatar.cc/40?img=5" alt="HR Manager" />
          <span>HR Manager</span>
        </HRManager>
      </TopBar>

      <TitleSection>

        <img src="/images/employee.png" alt=" Icon" style={{ height: "50px" }} />
        <div>
          <Title>Employee</Title>
          <Subtitle>Manage your Employee.</Subtitle>
        </div>
      </TitleSection>

      <Hr />
      <Breadcrumb>
        Employee &gt; Leave request &gt; Employee leave details
      </Breadcrumb>

      <InfoGrid>
        <div style={{width:"10%"}}>
          <ProfileImage src="https://i.pravatar.cc/100?img=5" alt="Employee" />
        </div>
        <div style={{display:"flex", width:"90%",justifyContent:"space-between"}}>
          <TwoColumn>
            <Input placeholder="Name" />
            <Input placeholder="Employee ID" />
            <Input placeholder="Email ID" />
          </TwoColumn>

          <InfoSection>
            <FullWidthInput placeholder="Address" />
            <TwoColumnRow>
              <Input placeholder="DOB" />
              <Input placeholder="Gender" />
            </TwoColumnRow>
          </InfoSection>
          {/* <TwoColumn>
             <Input placeholder="Address" />
            
          </TwoColumn> */}
          {/* <ThreeColumn>
   
            <Input placeholder="DOB" />
            <Input placeholder="Gender" />
          </ThreeColumn> */}
        </div>
      </InfoGrid>
<Hr />
      <SectionTitle>Job Details</SectionTitle>
      <TwoColumnRows>
        <Input placeholder="Job position / Designation" />
        <Input placeholder="Employment Type (Full-Time, Part-Time, Contract)" />
      </TwoColumnRows>
      <TwoColumnRows>
        <Input placeholder="Department" />
        <Input placeholder="Joining Date" />
      </TwoColumnRows>

      <SectionTitle>Leave Application</SectionTitle>
      <Input placeholder="Leave Type" value="Sick leave" />

      <SectionTitle>Reason for Leave</SectionTitle>
      <TextArea defaultValue="I am requesting leave due to health reasons and will be unable to attend work on the mentioned dates. Kindly consider my application and grant the leave." />

      <FlexRow>
        <DeclineButton>Decline</DeclineButton>
        <ApproveButton>Approve</ApproveButton>
      </FlexRow>
    </Container>
  );
};

export default EmployeeLeaveForm;
