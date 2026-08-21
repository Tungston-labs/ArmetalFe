import React, { useState } from "react";

import {
  PageWrapper,
  MainCard,

  Section,
  SectionTitle,
  SectionDescription,

  FormGrid,
  FormGroup,
  Label,
  Input,
  Select,
  SelectWrapper,

  ContactWrapper,
  CountryCodeSelect,
  PhoneInput,

  ServicesGrid,
  ServiceCard,
  ServiceIcon,
  ServiceContent,
  ServiceTitle,
  ServiceDescription,

  ToggleWrapper,
  Toggle,
  ToggleSlider,

  FeatureBox,
  FeatureHeader,
  FeatureTitle,
  SelectAllWrapper,
  SelectAllLabel,

  FeatureGrid,
  FeatureItem,
  Checkbox,

  SalarySection,
  SalaryGrid,
  SalaryInputWrapper,
  SalaryInput,
  TotalInput,
} from "./AddCompany.Styles";

import ReusableHeader from "../../../Components/ReusableTable/ReusableHeader";
import { HeaderButton } from "../../../Components/ReusableTable/ReusableHeader.styles";

const AddCompany = () => {
  // =====================================================
  // OPEN / CLOSE STATES
  // =====================================================

  const [hrOpen, setHrOpen] = useState(false);
  const [financeOpen, setFinanceOpen] = useState(false);

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    // Company Details
    companyName: "",
    companyLocation: "",
    address: "",
    country: "",
    currency: "",
    phoneCode: "UAE (+971)",
    phoneNumber: "",
    email: "",
    latitude: "",
    longitude: "",
    logo: "",
    amountPerEmployee: "",
    initialPayment: "",

    // Modules
    hrModule: false,
    financeModule: false,

    // Features
    hrFeatures: [],
    financeFeatures: [],

    // Salary
    basic: "",
    houseAllowance: "",
    transport: "",
    special: "",

    // Working Hours
    workingHoursPerDay: "",
    halfDayHours: "",
  });

  // =====================================================
  // HR FEATURES
  // =====================================================

  const hrFeatures = [
    "DASHBOARD",
    "DEPARTMENT",
    "EMPLOYEE",
    "DAILY TASK",
    "PAYROLL",
    "HOLIDAY",
    "REIMBURSEMENT",
    "FINANCE",
  ];

  // =====================================================
  // FINANCE FEATURES
  // =====================================================

  const financeFeatures = [
    "DASHBOARD",
    "SALES",
    "PURCHASES",
    "PRODUCTS",
    "ACCOUNTING",
    "REPORTS",
  ];

  // =====================================================
  // HANDLE NORMAL INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // HR MODULE TOGGLE
  // =====================================================

  const handleHrToggle = () => {
    setHrOpen((prev) => !prev);

    setFormData((prev) => ({
      ...prev,
      hrModule: !prev.hrModule,
    }));
  };

  // =====================================================
  // FINANCE MODULE TOGGLE
  // =====================================================

  const handleFinanceToggle = () => {
    setFinanceOpen((prev) => !prev);

    setFormData((prev) => ({
      ...prev,
      financeModule: !prev.financeModule,
    }));
  };

  // =====================================================
  // HANDLE FEATURE CHECKBOX
  // =====================================================

  const handleFeatureChange = (type, feature) => {
    setFormData((prev) => {
      const currentFeatures =
        type === "hr"
          ? prev.hrFeatures
          : prev.financeFeatures;

      const updatedFeatures = currentFeatures.includes(feature)
        ? currentFeatures.filter((item) => item !== feature)
        : [...currentFeatures, feature];

      return {
        ...prev,
        [type === "hr"
          ? "hrFeatures"
          : "financeFeatures"]: updatedFeatures,
      };
    });
  };

  // =====================================================
  // SELECT ALL
  // =====================================================

  const handleSelectAll = (type, features) => {
    setFormData((prev) => {
      const field =
        type === "hr"
          ? "hrFeatures"
          : "financeFeatures";

      return {
        ...prev,
        [field]:
          prev[field].length === features.length
            ? []
            : [...features],
      };
    });
  };

  // =====================================================
  // CALCULATE SALARY TOTAL
  // =====================================================

  const calculateTotal = () => {
    const basic = Number(formData.basic) || 0;
    const houseAllowance =
      Number(formData.houseAllowance) || 0;
    const transport =
      Number(formData.transport) || 0;
    const special =
      Number(formData.special) || 0;

    return (
      basic +
      houseAllowance +
      transport +
      special
    );
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    const companyData = {
      ...formData,

      salaryTotal: calculateTotal(),
    };

    console.log("Company Data:", companyData);
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {
    console.log("Cancel Add Company");
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <PageWrapper>

      {/* =================================================
          HEADER
      ================================================= */}

      <ReusableHeader
        title="Add Company"
        breadcrumbs={["Companies"]}
        showBack
      >
        <HeaderButton
          $variant="danger"
          type="button"
          onClick={handleCancel}
        >
          CANCEL
        </HeaderButton>

        <HeaderButton
          $variant="success"
          type="button"
          onClick={handleSubmit}
        >
          SAVE COMPANY
        </HeaderButton>
      </ReusableHeader>

      {/* =================================================
          MAIN CARD
      ================================================= */}

      <MainCard>

        <form onSubmit={handleSubmit}>

          {/* =================================================
              COMPANY DETAILS
          ================================================= */}

          <Section>

            <SectionTitle>
              Company Details
            </SectionTitle>

            <FormGrid>

              {/* Company Name */}
              <FormGroup>
                <Label>
                  Company Name
                </Label>

                <Input
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company name"
                />
              </FormGroup>

              {/* Company Location */}
              <FormGroup>
                <Label>
                  Company Location
                </Label>

                <Input
                  name="companyLocation"
                  value={formData.companyLocation}
                  onChange={handleChange}
                  placeholder="Enter location"
                />
              </FormGroup>

              {/* Address */}
              <FormGroup>
                <Label>
                  Address
                </Label>

                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter company address"
                />
              </FormGroup>

              {/* Country */}
              <FormGroup>

                <Label>
                  Country
                </Label>

                <SelectWrapper>

                  <Select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Country
                    </option>

                    <option value="UAE">
                      UAE
                    </option>

                    <option value="India">
                      India
                    </option>

                    <option value="Qatar">
                      Qatar
                    </option>

                    <option value="Saudi Arabia">
                      Saudi Arabia
                    </option>
                  </Select>

                </SelectWrapper>

              </FormGroup>

              {/* Currency */}
              <FormGroup>

                <Label>
                  Currency
                </Label>

                <SelectWrapper>

                  <Select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Currency
                    </option>

                    <option value="AED">
                      AED
                    </option>

                    <option value="INR">
                      INR
                    </option>

                    <option value="USD">
                      USD
                    </option>

                    <option value="SAR">
                      SAR
                    </option>
                  </Select>

                </SelectWrapper>

              </FormGroup>

              {/* Contact Number */}
              <FormGroup>

                <Label>
                  Contact Number
                </Label>

                <ContactWrapper>

                  <CountryCodeSelect
                    name="phoneCode"
                    value={formData.phoneCode}
                    onChange={handleChange}
                  >
                    <option>
                      UAE (+971)
                    </option>

                    <option>
                      India (+91)
                    </option>

                    <option>
                      Qatar (+974)
                    </option>

                    <option>
                      Saudi (+966)
                    </option>
                  </CountryCodeSelect>

                  <PhoneInput
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone number"
                  />

                </ContactWrapper>

              </FormGroup>

              {/* Email */}
              <FormGroup>

                <Label>
                  Email ID
                </Label>

                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                />

              </FormGroup>

              {/* Latitude */}
              <FormGroup>

                <Label>
                  Latitude
                </Label>

                <Input
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="Enter Latitude"
                />

              </FormGroup>

              {/* Longitude */}
              <FormGroup>

                <Label>
                  Longitude
                </Label>

                <Input
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="Enter Longitude"
                />

              </FormGroup>

              {/* Logo */}
              <FormGroup>

                <Label>
                  Upload Logo
                </Label>

                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      logo:
                        e.target.files?.[0] || "",
                    }));
                  }}
                />

              </FormGroup>

              {/* Amount Per Employee */}
              <FormGroup className="wide-field">

                <Label>
                  Amount per Employee
                </Label>

                <Input
                  type="number"
                  name="amountPerEmployee"
                  value={formData.amountPerEmployee}
                  onChange={handleChange}
                  min="0"
                />

              </FormGroup>

              {/* Initial Payment */}
              <FormGroup className="wide-field">

                <Label>
                  Initial Payment (Advance)
                </Label>

                <Input
                  type="number"
                  name="initialPayment"
                  value={formData.initialPayment}
                  onChange={handleChange}
                  min="0"
                />

              </FormGroup>

            </FormGrid>

          </Section>

          {/* =================================================
              SERVICES
          ================================================= */}

          <Section>

            <SectionTitle>
              Select Services
            </SectionTitle>

            <SectionDescription>
              Choose the areas you want to enable
              for this company.
            </SectionDescription>

            <ServicesGrid>

              {/* =================================================
                  HR MODULE
              ================================================= */}

              <ServiceCard active={hrOpen}>

                <ServiceIcon hr>
                  HR
                </ServiceIcon>

                <ServiceContent>

                  <ServiceTitle>
                    HR Module
                  </ServiceTitle>

                  <ServiceDescription>
                    Employee, attendance, leave and
                    daily operations.
                  </ServiceDescription>

                </ServiceContent>

                <ToggleWrapper
                  onClick={handleHrToggle}
                >
                  <Toggle active={hrOpen}>

                    <ToggleSlider
                      active={hrOpen}
                    />

                  </Toggle>
                </ToggleWrapper>

              </ServiceCard>

              {/* =================================================
                  FINANCE MODULE
              ================================================= */}

              <ServiceCard active={financeOpen}>

                <ServiceIcon finance>
                  FI
                </ServiceIcon>

                <ServiceContent>

                  <ServiceTitle>
                    Finance Module
                  </ServiceTitle>

                  <ServiceDescription>
                    Sales, Purchase, Payroll,
                    billing, expenses and reporting.
                  </ServiceDescription>

                </ServiceContent>

                <ToggleWrapper
                  onClick={handleFinanceToggle}
                >
                  <Toggle active={financeOpen}>

                    <ToggleSlider
                      active={financeOpen}
                    />

                  </Toggle>
                </ToggleWrapper>

              </ServiceCard>

            </ServicesGrid>

            {/* =================================================
                HR FEATURES
            ================================================= */}

            {hrOpen && (

              <FeatureBox>

                <FeatureHeader>

                  <FeatureTitle>
                    Select HR Management Features
                  </FeatureTitle>

                  <SelectAllWrapper>

                    <SelectAllLabel>
                      Select All
                    </SelectAllLabel>

                    <ToggleWrapper
                      onClick={() =>
                        handleSelectAll(
                          "hr",
                          hrFeatures
                        )
                      }
                    >

                      <Toggle
                        active={
                          formData.hrFeatures.length ===
                          hrFeatures.length
                        }
                      >

                        <ToggleSlider
                          active={
                            formData.hrFeatures.length ===
                            hrFeatures.length
                          }
                        />

                      </Toggle>

                    </ToggleWrapper>

                  </SelectAllWrapper>

                </FeatureHeader>

                <FeatureGrid>

                  {hrFeatures.map(
                    (feature) => (

                      <FeatureItem
                        key={feature}
                      >

                        <Checkbox
                          type="checkbox"
                          checked={formData.hrFeatures.includes(
                            feature
                          )}
                          onChange={() =>
                            handleFeatureChange(
                              "hr",
                              feature
                            )
                          }
                        />

                        <span>
                          {feature}
                        </span>

                      </FeatureItem>

                    )
                  )}

                </FeatureGrid>

              </FeatureBox>

            )}

            {/* =================================================
                FINANCE FEATURES
            ================================================= */}

            {financeOpen && (

              <FeatureBox>

                <FeatureHeader>

                  <FeatureTitle>
                    Select Finance Management Features
                  </FeatureTitle>

                  <SelectAllWrapper>

                    <SelectAllLabel>
                      Select All
                    </SelectAllLabel>

                    <ToggleWrapper
                      onClick={() =>
                        handleSelectAll(
                          "finance",
                          financeFeatures
                        )
                      }
                    >

                      <Toggle
                        active={
                          formData.financeFeatures.length ===
                          financeFeatures.length
                        }
                      >

                        <ToggleSlider
                          active={
                            formData.financeFeatures.length ===
                            financeFeatures.length
                          }
                        />

                      </Toggle>

                    </ToggleWrapper>

                  </SelectAllWrapper>

                </FeatureHeader>

                <FeatureGrid>

                  {financeFeatures.map(
                    (feature) => (

                      <FeatureItem
                        key={feature}
                      >

                        <Checkbox
                          type="checkbox"
                          checked={formData.financeFeatures.includes(
                            feature
                          )}
                          onChange={() =>
                            handleFeatureChange(
                              "finance",
                              feature
                            )
                          }
                        />

                        <span>
                          {feature}
                        </span>

                      </FeatureItem>

                    )
                  )}

                </FeatureGrid>

              </FeatureBox>

            )}

          </Section>

          {/* =================================================
              SALARY STRUCTURE
          ================================================= */}

          <SalarySection>

            <SectionTitle>
              Salary Structure (%)
            </SectionTitle>

            <SalaryGrid>

              {/* Basic */}
              <SalaryInputWrapper>

                <Label>
                  Basic (%)
                </Label>

                <SalaryInput
                  type="number"
                  name="basic"
                  value={formData.basic}
                  onChange={handleChange}
                  placeholder="Basic"
                  min="0"
                />

              </SalaryInputWrapper>

              {/* House Allowance */}
              <SalaryInputWrapper>

                <Label>
                  House Allowance (%)
                </Label>

                <SalaryInput
                  type="number"
                  name="houseAllowance"
                  value={formData.houseAllowance}
                  onChange={handleChange}
                  placeholder="HRA"
                  min="0"
                />

              </SalaryInputWrapper>

              {/* Transport */}
              <SalaryInputWrapper>

                <Label>
                  Transport (%)
                </Label>

                <SalaryInput
                  type="number"
                  name="transport"
                  value={formData.transport}
                  onChange={handleChange}
                  placeholder="Transport"
                  min="0"
                />

              </SalaryInputWrapper>

              {/* Special */}
              <SalaryInputWrapper>

                <Label>
                  Special (%)
                </Label>

                <SalaryInput
                  type="number"
                  name="special"
                  value={formData.special}
                  onChange={handleChange}
                  placeholder="Special"
                  min="0"
                />

              </SalaryInputWrapper>

              {/* Total */}
              <SalaryInputWrapper>

                <Label>
                  Total (%)
                </Label>

                <TotalInput
                  type="text"
                  value={`${calculateTotal()} %`}
                  readOnly
                />

              </SalaryInputWrapper>

              {/* Working Hours */}
              <SalaryInputWrapper>

                <Label>
                  Working Hours Per Day
                </Label>

                <SalaryInput
                  type="number"
                  name="workingHoursPerDay"
                  value={
                    formData.workingHoursPerDay
                  }
                  onChange={handleChange}
                  placeholder="e.g. 8"
                  min="0"
                  max="24"
                  step="0.5"
                />

              </SalaryInputWrapper>

              {/* Half Day Hours */}
              <SalaryInputWrapper>

                <Label>
                  Half Day Hours
                </Label>

                <SalaryInput
                  type="number"
                  name="halfDayHours"
                  value={
                    formData.halfDayHours
                  }
                  onChange={handleChange}
                  placeholder="e.g. 4"
                  min="0"
                  max="24"
                  step="0.5"
                />

              </SalaryInputWrapper>

            </SalaryGrid>

          </SalarySection>

        </form>

      </MainCard>

    </PageWrapper>
  );
};

export default AddCompany;