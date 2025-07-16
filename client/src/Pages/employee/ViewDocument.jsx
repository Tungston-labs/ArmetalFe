import React, { useEffect, useState } from "react";
import {
  Container, Header, LeftSection, RightSection, UploadSection,
  InlineUploadRow, Textarea, EditButton, Row, ImageBox, Tabs,
  LabelRow, Tab, SectionTitle, Section, ButtonGroup, Rows,
  ImagePreviewRow, Input, UploadButton, Hr, Button,
  ProfileImage, ImageColumn, Title, FormWrapper,
  Subtitle, Rightside, HeaderWrapper, TextGroup, HRManager
} from "./ViewDocument.Styles";
import { uploadImageThunk } from "../../Redux/employeeSlice";
import { LuCirclePlus } from "react-icons/lu";
import { NavLink, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmployeeDocumentsThunk,
  updateEmployeeDocumentsThunk
} from "../../Redux/employeeSlice";
import SyncLoader from "react-spinners/SyncLoader";
import styled from "styled-components";

// ✅ Loader Wrapper
const FullPageLoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

// ✅ Utility to get full image URL
const getFullImageUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `http://localhost:8000${url}`;
};

const ViewDocument = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const { employeeDetail, employeeDocuments, loading } = useSelector((state) => state.employees);

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

  const renderImageList = (label, imageList = [], inputKeys = []) => (
    <UploadSection>
      <LabelRow>{label}</LabelRow>
      <InlineUploadRow>
        {editMode && inputKeys.map((key, index) => (
          <UploadButton as="label" key={key}>
            <LuCirclePlus /> Choose Image {index + 1}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleImageChange(e, key)}
            />
          </UploadButton>
        ))}

        <ImagePreviewRow>
          {!editMode ? (
            imageList.length > 0 ? (
              imageList.map((url, idx) => (
                <ImageBox key={idx}>
                  <img src={`${getFullImageUrl(url)}?v=${refreshKey}`} alt={`${label} ${idx + 1}`} />
                </ImageBox>
              ))
            ) : (
              <p style={{ marginLeft: "1rem", color: "#aaa" }}>No image uploaded</p>
            )
          ) : (
            inputKeys.map((key, idx) =>
              formData[key]?.[0] ? (
                <ImageBox key={key}>
                  <img src={URL.createObjectURL(formData[key][0])} alt={`Preview ${idx + 1}`} />
                </ImageBox>
              ) : (
                imageList[idx] && (
                  <ImageBox key={idx}>
                    <img src={`${getFullImageUrl(imageList[idx])}?v=${refreshKey}`} alt={`Image ${idx + 1}`} />
                  </ImageBox>
                )
              )
            )
          )}
        </ImagePreviewRow>
      </InlineUploadRow>
    </UploadSection>
  );

  const handleSubmit = async () => {
    const form = new FormData();

    try {
      // Single image fields
      if (formData.passport_image1_url?.[0] instanceof File) {
        const res = await dispatch(uploadImageThunk(formData.passport_image1_url[0])).unwrap();
        form.append("passport_image1_url", res);
      }

      if (formData.passport_image2_url?.[0] instanceof File) {
        const res = await dispatch(uploadImageThunk(formData.passport_image2_url[0])).unwrap();
        form.append("passport_image2_url", res);
      }

      if (formData.insurance_image_url?.[0] instanceof File) {
        const res = await dispatch(uploadImageThunk(formData.insurance_image_url[0])).unwrap();
        form.append("insurance_image_url", res);
      }

      // Multi-image fields → Upload all and stringify array
      const handleArrayUpload = async (key) => {
        if (Array.isArray(formData[key])) {
          const urls = await Promise.all(
            formData[key].map((file) => dispatch(uploadImageThunk(file)).unwrap())
          );
          form.append(key, JSON.stringify(urls));  // JSON stringify for array fields
        }
      };

      await handleArrayUpload("work_permit_urls");
      await handleArrayUpload("contract_urls");
      await handleArrayUpload("certificate_urls");

      // PATCH request to backend
      await dispatch(updateEmployeeDocumentsThunk({ id, form }));
      await dispatch(getEmployeeDocumentsThunk(id));
      setFormData({});
      setEditMode(false);
      setRefreshKey(Date.now());
      alert("Documents updated successfully!");
    } catch (error) {
      console.error("Error submitting:", error);
    }
  };

  // ✅ Loader before content
  if (loading || !employeeDocuments) {
    return (
      <FullPageLoaderWrapper>
        <SyncLoader color="#36d7b7" size={12} />
      </FullPageLoaderWrapper>
    );
  }

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
          <ProfileImage
            src={employeeDetail?.profile_pic || "https://i.pravatar.cc/100?img=5"}
            alt="Profile"
          />
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
        ].filter(Boolean), [ "passport_image1_url", "passport_image2_url" ])}

        {renderImageList("Work Permit", employeeDocuments?.work_permit_urls || [], [ "work_permit_urls" ])}
        {renderImageList("Employment Contract", employeeDocuments?.contract_urls || [], [ "contract_urls" ])}
        {renderImageList("Insurance", [employeeDocuments?.insurance_image_url].filter(Boolean), [ "insurance_image_url" ])}
        {renderImageList("Certificate", employeeDocuments?.certificate_urls || [], [ "certificate_urls" ])}

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
