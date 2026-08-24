import React from "react";
import {
  Section,
  SectionTitle,
  FormGrid,
  FormGroup,
  Label,
  Required,
  Input,
  UploadWrapper,
  UploadInput,
  UploadText,
  UploadIcon,
  ErrorText,
} from "../EmployeeForm.styles";
import { FiUpload } from "react-icons/fi";

// Same country-rules helper used by JobDetails.jsx / AddEmployeeForm.jsx.
// Adjust the relative path below to match where this file actually lives.
import { getLegalFieldConfig, isIndiaCompany } from "../../../../utils/employeeCountryFields";

// Maps the dynamic identity field name coming from getLegalFieldConfig
// ("aadar_number" / "iqama_number" / "passport_number") to this form's
// local camelCase state keys.
const IDENTITY_FIELD_KEY_MAP = {
  aadar_number: "aadhaarNumber",
  iqama_number: "iqamaNumber", // rendered with label "Emirates ID"
  passport_number: "passportNumber",
};

/**
 * Legal & ID Information section — the country-driven part of the form.
 * Fields shown/required here change based on the COMPANY's country
 * (India / UAE / other foreign), per getLegalFieldConfig.
 *
 * Props:
 * - companyCountry: e.g. "IN" or "AE", from the logged-in user's company
 * - formData: the shared form state object
 * - errors: field-name-keyed error messages
 * - handleChange: shared onChange handler from the parent
 */
const LegalInfoSection = ({ companyCountry, formData, errors, handleChange }) => {
  const legalConfig = getLegalFieldConfig(companyCountry);
  const isIndia = isIndiaCompany(companyCountry);
  const identityStateKey = IDENTITY_FIELD_KEY_MAP[legalConfig.identityField] || "passportNumber";
  const isLegalFieldRequired = (fieldKey) => legalConfig.requiredFields.includes(fieldKey);

  return (
    <Section>
      <SectionTitle>Employee Legal & ID Information</SectionTitle>

      <FormGrid>
        {/* Dynamic identity field: Aadhaar for India, Emirates ID for UAE,
            Passport for other foreign companies. */}
        <FormGroup>
          <Label>
            {legalConfig.identityLabel}
            <Required>*</Required>
          </Label>
          <Input
            type="text"
            name={identityStateKey}
            value={formData[identityStateKey]}
            onChange={handleChange}
            placeholder={legalConfig.identityPlaceholder}
            maxLength={legalConfig.identityMaxLength}
            onKeyPress={(e) => {
              if (isIndia && !/[0-9]/.test(e.key)) e.preventDefault();
            }}
          />
          {errors[identityStateKey] && <ErrorText>{errors[identityStateKey]}</ErrorText>}
        </FormGroup>

        {/* UAE (and any other non-India company whose identity field isn't
            already Passport) additionally shows a Passport Number field.
            Optional — not in legalConfig.requiredFields for UAE. */}
        {!isIndia && legalConfig.identityField !== "passport_number" && (
          <FormGroup>
            <Label>Passport Number</Label>
            <Input
              type="text"
              name="passportNumber"
              placeholder="Enter Passport Number"
              value={formData.passportNumber}
              onChange={handleChange}
            />
            {errors.passportNumber && <ErrorText>{errors.passportNumber}</ErrorText>}
          </FormGroup>
        )}

        {/* Employee Contract */}
        <FormGroup>
          <Label>
            Employee Contract<Required>*</Required>
          </Label>
          <Input
            type="text"
            name="employeeContract"
            placeholder="Enter Employee Contract"
            value={formData.employeeContract}
            onChange={handleChange}
          />
          {errors.employeeContract && <ErrorText>{errors.employeeContract}</ErrorText>}
        </FormGroup>

        {/* Work Permit */}
        <FormGroup>
          <Label>
            Work Permit<Required>*</Required>
          </Label>
          <Input
            type="text"
            name="workPermit"
            placeholder="Enter Work Permit"
            value={formData.workPermit}
            onChange={handleChange}
          />
          {errors.workPermit && <ErrorText>{errors.workPermit}</ErrorText>}
        </FormGroup>

        {/* Insurance Number — required only for UAE / other foreign */}
        <FormGroup>
          <Label>
            Insurance Number
            {isLegalFieldRequired("insurance_number") && <Required>*</Required>}
          </Label>
          <Input
            type="text"
            name="insuranceNumber"
            placeholder="Enter Insurance Number"
            value={formData.insuranceNumber}
            onChange={handleChange}
          />
          {errors.insuranceNumber && <ErrorText>{errors.insuranceNumber}</ErrorText>}
        </FormGroup>

        {/* Contract Expiry Date (India) vs Visa Expiry Date (UAE / other foreign) */}
        <FormGroup>
          <Label>
            {isIndia ? "Contract Expiry Date" : "Visa Expiry Date"}
            {!isIndia && isLegalFieldRequired("visa_expiry_date") && <Required>*</Required>}
          </Label>
          <Input
            type="text"
            name={isIndia ? "contractExpiryDate" : "visaExpiryDate"}
            placeholder="dd-mm-yyyy"
            value={isIndia ? formData.contractExpiryDate : formData.visaExpiryDate}
            onChange={handleChange}
          />
          {isIndia
            ? errors.contractExpiryDate && <ErrorText>{errors.contractExpiryDate}</ErrorText>
            : errors.visaExpiryDate && <ErrorText>{errors.visaExpiryDate}</ErrorText>}
        </FormGroup>

        {/* ID Card Photo */}
        <FormGroup $wide>
          <Label>
            ID Card Photo<Required>*</Required>
          </Label>
          <UploadWrapper>
            <UploadText>
              {formData.idCardPhoto ? formData.idCardPhoto.name : "Upload ID Card Photo"}
            </UploadText>
            <UploadIcon>
              <FiUpload size={18} />
            </UploadIcon>
            <UploadInput
              type="file"
              name="idCardPhoto"
              accept="image/*"
              onChange={handleChange}
            />
          </UploadWrapper>
          {errors.idCardPhoto && <ErrorText>{errors.idCardPhoto}</ErrorText>}
        </FormGroup>
      </FormGrid>
    </Section>
  );
};

export default LegalInfoSection;