import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
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
  ErrorText,
  TotalLeaveBox,
  LeaveContainer,
  AddLeaveButton,
  LeaveItem,
  LeaveLabel,
  LeaveInput,

} from "./JobDetails.Styles";

const JobDetails = forwardRef(({ country: propCountry, departments = [], initialValues = {}, onFormChange, errors: parentErrors }, ref) => {
  const savedUser = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}");
  const defaultCountry = propCountry || savedUser?.company?.country || "IN";
  const deptFromStore = useSelector(s => s.departments?.list || []);
  const departmentList = departments?.length ? departments : deptFromStore;

  const [formData, setFormData] = useState({
    designation: "",
    joining_date: "",
    department_id: "",
    employment_type: "",
    total_leave: 0,
    casual_leave: "",
    sick_leave: "",
    earned_leave: "",
    maternity_leave: "",
    other_leave: "",
    role: "",
    phno: "",
    iqama_number: "",
    passport_number: "",
    employeeContract: "",
    workPermit: "",
    insurance_number: "",
    visa_expiry_date: "",
    contract_expiry_date: "",
    aadar_number: "",
    idcard: null,
    email: "",
    dob: "",
    ...initialValues,
  });

  const [errors, setErrors] = useState({});
  const [country] = useState(defaultCountry);

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length) setFormData(prev => ({ ...prev, ...initialValues }));
  }, [initialValues]);
  useEffect(() => {
    const total =
      (Number(formData.casual_leave) || 0) +
      (Number(formData.sick_leave) || 0) +
      (Number(formData.earned_leave) || 0) +
      (Number(formData.maternity_leave) || 0) +
      (Number(formData.other_leave) || 0);

    setFormData(prev => ({
      ...prev,
      total_leave: total
    }));

    if (onFormChange) {
      onFormChange({
        target: {
          name: "total_leave",
          value: total
        }
      });
    }

  }, [
    formData.casual_leave,
    formData.sick_leave,
    formData.earned_leave,
    formData.maternity_leave,
    formData.other_leave
  ]);
const handleChange = (e) => {
  const { name, value, files, type } = e.target;

  if (type === "file") {
    const file = files?.[0];

    if (!file) {
      setFormData((prev) => ({ ...prev, [name]: null }));
      if (onFormChange) onFormChange(e);
      return;
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Only JPG, JPEG, PNG and WEBP images are allowed.",
      }));
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Image size must be less than 5 MB.",
      }));
      return;
    }

    // Clear previous error
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));

    if (onFormChange) {
      onFormChange({
        target: {
          name,
          value: file,
          files: [file],
          type: "file",
        },
      });
    }

    return;
  }

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  if (onFormChange) onFormChange(e);
};

  const validateForm = () => {
    const newErrors = {};
    const now = new Date().toISOString().split("T")[0];
    const baseRequired = ["designation", "joining_date", "department_id", "employment_type", "total_leave", "phno", "email", "dob", "role",];
  const totalLeave =
    (Number(formData.casual_leave) || 0) +
    (Number(formData.sick_leave) || 0) +
    (Number(formData.earned_leave) || 0) +
    (Number(formData.maternity_leave) || 0) +
    (Number(formData.other_leave) || 0);

  if (totalLeave === 0) {
    newErrors.leave = "Please enter at least one leave.";
  }
    if (country === "IN") baseRequired.push("aadar_number");
    else baseRequired.push("visa_expiry_date", "insurance_number", "iqama_number");

    baseRequired.forEach(field => {
      if (!formData[field] || (typeof formData[field] === "string" && formData[field].trim() === "")) newErrors[field] = "This field is required";
    });
    if (country === "IN" && formData.aadar_number && !/^[0-9]{12}$/.test(formData.aadar_number)) {
      newErrors.aadar_number = "Aadhaar number must be exactly 12 digits";
    }
    if (formData.phno) {
      const phone = formData.phno.trim();
      if (country === "IN" && !/^[0-9]{10}$/.test(phone)) newErrors.phno = "Enter a valid 10-digit phone number";
      else if (country !== "IN" && !/^\+?[1-9]\d{7,14}$/.test(phone)) newErrors.phno = "Enter a valid international phone number";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter a valid email";
    if (formData.dob && formData.dob >= now) newErrors.dob = "Date of birth must be in the past";
    if (formData.joining_date && formData.joining_date > now) newErrors.joining_date = "Joining date cannot be in the future";
    if (formData.contract_expiry_date && formData.contract_expiry_date <= now) newErrors.contract_expiry_date = "Contract expiry must be in the future";
    if (formData.visa_expiry_date && formData.visa_expiry_date <= now) newErrors.visa_expiry_date = "Visa expiry must be in the future";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useImperativeHandle(ref, () => ({
    validate: () => validateForm(),
    getData: () => formData,
  }));

  const renderError = (field) => <>{errors[field] && <ErrorText>{errors[field]}</ErrorText>}</>;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
  return (
    <FormContainer noValidate>
      <SectionTitle>Job Details</SectionTitle>

      <FormRow>
        <FormGroup>
          <Label>Designation</Label>
          <Input name="designation" value={formData.designation} onChange={handleChange} placeholder="Enter Designation" autoComplete="off" />
          {renderError("designation")}
        </FormGroup>

        <FormGroup>
          <Label>Joining Date</Label>
          <Input type="date" name="joining_date" value={formData.joining_date} onChange={handleChange} autoComplete="off" />
          {renderError("joining_date")}
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label>Department</Label>
          <Select name="department_id" value={formData.department_id} onChange={handleChange}  >
            <option value="">Select Department</option>
            {departmentList.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
          {renderError("department_id")}
        </FormGroup>

        <FormGroup>
          <Label>Employment Type</Label>
          <Select name="employment_type" value={formData.employment_type} onChange={handleChange} >
            <option value="">Select Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </Select>
          {renderError("employment_type")}
        </FormGroup>
      </FormRow>

      <FormRow>
      <FormGroup>
  <Label>Leave Allocation</Label>

  <TotalLeaveBox>
    Total Leave : {formData.total_leave}
  </TotalLeaveBox>

  {errors.leave && <ErrorText>{errors.leave}</ErrorText>}
  <LeaveItem>
    <LeaveLabel>Casual Leave</LeaveLabel>
    <LeaveInput
      type="number"
      name="casual_leave"
      value={formData.casual_leave}
      onChange={handleChange}
    />
  </LeaveItem>

  <LeaveItem>
    <LeaveLabel>Sick Leave</LeaveLabel>
    <LeaveInput
      type="number"
      name="sick_leave"
      value={formData.sick_leave}
      onChange={handleChange}
    />
  </LeaveItem>

  <LeaveItem>
    <LeaveLabel>Earned Leave</LeaveLabel>
    <LeaveInput
      type="number"
      name="earned_leave"
      value={formData.earned_leave}
      onChange={handleChange}
    />
  </LeaveItem>

  <LeaveItem>
    <LeaveLabel>Maternity Leave</LeaveLabel>
    <LeaveInput
      type="number"
      name="maternity_leave"
      value={formData.maternity_leave}
      onChange={handleChange}
    />
  </LeaveItem>

  <LeaveItem>
    <LeaveLabel>Other Leave</LeaveLabel>
    <LeaveInput
      type="number"
      name="other_leave"
      value={formData.other_leave}
      onChange={handleChange}
    />
  </LeaveItem>

</FormGroup>

        <FormGroup>
          <Label>Roles</Label>
          <Select name="role" value={formData.role} onChange={handleChange}>
            <option value="">Select Role</option>
            <option value="employee">Employee</option>
            <option value="hr">HR</option>
            <option value="manager">Manager</option>
          </Select>
          {renderError("role")}
        </FormGroup>
      </FormRow>

      <SectionTitle>Employee Legal & ID Information</SectionTitle>

      <FormRow>
        <FormGroup>
          <Label>Phone Number</Label>
          <Input name="phno" value={formData.phno} onChange={handleChange} placeholder="Enter Phone number" autoComplete="off" />
          {renderError("phno")}
        </FormGroup>

        <FormGroup>
          <Label>Passport Number</Label>
          <Input name="passport_number" value={formData.passport_number} onChange={handleChange} placeholder="Enter Passport number" autoComplete="off" />
          {renderError("passport_number")}
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label>Employee Contract</Label>
          <Input name="employeeContract" value={formData.employeeContract} onChange={handleChange} placeholder="Enter Contract Name" autoComplete="off" />
        </FormGroup>

        <FormGroup>
          <Label>Work Permit</Label>
          <Input name="workPermit" value={formData.workPermit} onChange={handleChange} placeholder="Enter Work Permit" autoComplete="off" />
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label>Insurance Number</Label>
          <Input name="insurance_number" value={formData.insurance_number} onChange={handleChange} placeholder="Enter Insurance Number" autoComplete="off" />
          {renderError("insurance_number")}
        </FormGroup>

        <FormGroup>
          <Label>ID Card Photo</Label>
          <FileInputLabel htmlFor="idcard">{formData.idcard?.name || "Upload ID Card +"}</FileInputLabel>
          <FileInput id="idcard" name="idcard" type="file" onChange={handleChange} />
          {errors.idcard && <ErrorText>{errors.idcard}</ErrorText>}
        </FormGroup>
      </FormRow>

      {country === "IN" ? (
        <FormRow>
          <FormGroup>
            <Label>Aadhaar Number</Label>
            <Input
              name="aadar_number"
              value={formData.aadar_number}
              onChange={handleChange}
              placeholder="Enter Aadhaar Number"
              autoComplete="off"
              maxLength={12}
              onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) e.preventDefault();
              }}
            />            {renderError("aadar_number")}
          </FormGroup>

          <FormGroup>
            <Label>Contract Expiry Date</Label>
            <Input type="date" name="contract_expiry_date" value={formData.contract_expiry_date} onChange={handleChange} autoComplete="off" />
            {renderError("contract_expiry_date")}
          </FormGroup>
        </FormRow>
      ) : (
        <FormRow>
          <FormGroup>
            <Label>Iqama Number</Label>
            <Input name="iqama_number" value={formData.iqama_number} onChange={handleChange} placeholder=" Enter Iqama Number" autoComplete="off" />
            {renderError("iqama_number")}
          </FormGroup>

          <FormGroup>
            <Label>Visa Expiry Date</Label>
            <Input type="date" name="visa_expiry_date" value={formData.visa_expiry_date} onChange={handleChange} autoComplete="off" />
            {renderError("visa_expiry_date")}
          </FormGroup>
        </FormRow>
      )}


    </FormContainer>
  );
});

export default JobDetails;
