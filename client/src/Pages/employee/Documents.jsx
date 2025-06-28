import React, { useState, useRef } from 'react';
import {
  Container, Header, RoleInfo, SectionTitle,
  UploadSection, LabelRow, UploadButton, ImagePreviewRow,
  ImageBox, ButtonGroup, Button, Title, Subtitle, Hr, InlineUploadRow
} from './Document.Styles';
import Multistep from '../../Components/Multistep';
import { LuCirclePlus } from "react-icons/lu";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../../Components/Succes';
import { useSelector, useDispatch } from 'react-redux';
import {
  submitDocumentsThunk,
  addDocumentUrl,
  uploadImageThunk
} from '../../Redux/employeeSlice';

export default function DocumentUploadForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const employeeId = useSelector((state) => state.employee.employeeId);
  const documentUrls = useSelector((state) => state.employee.documentUrls);
const [uploadErrors,setUploadErrors]= useState({});
  const [selectedFiles, setSelectedFiles] = useState({
    passport: [],
    workPermit: [],
    contract: [],
    insurance: [],
    certificate: [],
  });

  const fileInputRefs = {
    passport: useRef(),
    workPermit: useRef(),
    contract: useRef(),
    insurance: useRef(),
    certificate: useRef(),
  };

  const handleUploadClick = (type) => {
    fileInputRefs[type].current.click();
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => ({
      ...prev,
      [type]: [...prev[type], ...files],
    }));
  };

  const handleDeleteImage = (type, index) => {
    setSelectedFiles(prev => {
      const updated = [...prev[type]];
      updated.splice(index, 1);
      return {
        ...prev,
        [type]: updated,
      };
    });
  };

  const handleSubmit = async () => {
    console.log("📤 Submit button clicked");
 const requiredFields = ['passport', 'workPermit', 'contract', 'insurance', 'certificate'];
  const newErrors = {};

  for (const field of requiredFields) {
    const hasLocal = selectedFiles[field]?.length > 0;
    const hasUploaded = documentUrls[field]?.length > 0;
    if (!hasLocal && !hasUploaded) {
      newErrors[field] = `${field} is required`;
    }
  }

  if (Object.keys(newErrors).length > 0) {
    setUploadErrors(newErrors);
    console.warn("❌ Missing document fields:", newErrors);
    return;
  }

  setUploadErrors({});
    try {
      const uploadAndGetUrls = async (type) => {
        const files = selectedFiles[type] || [];
        if (files.length === 0) return documentUrls[type] || [];

        const uploadedUrls = await Promise.all(
          files.map(file => dispatch(uploadImageThunk(file)).unwrap())
        );

        uploadedUrls.forEach(url => {
          dispatch(addDocumentUrl({ type, url }));
        });

        return [...(documentUrls[type] || []), ...uploadedUrls];
      };

      const passportUrls = await uploadAndGetUrls('passport');
      const insuranceUrls = await uploadAndGetUrls('insurance');
      const workPermitUrls = await uploadAndGetUrls('workPermit');
      const contractUrls = await uploadAndGetUrls('contract');
      const certificateUrls = await uploadAndGetUrls('certificate');

      const payload = {
        passport_image1_url: passportUrls[0] || "",
        passport_image2_url: passportUrls[1] || "",
        insurance_image_url: insuranceUrls[0] || "",
        work_permit_urls: workPermitUrls,
        contract_urls: contractUrls,
        certificate_urls: certificateUrls
      };

      console.log("Sending documents payload:", payload);

      await dispatch(submitDocumentsThunk({ employeeId, documents: payload })).unwrap();
      setShowSuccessModal(true);

      // Clear local selected files
      setSelectedFiles({
        passport: [],
        insurance: [],
        workPermit: [],
        contract: [],
        certificate: [],
      });
    } catch (err) {
      console.error("❌ Document submission failed:", err);
      alert("Final submission failed: " + err.message);
    }
  };

  const renderPreviewImages = (type) => {
    const localFiles = selectedFiles[type].map((file, index) => (
      <ImageBox key={`local-${index}`} style={{ position: 'relative' }}>
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          onLoad={e => URL.revokeObjectURL(e.target.src)}
        />
        <FaTrash
          onClick={() => handleDeleteImage(type, index)}
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            cursor: 'pointer',
            color: 'red',
            background: 'white',
            borderRadius: '50%',
            padding: '5px',
            fontSize: '14px',
          }}
        />
      </ImageBox>
    ));

    const uploadedUrls = (documentUrls[type] || []).map((url, index) => (
      <ImageBox key={`uploaded-${index}`} style={{ position: 'relative' }}>
        <img src={url} alt="Uploaded" />
      </ImageBox>
    ));

    return [...uploadedUrls, ...localFiles];
  };

 const renderUploadBlock = (label, key) => (
  <UploadSection key={key}>
    <LabelRow>
      {label}
      {uploadErrors[key] && (
        <span style={{ color: 'red', fontSize: '0.8rem', marginLeft: '1rem' }}>
          {uploadErrors[key]}
        </span>
      )}
    </LabelRow>
    <InlineUploadRow>
      <UploadButton onClick={() => handleUploadClick(key)}>
        <LuCirclePlus /> Upload images
      </UploadButton>
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRefs[key]}
        style={{ display: 'none' }}
        onChange={(e) => handleFileChange(e, key)}
      />
      <ImagePreviewRow>{renderPreviewImages(key)}</ImagePreviewRow>
    </InlineUploadRow>
  </UploadSection>
);

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
          <img src="/images/user.jpg" alt="HR Manager" />
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
      {renderUploadBlock("Passport-Front / Passport-Back", "passport")}
      {renderUploadBlock("Work Permit", "workPermit")}
      {renderUploadBlock("Employment Contract", "contract")}
      {renderUploadBlock("Insurance", "insurance")}
      <SectionTitle>Certificate</SectionTitle>
      {renderUploadBlock("Certificate", "certificate")}

   <ButtonGroup>
  <Button onClick={handleSubmit}>Submit</Button>
</ButtonGroup>

     {showSuccessModal && (
  <SuccessModal
    onClose={() => setShowSuccessModal(false)}
    onAddAnother={() => setShowSuccessModal(false)}
    navigate={navigate} // 👈 pass navigate function
  />
)}

    </Container>
  );
}
