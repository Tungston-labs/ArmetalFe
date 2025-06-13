// DocumentUploadForm.jsx
import React, { useState } from 'react';
import {
  Container, Header, RoleInfo, Stepper, Step, SectionTitle,
  UploadSection, LabelRow, UploadButton, ImagePreviewRow,
  ImageBox, ButtonGroup, Button, Title, Subtitle, Hr, InlineUploadRow
} from './Document.Styles';
import Multistep from '../../Components/Multistep';
import { LuCirclePlus } from "react-icons/lu";
import { IoImageOutline } from "react-icons/io5";

import SuccessModal from '../../Components/Succes'; // <-- Import Success Modal

export default function DocumentUploadForm() {
  const [showSuccessModal, setShowSuccessModal] = useState(false); // <-- State for Modal

  return (
    <Container>
      <Header>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img src="/images/employee.png" alt="Icon" style={{ height: "50px" }} />
          <div>
            <Title>Employee</Title>
            <Subtitle>Manage your Employee.</Subtitle>
          </div>
        </div>
        <RoleInfo>
          <img src="https://i.pravatar.cc/40?img=5" alt="HR Manager" />
          <span>HR Manager</span>
        </RoleInfo>
      </Header>

      <Hr />

      <div style={{ width: "100%", justifyContent: "center", display: "flex", padding: "10px" }}>
        <div style={{ width: "50%" }}>
          <Multistep />
        </div>
      </div>

      <SectionTitle>Documents</SectionTitle>

      {["Passport", "Work Permit", "Employement Contract", "Insurance "].map((label, idx) => (
        <UploadSection key={idx}>
          <LabelRow>{label}</LabelRow>
          <InlineUploadRow>
            <UploadButton><LuCirclePlus /> Upload images</UploadButton>
            <ImagePreviewRow>
              <ImageBox>
                <img src="/images/pic.jpg" alt="Preview 1" />
              </ImageBox>
              <ImageBox>
                <img src="/images/pic.jpg" alt="Preview 1" />
              </ImageBox>
            </ImagePreviewRow>
          </InlineUploadRow>
        </UploadSection>
      ))}

      <SectionTitle>Certificate</SectionTitle>

      <UploadSection>
        <LabelRow>Upload certificate</LabelRow>
        <InlineUploadRow>
          <UploadButton>⬆ Upload images</UploadButton>
          <ImagePreviewRow>
            <ImageBox>
              <img src="/images/pic.jpg" alt="Preview 1" />
            </ImageBox>
            <ImageBox>
              <img src="/images/pic.jpg" alt="Preview 1" />
            </ImageBox>
          </ImagePreviewRow>
        </InlineUploadRow>
      </UploadSection>

      <ButtonGroup>
        <Button secondary>Previous step</Button>
        <Button onClick={() => setShowSuccessModal(true)}>Submit</Button>
      </ButtonGroup>

      {/* ✅ Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          onClose={() => setShowSuccessModal(false)}
          onAddAnother={() => {
            setShowSuccessModal(false);
            // optional: reset form or redirect
          }}
        />
      )}
    </Container>
  );
}
