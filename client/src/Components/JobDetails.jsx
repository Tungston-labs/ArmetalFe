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
} from "./JobDetails.Styles";

// ✅ Make JobDetails controllable by parent using ref
const JobDetails = forwardRef(({ country: propCountry, departments = [], initialValues = {}, onFormChange, errors: parentErrors }, ref) => {
  const savedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
const [localErrors, setLocalErrors] = useState({});

  const defaultCountry = propCountry || savedUser?.company?.country || "IN";
  const deptFromStore = useSelector((s) => s.departments?.list || []);
  const departmentList = departments?.length ? departments : deptFromStore;
  const [country] = useState(defaultCountry);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    designation: "",
    joining_date: "",
    department_id: "",
    employment_type: "",
    total_leave: "",
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

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length)
      setFormData((prev) => ({ ...prev, ...initialValues }));
  }, [initialValues]);


  const handleChange = (e) => {

    if (onFormChange) {
        onFormChange(e); 
    }

  };
  const validateForm = () => {
    const newErrors = {};
    const now = new Date().toISOString().split("T")[0];

    const baseRequired = [
      "designation",
      "joining_date",
      "department_id",
      "employment_type",
      "total_leave",
      "phno",
      "email",
      "dob",
      "role",
      "passport_number",
    ];

    if (country === "IN") {
      baseRequired.push("aadar_number");
    } else {
      baseRequired.push("visa_expiry_date", "insurance_number", "iqama_number");
    }

    baseRequired.forEach((field) => {
      const val = formData[field];
      if (!val || (typeof val === "string" && val.trim() === "")) {
        newErrors[field] = "This field is required";
      }
    });

    // Validate patterns
    if (formData.phno) {
      const phone = formData.phno.trim();
      if (country === "IN" && !/^[0-9]{10}$/.test(phone))
        newErrors.phno = "Enter a valid 10-digit phone number";
      else if (country !== "IN" && !/^\+?[1-9]\d{7,14}$/.test(phone))
        newErrors.phno = "Enter a valid international phone number";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email";

    if (formData.dob && formData.dob >= now)
      newErrors.dob = "Date of birth must be in the past";

    if (formData.joining_date && formData.joining_date > now)
      newErrors.joining_date = "Joining date cannot be in the future";

    if (formData.contract_expiry_date && formData.contract_expiry_date <= now)
      newErrors.contract_expiry_date = "Contract expiry must be in the future";

    if (formData.visa_expiry_date && formData.visa_expiry_date <= now)
      newErrors.visa_expiry_date = "Visa expiry must be in the future";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ expose validate to parent so it triggers when clicking Next
  useImperativeHandle(ref, () => ({
    validate: () => validateForm(),
    getData: () => formData,
  }));


  return (
    <FormContainer noValidate>
      <SectionTitle>Job Details</SectionTitle>

      <FormRow>
        <FormGroup>
          <Label>Designation</Label>
          <Input name="designation" value={formData.designation} onChange={handleChange} placeholder="Developer" />
          {errors.designation && <div style={{ color: "red", marginTop: 6 }}>{errors.designation}</div>}
        </FormGroup>

        <FormGroup>
          <Label>Joining Date</Label>
          <Input type="date" name="joining_date" value={formData.joining_date} onChange={handleChange} />
          {errors.joining_date && <div style={{ color: "red", marginTop: 6 }}>{errors.joining_date}</div>}
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label>Department</Label>
          <Select name="department_id" value={formData.department_id} onChange={handleChange}>
            <option value="">Select Department</option>
            {departmentList && departmentList.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </Select>
          {errors.department_id && <div style={{ color: "red", marginTop: 6 }}>{errors.department_id}</div>}
        </FormGroup>

        <FormGroup>
          <Label>Employment Type</Label>
          <Select name="employment_type" value={formData.employment_type} onChange={handleChange}>
            <option value="">Select Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </Select>
          {errors.employment_type && <div style={{ color: "red", marginTop: 6 }}>{errors.employment_type}</div>}
        </FormGroup>
      </FormRow>

      <FormRow>
       <FormGroup>
  <Label>Total Leave</Label>
  <Input
    type="number"
    name="total_leave"
    value={formData.total_leave}
    onChange={handleChange}
    placeholder="Total leave"
    step="0.1" 
    min="0"    
     onWheel={(e) => e.target.blur()} 
  />
  {errors.total_leave && (
    <div style={{ color: "red", marginTop: 6 }}>
      {errors.total_leave}
    </div>
  )}
</FormGroup>


        <FormGroup>
          <Label>Roles</Label>
          <Select name="role" value={formData.role} onChange={handleChange}>
            <option value="">Select Role</option>
            <option value="employee">Employee</option>
            <option value="hr">HR</option>
            <option value="manager">Manager</option>
          </Select>
          {errors.role && <div style={{ color: "red", marginTop: 6 }}>{errors.role}</div>}
        </FormGroup>
      </FormRow>
<FormRow>
    <FormGroup style={{ maxWidth: "49.5%" }}>
  <Label>Pending Leave</Label>
  <Input
    type="number"
    name="pending_leave"
    value={formData.pending_leave}
    onChange={handleChange}
    placeholder="Pending leave"
    step="0.1"
    min="0"
    onWheel={(e) => e.target.blur()} // prevent scroll wheel value change
    style={{ width: "100%" }}
  />
  {errors.pending_leave && (
    <div style={{ color: "red", marginTop: 6 }}>
      {errors.pending_leave}
    </div>
  )}
</FormGroup>

      
      </FormRow>
      <SectionTitle>Employee Legal & ID Information</SectionTitle>

      <FormRow>
        <FormGroup>
          <Label>Phone Number</Label>
          <Input name="phno" value={formData.phno} onChange={handleChange} placeholder="Phone number" />
          {errors.phno && <div style={{ color: "red", marginTop: 6 }}>{errors.phno}</div>}
        </FormGroup>

        <FormGroup>
          <Label>Passport Number</Label>
          <Input name="passport_number" value={formData.passport_number} onChange={handleChange} placeholder="Passport number" />
          {errors.passport_number && <div style={{ color: "red", marginTop: 6 }}>{errors.passport_number}</div>}
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label>Work Permit</Label>
          <Input name="workPermit" value={formData.workPermit} onChange={handleChange} placeholder="Work Permit" />
        </FormGroup>

        <FormGroup>
          <Label>Employee Contract</Label>
          <Input name="employeeContract" value={formData.employeeContract} onChange={handleChange} placeholder="Employee Contract" />
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label>Insurance Number</Label>
          <Input name="insurance_number" value={formData.insurance_number} onChange={handleChange} placeholder="Insurance number" />
          {errors.insurance_number && <div style={{ color: "red", marginTop: 6 }}>{errors.insurance_number}</div>}
        </FormGroup>

        <FormGroup>
          <Label>ID Card Photo</Label>
          <FileInputLabel htmlFor="idcard">{formData.idcard ? formData.idcard.name : "Upload ID Card +"}</FileInputLabel>
          <FileInput id="idcard" name="idcard" type="file" onChange={handleChange} />
        </FormGroup>
      </FormRow>

      {country === "IN" ? (
        <FormRow>
          <FormGroup>
            <Label>Aadhaar Number</Label>
            <Input name="aadar_number" value={formData.aadar_number} onChange={handleChange} placeholder="Aadhaar Number" />
            {errors.aadar_number && <div style={{ color: "red", marginTop: 6 }}>{errors.aadar_number}</div>}
          </FormGroup>

          <FormGroup>
            <Label>Contract Expiry Date</Label>
            <Input type="date" name="contract_expiry_date" value={formData.contract_expiry_date} onChange={handleChange} />
            {errors.contract_expiry_date && <div style={{ color: "red", marginTop: 6 }}>{errors.contract_expiry_date}</div>}
          </FormGroup>
        </FormRow>
      ) : (
        <FormRow>
          <FormGroup>
            <Label>Iqama Number</Label>
            <Input name="iqama_number" value={formData.iqama_number} onChange={handleChange} placeholder="Iqama Number" />
            {errors.iqama_number && <div style={{ color: "red", marginTop: 6 }}>{errors.iqama_number}</div>}
          </FormGroup>

          <FormGroup>
            <Label>Visa Expiry Date</Label>
            <Input type="date" name="visa_expiry_date" value={formData.visa_expiry_date} onChange={handleChange} />
            {errors.visa_expiry_date && <div style={{ color: "red", marginTop: 6 }}>{errors.visa_expiry_date}</div>}
          </FormGroup>
        </FormRow>
      )}

     
    </FormContainer>
  );
});

export default JobDetails;
