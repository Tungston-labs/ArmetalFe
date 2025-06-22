import React, { useEffect } from "react";
import {
  Container, Header, LeftSection, RightSection, UploadSection,
  InlineUploadRow, Textarea, EditButton, Row, ImageBox, Tabs,
  LabelRow, Tab, SectionTitle, Section, ButtonGroup, Rows,
  ImagePreviewRow, Input, UploadButton, Select, Hr, Button,
  ProfileImage, Rowes, ImageColumn, Title, FormWrapper,
  Subtitle, Rightside, HeaderWrapper, TextGroup, HRManager
} from "./ViewDocument.Styles";

import { LuCirclePlus } from "react-icons/lu";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { NavLink, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeDocumentsThunk } from "../../Redux/employeeSlice";

const ViewDocument = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { employeeDetail } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(getEmployeeDocumentsThunk(id));
  }, [id, dispatch]);

  const renderImageList = (label, images = []) => (
    <UploadSection>
      <LabelRow>{label}</LabelRow>
      <InlineUploadRow>
        <UploadButton disabled><LuCirclePlus /> Uploaded Images</UploadButton>
        <ImagePreviewRow>
          {images.length > 0 ? (
            images.map((url, idx) => (
              <ImageBox key={idx}><img src={url} alt={`${label} ${idx + 1}`} /></ImageBox>
            ))
          ) : (
            <p style={{ marginLeft: "1rem", color: "#aaa" }}>No image uploaded</p>
          )}
        </ImagePreviewRow>
      </InlineUploadRow>
    </UploadSection>
  );

  return (
    <Container>
      <Header>
        <HeaderWrapper>
          <div style={{ width: "10%" }}>
            <img src="/images/employee.png" alt="Icon" style={{ height: "50px" }} />
          </div>
          <TextGroup>
            <Title>Employee</Title>
            <Subtitle>Manage your Employee.</Subtitle>
          </TextGroup>
        </HeaderWrapper>

        <Rightside>
          <HRManager>
            <img src="/images/user.jpg" alt="HR Manager" />
            <span>HR Manager</span>
          </HRManager>
          <EditButton>Edit</EditButton>
        </Rightside>
      </Header>

      <Hr />
      <h3>Employee Documents</h3>

      <FormWrapper>
        <ImageColumn>
          <ProfileImage src="https://i.pravatar.cc/100?img=5" alt="Profile" />
        </ImageColumn>

        <Row>
          <LeftSection>
           <Input type="text" value={employeeDetail?.name || ""} readOnly />
                       <Input type="text" value={employeeDetail?.employee_id || ""} readOnly />
                       <Input type="email" value={employeeDetail?.email || ""} readOnly />
          </LeftSection>

  <RightSection>
            <Textarea value={employeeDetail?.address || ""} readOnly />
            <Rows style={{ marginTop: "1rem" }}>
              <Input type="text" value={employeeDetail?.dob || ""} readOnly />
              <Input type="text" value={employeeDetail?.gender || ""} readOnly />
            </Rows>
          </RightSection>
        </Row>
      </FormWrapper>

      <Hr />

      <Section>
        <Tabs>
          <NavLink to={`/ViewBasic/${id}`} style={{ textDecoration: 'none' }}>
            <Tab active={location.pathname === `/ViewBasic/${id}`}>Basic Details</Tab>
          </NavLink>
          <NavLink to={`/ViewBasic/${id}/bank`} style={{ textDecoration: 'none' }}>
            <Tab active={location.pathname === `/ViewBasic/${id}/bank`}>Bank and payment details</Tab>
          </NavLink>
          <NavLink to={`/ViewBasic/${id}/documents`} style={{ textDecoration: 'none' }}>
            <Tab active={location.pathname === `/ViewBasic/${id}/documents`}>Documents</Tab>
          </NavLink>
        </Tabs>

        <SectionTitle>Documents</SectionTitle>
        {renderImageList("Passport", employeeDetail?.passport)}
        {renderImageList("Work Permit", employeeDetail?.work_permit)}
        {renderImageList("Employment Contract", employeeDetail?.employment_contract)}
        {renderImageList("Insurance", employeeDetail?.insurance)}

        <SectionTitle>Certificate</SectionTitle>
        {renderImageList("Certificate", employeeDetail?.certificate)}

        <ButtonGroup>
          <Button secondary>Previous Step</Button>
          <Button>Submit</Button>
        </ButtonGroup>
      </Section>
    </Container>
  );
};

export default ViewDocument;
