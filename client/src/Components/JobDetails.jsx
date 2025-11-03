import React, { useState } from "react";
import {
  FormContainer,
  SectionTitle,
  FormRow,
  FormGroup,
  Label,
  Input,
  Select,
  FileInputLabel,
  FileInput,
  ButtonWrapper,
  NextButton,
} from "./JobDetails.Styles";

const Table = () => {
  const [formData, setFormData] = useState({
    designation: "",
    joiningDate: "",
    department: "",
    jobType: "",
    manager: "",
    project: "",
    totalLeave: "",
    phoneNumber: "",
    iqamaNumber: "",
    passportNumber: "",
    employeeContract: "",
    workPermit: "",
    insuranceNumber: "",
    visaExpiryDate: "",
    idCardPhoto: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <SectionTitle>Job Details</SectionTitle>

      <FormRow>
        <FormGroup>
          <Label>Designation</Label>
          <Input
            name="designation"
            placeholder="Developer"
            value={formData.designation}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Joining Date</Label>
          <Input
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
          />
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label>Department</Label>
          <Select
            name="department"
            value={formData.department}
            onChange={handleChange}
          >
            <option value="">Select Department</option>
            <option value="development">Development</option>
            <option value="design">Design</option>
            <option value="hr">HR</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label>Employment Type</Label>
          <Select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            <option value="fulltime">Full time</option>
            <option value="parttime">Part time</option>
            <option value="contract">Contract</option>
          </Select>
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label>Manager</Label>
          <Input
            name="manager"
            placeholder="Pranav G"
            value={formData.manager}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Project</Label>
          <Input
            name="project"
            placeholder="Development"
            value={formData.project}
            onChange={handleChange}
          />
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label>Total Leave</Label>
          <Input
            name="totalLeave"
            placeholder="Total leave"
            value={formData.totalLeave}
            onChange={handleChange}
          />
        </FormGroup>
      </FormRow>

      <SectionTitle>Employee Legal & ID Information</SectionTitle>

      <FormRow>
        <FormGroup>
          <Label>Employee Phone Number</Label>
          <Input
            name="phoneNumber"
            placeholder="Employee phone number"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Iqama Number</Label>
          <Input
            name="iqamaNumber"
            placeholder="Iqama Number"
            value={formData.iqamaNumber}
            onChange={handleChange}
          />
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label>Passport Number</Label>
          <Input
            name="passportNumber"
            placeholder="Passport number"
            value={formData.passportNumber}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Employee Contract</Label>
          <Input
            name="employeeContract"
            placeholder="Employee Contract"
            value={formData.employeeContract}
            onChange={handleChange}
          />
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label>Work Permit</Label>
          <Input
            name="workPermit"
            placeholder="Work Permit"
            value={formData.workPermit}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Insurance Number</Label>
          <Input
            name="insuranceNumber"
            placeholder="Insurance number"
            value={formData.insuranceNumber}
            onChange={handleChange}
          />
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label>Visa Expiry Date</Label>
          <Input
            type="date"
            name="visaExpiryDate"
            value={formData.visaExpiryDate}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>ID Card Photo</Label>
          <FileInputLabel htmlFor="idCardPhoto">Upload ID Card +</FileInputLabel>
          <FileInput
            id="idCardPhoto"
            name="idCardPhoto"
            type="file"
            onChange={handleChange}
          />
        </FormGroup>
      </FormRow>

      <ButtonWrapper>
        <NextButton type="submit">Next</NextButton>
      </ButtonWrapper>
    </FormContainer>
  );
};

export default Table;
