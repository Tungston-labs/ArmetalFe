// components/AddCompany/AddCompanyModal.jsx
import React from "react";
import {
  FormWrapper,
  BackHeader,
  FormSection,
  Input,
  CheckboxGroup,
  CheckboxLabel,
  ButtonGroup,
  Button,
  Hr,
  Select,
  FormField,
  Label,
  LogoUploadBox,
  LogoPreview,
  Td,
  TotalText,
  Th,
  TableHead,
  SalaryTable,
  SalaryTableWrapper,
  SalaryTitle,
  SalaryWrapper,
} from "./AddCompany.Styles";
import { GoArrowLeft } from "react-icons/go";
import { FiUpload } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { ClipLoader } from "react-spinners";

import { useAddCompany } from "./ useAddCompany";

const AddCompanyModal = ({ onClose, isEdit = false, selectedCompany = null, showPrivileges = true }) => {
  const countryDialCodes = [
    { code: "+971", label: "UAE (+971)" },
    { code: "+966", label: "Saudi Arabia (+966)" },
    { code: "+965", label: "Kuwait (+965)" },
    { code: "+973", label: "Bahrain (+973)" },
    { code: "+968", label: "Oman (+968)" },
    { code: "+974", label: "Qatar (+974)" },
    { code: "+91", label: "India (+91)" },
    { code: "+880", label: "Bangladesh (+880)" },
    { code: "+92", label: "Pakistan (+92)" },
  ];

  const COUNTRY_CHOICES = [
    { code: "IN", name: "India" },
    { code: "US", name: "United States" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "SG", name: "Singapore" },
    { code: "GB", name: "United Kingdom" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "JP", name: "Japan" },
    { code: "CN", name: "China" },
    { code: "AU", name: "Australia" },
    { code: "CA", name: "Canada" },
  ];

  const allModules = [
    "dashboard",
    "employee",
    "department",
    "daily_task",
    "payroll",
    "holiday",
    "reimbursement",
    "project",
    "finance",
  ];

  const {
    formData,
    formErrors,
    fileInputRef,
    logoPreview,
    isSubmitting,
    handleChange,
    handleModuleChange,
    handleLogoChange,
    removeLogo,
    handleSubmit,
    totalPercent,
  } = useAddCompany({ isEdit, selectedCompany, onClose, allModules });

  return (
    <FormWrapper>
      <BackHeader>
        <GoArrowLeft onClick={onClose} style={{ cursor: "pointer" }} />
        <span>{isEdit ? "Edit Company" : "Add Company"}</span>
      </BackHeader>

      <form onSubmit={handleSubmit}>
        <FormSection>
          <div>
            <FormField>
              <Label>Company Name</Label>
              <Input name="name" value={formData.name} onChange={handleChange} placeholder="Company name" autoComplete="off" />
              {formErrors.name && <p style={{ color: "red" }}>{formErrors.name}</p>}
            </FormField>

            <FormField>
              <Label>Address</Label>
              <Input name="address" value={formData.address} onChange={handleChange} placeholder="Company Address" autoComplete="off" />
              {formErrors.address && <p style={{ color: "red" }}>{formErrors.address}</p>}
            </FormField>

            <FormField>
              <Label>Email</Label>
              <Input name="email" value={formData.email} onChange={handleChange} placeholder="Company E-mail" autoComplete="off" />
              {formErrors.email && <p style={{ color: "red" }}>{formErrors.email}</p>}
            </FormField>

            <FormField>
              <Label>Amount per Employee (INR)</Label>
              <Input name="amount_per_employee" type="number" step="0.01" value={formData.amount_per_employee} onChange={handleChange} placeholder="Enter amount per employee" />
              {formErrors.amount_per_employee && <p style={{ color: "red" }}>{formErrors.amount_per_employee}</p>}
            </FormField>

            <FormField>
              <Label>Initial Payment (Advance ₹)</Label>
              <Input name="initial_payment" type="number" step="0.01" value={formData.initial_payment} onChange={handleChange} placeholder="Enter advance amount (optional)" />
              {formErrors.initial_payment && <p style={{ color: "red" }}>{formErrors.initial_payment}</p>}
            </FormField>

            <FormField>
              <Label>Upload logo</Label>
              <LogoUploadBox onClick={() => fileInputRef.current?.click()}>
                <FiUpload size={24} />
                <p>
                  Click to upload or Drag and Drop <br />
                  Max 2 MB file size (PNG or SVG only)
                </p>
                <input type="file" accept=".png,.svg" ref={fileInputRef} onChange={handleLogoChange} style={{ display: "none" }} />
              </LogoUploadBox>

              {logoPreview && (
                <LogoPreview>
                  {formData.logo?.type === "image/svg+xml" ? (
                    <object data={logoPreview} type="image/svg+xml" width="50" height="50" />
                  ) : (
                    <img src={logoPreview} alt="Logo" />
                  )}
                  <button onClick={removeLogo} type="button">
                    <AiOutlineClose />
                  </button>
                </LogoPreview>
              )}
            </FormField>
          </div>

          <div>
            <FormField>
              <Label>Company location</Label>
              <Input name="location" value={formData.location} onChange={handleChange} placeholder="Location" autoComplete="off" />
            </FormField>

            <FormField>
              <Label>Contact Number</Label>
              <div style={{ display: "flex", gap: "8px" }}>
                <select name="country_code" value={formData.country_code} onChange={handleChange} autoComplete="off" style={{ width: "35%", padding: "8px" }}>
                  {countryDialCodes.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.label}
                    </option>
                  ))}
                </select>

                <Input name="contact_number" inputMode="numeric" value={formData.contact_number} onChange={handleChange} placeholder="Phone number" style={{ width: "65%" }} autoComplete="off" />
              </div>
            </FormField>

            <FormField>
              <Label>Country</Label>
              <Select name="country" value={formData.country} onChange={handleChange} autoComplete="off">
                <option value="">Select country</option>
                {COUNTRY_CHOICES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField>
              <Label>Latitude</Label>
              <Input name="latitude" type="number" step="any" value={formData.latitude} onChange={handleChange} placeholder="Enter company latitude" autoComplete="off" />
            </FormField>

            <FormField>
              <Label>Longitude</Label>
              <Input name="longitude" type="number" step="any" value={formData.longitude} onChange={handleChange} placeholder="Enter company longitude" autoComplete="off" />
            </FormField>

            <FormField>
              <Label>Working Hour</Label>
              <Input name="longitude" type="number" step="any" value={formData.longitude} onChange={handleChange} placeholder="Enter working hour" autoComplete="off" />
            </FormField>

            <FormField>
              <Label>Half Day Hour</Label>
              <Input name="longitude" type="number" step="any" value={formData.longitude} onChange={handleChange} placeholder="Enter half day hour" autoComplete="off" />
            </FormField>
          </div>
        </FormSection>

        {showPrivileges && (
          <>
            <h4>Privileges</h4>
            <CheckboxGroup>
              {allModules.map((mod) => (
                <CheckboxLabel key={mod}>
                  <input type="checkbox" checked={formData.modules.includes(mod)} onChange={() => handleModuleChange(mod)} />
                  {mod.charAt(0).toUpperCase() + mod.slice(1).replace("_", " ")}
                </CheckboxLabel>
              ))}
            </CheckboxGroup>
            <Hr />
          </>
        )}
        <SalaryWrapper>
          <SalaryTitle>Salary Structure (%)</SalaryTitle>

          <SalaryTableWrapper>
            <SalaryTable>
              <TableHead>
                <tr>
                  <Th>Basic %</Th>
                  <Th>House Rent %</Th>
                  <Th>Transport %</Th>
                  <Th>Special %</Th>
                  <Th>Total %</Th>
                </tr>
              </TableHead>

              <tbody>
                <tr>
                  <Td>
                    <Input
                      type="number"
                      name="basic_percent"
                      value={formData.basic_percent}
                      onChange={handleChange}
                      placeholder="Basic"
                    />
                  </Td>

                  <Td>
                    <Input
                      type="number"
                      name="house_rent_percent"
                      value={formData.house_rent_percent}
                      onChange={handleChange}
                      placeholder="HRA"
                    />
                  </Td>

                  <Td>
                    <Input
                      type="number"
                      name="transport_percent"
                      value={formData.transport_percent}
                      onChange={handleChange}
                      placeholder="Transport"
                    />
                  </Td>

                  <Td>
                    <Input
                      type="number"
                      name="special_percent"
                      value={formData.special_percent}
                      onChange={handleChange}
                      placeholder="Special"
                    />
                  </Td>

                  <Td>
                    <TotalText isError={totalPercent !== 100}>
                      {totalPercent} %
                    </TotalText>
                  </Td>
                </tr>
              </tbody>
            </SalaryTable>
          </SalaryTableWrapper>
        </SalaryWrapper>
        <ButtonGroup>
          <Button type="button" cancel onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ClipLoader size={16} color="#fff" />
                {isEdit ? "Updating..." : "Saving..."}
              </div>
            ) : isEdit ? (
              "Update"
            ) : (
              "Save"
            )}
          </Button>
        </ButtonGroup>
      </form>
    </FormWrapper>
  );
};

export default AddCompanyModal;