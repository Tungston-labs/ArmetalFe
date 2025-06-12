import React from "react";
import {
  Container,
  Header,
  LeftSection,
  RightSection,
UploadSection,
InlineUploadRow,
  Textarea,
  EditButton,
  Row,ImageBox,
    Tabs,LabelRow,
  Tab,SectionTitle,
  Section,
  GroupLabel,ButtonGroup,
  Rows,ImagePreviewRow,
  Input,UploadButton,
  Select,Hr,
  Button,ProfileImage,
  Rowes,ImageColumn,
  Title,FormWrapper,
  Subtitle,Rightside,
  HeaderWrapper,TextGroup,HRManager
} from "./ViewDocument.Styles";
import { LuCirclePlus } from "react-icons/lu";
import { IoImageOutline } from "react-icons/io5";
import { HiOutlinePencilAlt } from "react-icons/hi";
import Tables from "../../Components/Table";
const AddEmployee = () => {
  return (
    <Container>
      <Header>
        <HeaderWrapper>
               <div style={{width:"10%"}}>
  <img src="/images/employee.png" alt="Icon" style={{ height: "50px" }} />
  </div>
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
<Hr/>
      <h3>Add Employee</h3>

    <FormWrapper>
  <ImageColumn>
    <ProfileImage src="https://i.pravatar.cc/100?img=5" alt="Profile" />
  </ImageColumn>

  <Row>
    <LeftSection>
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
</FormWrapper>
<Hr/>
          <Section>
      <Tabs>
        <Tab active>Basic Details</Tab>
        <Tab>Bank and payment details</Tab>
        <Tab>Documents</Tab>
      </Tabs>


      <SectionTitle>Documents</SectionTitle>

   {["Passport", "Work Permit", "Employement Contract",  "Insurance "].map((label, idx) => (
  <UploadSection key={idx}>
    <LabelRow>{label}</LabelRow>
    <InlineUploadRow>
      <UploadButton><LuCirclePlus /> Upload images</UploadButton>
      <ImagePreviewRow>
     <ImageBox>    <img src="/images/pic.jpg" alt="Preview 1" /></ImageBox>
         <ImageBox>    <img src="/images/pic.jpg" alt="Preview 1" /></ImageBox>
      </ImagePreviewRow>
    </InlineUploadRow>
  </UploadSection>
))}


      <SectionTitle>Certificate</SectionTitle>
  <UploadSection>
  <LabelRow>Upload certificate</LabelRow>
  <InlineUploadRow>
    <UploadButton> Upload images</UploadButton>
   <ImagePreviewRow>
  <ImageBox>
    <img src="/images/pic.jpg" alt="Preview 1" />
  </ImageBox>
  <ImageBox>
    <img src="/images/pic.jpg" alt="Preview 2" />
  </ImageBox>
</ImagePreviewRow>

  </InlineUploadRow>
</UploadSection>


      <ButtonGroup>
        <Button secondary>Previous step</Button>
        <Button>Submit</Button>
      </ButtonGroup>


    </Section>


    </Container>
  );
};

export default AddEmployee;
