import React from "react";
import {
  Container,
  Header,
  LeftSection,
  RightSection,
  Avatar,
  Column,
  Textarea,
  EditButton,
  Row,
    Tabs,
  Tab,
  Section,
  GroupLabel,
  Rows,
  Input,
  Select,
  Button,
  Rowes,
  Title,
  Subtitle,Rightside,
  HeaderWrapper,TextGroup,HRManager
} from "./ViewBasic.Style";
import { HiOutlinePencilAlt } from "react-icons/hi";
const AddEmployee = () => {
  return (
    <Container>
      <Header>
        <HeaderWrapper>
  <img src="/images/employee.png" alt="Icon" style={{ height: "50px" }} />
  <TextGroup>
      
    <Title>Employee</Title>
    <Subtitle>Manage your Employee.</Subtitle>
  </TextGroup>
</HeaderWrapper>
<Rightside>
 <HRManager>
          <img src="https://i.pravatar.cc/40?img=5" alt="HR Manager" />
          <span>HR Manager</span>
        </HRManager>
      
        <EditButton><HiOutlinePencilAlt />Edit</EditButton>
        </Rightside>
      </Header>

      <h3>Add Employee</h3>

      <Row>
        <LeftSection>
            <div>
          {/* <Avatar src="https://i.imgur.com/QCNbOAo.png" alt="profile" /> */}
          </div>
          <Input type="text" placeholder="Ajay kumar" />
          <Input type="text" placeholder="254125" />
          <Input type="email" placeholder="Ajaykumar@gmail.com" />
        </LeftSection>

        <RightSection>
          <Textarea placeholder="Ajaykumar dummy dummy dummy 1231 dummy" />
          <Rows style={{ marginTop: "1rem" }}>
            <Input type="text" placeholder="12/12/1980" />
            <Input type="text" placeholder="Male" />
          </Rows>
        </RightSection>
      </Row>
          <Section>
      <Tabs>
        <Tab active>Basic Details</Tab>
        <Tab>Bank and payment details</Tab>
        <Tab>Documents</Tab>
      </Tabs>

      <GroupLabel>Job Details</GroupLabel>
  <Rowes>
  <Input placeholder="Developer" />
  <Input placeholder="21/12/2002" />
</Rowes>

<Rowes>
  <Select>
    <option value="">Department</option>
    <option value="dev">Development</option>
  </Select>
  <Input placeholder="Full time" />
</Rowes>

<Rowes>
  <Input placeholder="Pranav G" />
  <Select>
    <option value="Development">Development</option>
  </Select>
</Rowes>


      <GroupLabel>Employee Legal & ID Information</GroupLabel>
   <Column>
  <Input placeholder="Passport number" />
  <Input placeholder="Work Permit" />
  <Input placeholder="Visa expiry Date" />
  <Input placeholder="Iqama Number" />
  <Input placeholder="Employment Contract" />

  <Input placeholder="Insurance number" />
</Column>

      <Button>Next</Button>
    </Section>


    </Container>
  );
};

export default AddEmployee;
