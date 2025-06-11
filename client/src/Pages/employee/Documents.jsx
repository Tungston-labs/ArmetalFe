// DocumentUploadForm.jsx
import React from 'react';
import {
  Container, Header, RoleInfo, Stepper, Step, SectionTitle,
  UploadSection, LabelRow, UploadButton, ImagePreviewRow,
  ImageBox, ButtonGroup, Button
} from './Document.Styles';

export default function DocumentUploadForm() {
  return (
    <Container>
      <Header>
        <div>
          <h2>👨‍💼 Employee</h2>
          <p>Manage your Employee</p>
        </div>
        <RoleInfo>HR Manager</RoleInfo>
      </Header>

      <Stepper>
        <Step active>1<br />Basic Details</Step>
        <Step active>2<br />Bank and payment details</Step>
        <Step active>3<br />Documents</Step>
      </Stepper>

      <SectionTitle>Documents</SectionTitle>

      {["Passport", "Work Permit", "Employement Contract", "Visa expiry date", "Insurance number"].map((label, idx) => (
        <UploadSection key={idx}>
          <LabelRow>{label}</LabelRow>
          <UploadButton>⬆ Upload images</UploadButton>
          <ImagePreviewRow>
            <ImageBox />
            <ImageBox />
          </ImagePreviewRow>
        </UploadSection>
      ))}

      <SectionTitle>Certificate</SectionTitle>
      <UploadSection>
        <LabelRow>Upload certificate</LabelRow>
        <UploadButton>⬆ Upload images</UploadButton>
        <ImagePreviewRow>
          <ImageBox />
          <ImageBox />
        </ImagePreviewRow>
      </UploadSection>

      <ButtonGroup>
        <Button secondary>Previous step</Button>
        <Button>Submit</Button>
      </ButtonGroup>
    </Container>
  );
}
