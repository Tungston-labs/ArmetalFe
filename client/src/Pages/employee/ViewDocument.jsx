import React, { useEffect, useState } from "react";
import {
  Container, Header, LeftSection, RightSection, UploadSection,
  InlineUploadRow, Textarea, EditButton, Row, ImageBox, Tabs,
  LabelRow, Tab, SectionTitle, Section, ButtonGroup, Rows,
  ImagePreviewRow, Input, UploadButton, Hr, Button,
  ProfileImage, Rowes, ImageColumn, Title, FormWrapper,
  Subtitle, Rightside, HeaderWrapper, TextGroup, HRManager
} from "./ViewDocument.Styles";

import { LuCirclePlus } from "react-icons/lu";
import { NavLink, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmployeeDocumentsThunk,
  updateEmployeeDocumentsThunk,
  deleteEmployeeDocumentImageThunk
} from "../../Redux/employeeSlice";

const ViewDocument = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { employeeDetail, employeeDocuments } = useSelector((state) => state.employees);

  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(getEmployeeDocumentsThunk(id));
    }
  }, [id, dispatch]);

  const handleImageChange = (e, key) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      [key]: files,
    }));
  };

  const renderImageList = (label, images = [], inputKey) => (
    <UploadSection>
      <LabelRow>{label}</LabelRow>
      <InlineUploadRow>
        <UploadButton as="label">
          <LuCirclePlus /> {editMode ? "Choose Images" : "Uploaded Images"}
          {editMode && (
            <input
              type="file"
              multiple
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleImageChange(e, inputKey)}
            />
          )}
        </UploadButton>

        <ImagePreviewRow>
          {editMode && formData[inputKey] ? (
            formData[inputKey].map((file, idx) => (
              <ImageBox key={idx}>
                <img src={URL.createObjectURL(file)} alt={`${label} preview ${idx + 1}`} />
              </ImageBox>
            ))
          ) : images.length > 0 ? (
            images.map((url, idx) => (
              <ImageBox key={idx}>
                <img src={`${url}?updated=${refreshKey}`} alt={`${label} ${idx + 1}`} />
              </ImageBox>
            ))
          ) : (
            <p style={{ marginLeft: "1rem", color: "#aaa" }}>No image uploaded</p>
          )}
        </ImagePreviewRow>
      </InlineUploadRow>
    </UploadSection>
  );

  const handleSubmit = async () => {
    const form = new FormData();
    Object.entries(formData).forEach(([key, files]) => {
      files.forEach((file) => form.append(key, file));
    });

    try {
      await dispatch(updateEmployeeDocumentsThunk({ id, form }));
      await dispatch(getEmployeeDocumentsThunk(id));
      setFormData({});
      setEditMode(false);
      setRefreshKey(Date.now()); // forces image refresh in frontend
      alert("Documents updated successfully!");
    } catch (error) {
      console.error("Error updating documents:", error);
    }
  };

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
          <EditButton onClick={() => setEditMode((prev) => !prev)}>
            {editMode ? "Cancel" : "Edit"}
          </EditButton>
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
          <NavLink to={`/ViewBasic/${id}`}><Tab active={location.pathname === `/ViewBasic/${id}`}>Basic Details</Tab></NavLink>
          <NavLink to={`/ViewBasic/${id}/bank`}><Tab active={location.pathname === `/ViewBasic/${id}/bank`}>Bank and payment details</Tab></NavLink>
          <NavLink to={`/ViewBasic/${id}/documents`}><Tab active={location.pathname === `/ViewBasic/${id}/documents`}>Documents</Tab></NavLink>
        </Tabs>

        <SectionTitle>Documents</SectionTitle>

        {renderImageList("Passport", [
          employeeDocuments?.passport_image1_url,
          employeeDocuments?.passport_image2_url,
        ].filter(Boolean), "passport_images")}

        {renderImageList("Work Permit", employeeDocuments?.work_permit_urls || [], "work_permit")}
        {renderImageList("Employment Contract", employeeDocuments?.contract_urls || [], "contract")}
        {renderImageList("Insurance", [employeeDocuments?.insurance_image_url].filter(Boolean), "insurance")}
        {renderImageList("Certificate", employeeDocuments?.certificate_urls || [], "certificate")}

        {editMode && (
          <ButtonGroup>
            <Button secondary onClick={() => setEditMode(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Save</Button>
          </ButtonGroup>
        )}
      </Section>
    </Container>
  );
};

export default ViewDocument;
