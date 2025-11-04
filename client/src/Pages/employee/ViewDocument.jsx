import React, { useEffect, useState } from "react";
import {
  Container, Headers, LeftSection, RightSection, UploadSection,
  InlineUploadRow, Textarea, EditButton, Row, ImageBox, Tabs,
  LabelRow, Tab, SectionTitle, Section, ButtonGroup, Rows,
  ImagePreviewRow, Input, UploadButton, Hr, Button,
  ProfileImage, ImageColumn, Title, FormWrapper,
  Subtitle, Rightside, HeaderWrapper, TextGroup, HRManager,
  TitleSection, FieldWrapper, Label, EmployeeImage, ResponsiveH3
} from "./ViewDocument.Styles";
import { uploadImageThunk } from "../../Redux/employeeSlice";
import { LuCirclePlus, LuArrowLeft } from "react-icons/lu";
import { NavLink, useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmployeeDocumentsThunk,
  updateEmployeeDocumentsThunk
} from "../../Redux/employeeSlice";
import SyncLoader from "react-spinners/SyncLoader";
import styled from "styled-components";
import EmployeeIcon from "../../assets/employeeicon.svg";
import Header from "../../Components/Header";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

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
  const navigate = useNavigate();

  const { employeeDetail, employeeDocuments, loading } = useSelector(
    (state) => state.employees
  );

  const [refreshKey, setRefreshKey] = useState(Date.now());
  const [formData, setFormData] = useState({});
  const [editMode] = useState(true); // Always in edit mode ✅

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
        {inputKeys.map((key, index) => (
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
          {inputKeys.map((key, idx) =>
            formData[key]?.[0] ? (
              <ImageBox key={key}>
                <img
                  src={URL.createObjectURL(formData[key][0])}
                  alt={`Preview ${idx + 1}`}
                />
              </ImageBox>
            ) : (
              imageList[idx] && (
                <ImageBox key={idx}>
                  <img
                    src={`${getFullImageUrl(imageList[idx])}?v=${refreshKey}`}
                    alt={`Image ${idx + 1}`}
                  />
                </ImageBox>
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

      // Multi-image fields
      const handleArrayUpload = async (key) => {
        if (Array.isArray(formData[key])) {
          const urls = await Promise.all(
            formData[key].map((file) => dispatch(uploadImageThunk(file)).unwrap())
          );
          form.append(key, JSON.stringify(urls));
        }
      };

      await handleArrayUpload("work_permit_urls");
      await handleArrayUpload("contract_urls");
      await handleArrayUpload("certificate_urls");

      await dispatch(updateEmployeeDocumentsThunk({ id, form }));
      await dispatch(getEmployeeDocumentsThunk(id));
      setFormData({});
      setRefreshKey(Date.now());

      // ✅ SweetAlert success popup
      Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Employee documents updated successfully.",
        confirmButtonColor: "#304EB0",
      });
    } catch (error) {
      console.error("Error submitting:", error);

      // ❌ SweetAlert error popup
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was an error updating employee documents.",
        confirmButtonColor: "#d33",
      });
    }
  };

  if (loading || !employeeDocuments) {
    return (
      <FullPageLoaderWrapper>
        <SyncLoader color="#36d7b7" size={12} />
      </FullPageLoaderWrapper>
    );
  }

  return (
    <Container>
      <Headers>
        <HeaderWrapper>
          <TitleSection>
            <LuArrowLeft
              style={{ width: "30px", height: 30, cursor: "pointer", color: "#304EB0" }}
              onClick={() => navigate("/employee")}
            />
            <EmployeeImage src={EmployeeIcon} alt="employeeIcon" />
            <div>
              <Title>Employee</Title>
              <Subtitle>Manage your Employee.</Subtitle>
            </div>
          </TitleSection>
        </HeaderWrapper>

        <Rightside>
          <EditButton onClick={handleSubmit}>Save</EditButton>
        </Rightside>
      </Headers>

      <Hr />
      <ResponsiveH3>Employee Documents</ResponsiveH3>
<Header employee={employeeDetail}/>

      <Section>
        <Tabs>
          <NavLink to={`/ViewBasic/${id}`}>
            <Tab active={location.pathname === `/ViewBasic/${id}`}>Basic Details</Tab>
          </NavLink>
          <NavLink to={`/ViewBasic/${id}/bank`}>
            <Tab active={location.pathname === `/ViewBasic/${id}/bank`}>
              Bank and payment details
            </Tab>
          </NavLink>
          <NavLink to={`/ViewBasic/${id}/documents`}>
            <Tab active={location.pathname === `/ViewBasic/${id}/documents`}>
              Documents
            </Tab>
          </NavLink>
        </Tabs>

        <SectionTitle>Documents</SectionTitle>

        {renderImageList("Passport", [
          employeeDocuments?.passport_image1_url,
          employeeDocuments?.passport_image2_url,
        ].filter(Boolean), ["passport_image1_url", "passport_image2_url"])}

        {renderImageList("Work Permit", employeeDocuments?.work_permit_urls || [], ["work_permit_urls"])}
        {renderImageList("Employment Contract", employeeDocuments?.contract_urls || [], ["contract_urls"])}
        {renderImageList("Insurance", [employeeDocuments?.insurance_image_url].filter(Boolean), ["insurance_image_url"])}
        {renderImageList("Certificate", employeeDocuments?.certificate_urls || [], ["certificate_urls"])}
      </Section>
    </Container>
  );
};

export default ViewDocument;
