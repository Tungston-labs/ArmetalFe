// src/Components/JobDetails.jsx
import React, { useEffect, useState } from "react";
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
  ButtonWrapper,
  NextButton,
} from "./JobDetails.Styles";

const JobDetails = ({ country: propCountry, departments = [], initialValues = {}, onNext, }) => {
  const savedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const defaultCountry = propCountry || savedUser?.company?.country || "IN";

  // Accept departments prop, otherwise fallback to store
  const deptFromStore = useSelector((s) => s.departments?.list || []);
  const departmentList = (departments && departments.length) ? departments : deptFromStore;
const [loading, setLoading] = useState(false);

  const [country] = useState(defaultCountry);

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
    ...initialValues, // merge initial values if any
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // if parent changed initialValues after mount, sync
    if (initialValues && Object.keys(initialValues).length) {
      setFormData((prev) => ({ ...prev, ...initialValues }));
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files && files[0] ? files[0] : null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const now = new Date().toISOString().split("T")[0];

    const baseRequired = ["designation", "joining_date", "department_id", "employment_type", "total_leave", "phno", "email", "dob"];

    if (country === "IN") {
      baseRequired.push("aadar_number");
    } else {
      baseRequired.push("visa_expiry_date", "insurance_number", "iqama_number");
    }

    baseRequired.forEach((f) => {
      const val = formData[f];
      if (val === undefined || val === null || (typeof val === "string" && val.trim() === "")) {
        newErrors[f] = "This field is required";
      }
    });

    // phone
    if (formData.phno) {
      const phone = formData.phno.toString().trim();
      if (country === "IN") {
        if (!/^[0-9]{10}$/.test(phone)) newErrors.phno = "Enter a valid 10-digit phone number";
      } else {
        if (!/^\+?[1-9]\d{7,14}$/.test(phone)) newErrors.phno = "Enter a valid phone number with country code (e.g. +966512345678)";
      }
    }

    if (formData.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) newErrors.email = "Enter a valid email address";
    }

    if (formData.dob && formData.dob >= now) newErrors.dob = "Date of birth must be in the past";
    if (formData.joining_date && formData.joining_date > now) newErrors.joining_date = "Joining date cannot be in the future";
    if (formData.contract_expiry_date && formData.contract_expiry_date <= now) newErrors.contract_expiry_date = "Contract expiry must be in the future";
    if (formData.visa_expiry_date && formData.visa_expiry_date <= now) newErrors.visa_expiry_date = "Visa expiry must be in the future";
    if (country === "IN") {
      if (formData.aadar_number && !/^[0-9]{12}$/.test((formData.aadar_number + "").trim())) {
        newErrors.aadar_number = "Enter a valid 12-digit Aadhaar number";
      }
    } else {
      if (formData.iqama_number) {
        const iq = (formData.iqama_number + "").replace(/\D/g, "");
        if (iq.length !== 12) newErrors.iqama_number = "Enter a valid 12-digit Iqama number";
      }
    }
    if (formData.passport_number && !/^[A-Za-z0-9]{6,9}$/.test((formData.passport_number + "").trim())) {
      newErrors.passport_number = "Enter a valid passport number (6–9 chars)";
    }

    if (formData.insurance_number && (formData.insurance_number + "").trim().length < 5) {
      newErrors.insurance_number = "Insurance number must be at least 5 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildUploadFormData = (plain) => {
    const fd = new FormData();
    Object.entries(plain).forEach(([k, v]) => {
      if (v === null || v === undefined) return;
      if (k === "idcard" && v instanceof File) {
        fd.append("idcard", v);
      } else if (v instanceof File) {
        fd.append(k, v);
      } else {
        fd.append(k, v);
      }
    });
    return fd;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (typeof validateParent === "function" && !validateParent()) return;
  if (!validateForm()) return;

  setLoading(true); // show loader

  try {
    const plain = { ...formData };
    const uploadForm = buildUploadFormData(plain);

    // simulate delay or call parent handler
    if (typeof onNext === "function") {
      await onNext(plain, uploadForm);
    } else {
      console.log("JobDetails validated:", plain);
    }
  } catch (error) {
    console.error("Submission error:", error);
  } finally {
    setLoading(false); // hide loader after process
  }
};



  return (
    <FormContainer onSubmit={handleSubmit} noValidate>
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

      <ButtonWrapper>
        <NextButton type="submit" onClick={handleSubmit}>Next</NextButton>
      </ButtonWrapper>
    </FormContainer>
  );
};

export default JobDetails;
