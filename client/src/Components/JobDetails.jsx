
import React, { useEffect, useState } from "react";
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
import { getDepartments } from '../Redux/departmentSlice';
import { useDispatch, useSelector } from "react-redux";
const JobDetails = ({ country: propCountry, departments = [], onNext }) => {
  const dispatch = useDispatch();

  const savedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const defaultCountry = propCountry || savedUser?.company?.country || "IN";
const departmentList = useSelector((state) => state.departments.list);
  const [country] = useState(defaultCountry);
  const [formData, setFormData] = useState({
    designation: "",
    joining_date: '',
     department_id: '',
    employment_type: '',
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
    idCardPhoto: null,
    email: "",
    dob: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {

  }, [departments]);

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


    const baseRequired = ["designation", "joining_date", " department_id: '',", "employment_type", "total_leave"];

  
    baseRequired.push("phno");


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

  
    if (formData.phno) {
      const phone = formData.phno.trim();
      if (country === "IN") {
        if (!/^[0-9]{10}$/.test(phone)) {
          newErrors.phno = "Enter a valid 10-digit phone number";
        }
      } else {
        if (!/^\+?[1-9]\d{7,14}$/.test(phone)) {
          newErrors.phno = "Enter a valid phone number with country code (e.g. +966512345678)";
        }
      }
    }

    if (formData.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        newErrors.email = "Enter a valid email address";
      }
    }


    if (formData.dob && formData.dob >= now) {
      newErrors.dob = "Date of birth must be in the past";
    }
    if (formData.joining_date && formData.joining_date > now) {
      newErrors.joining_date = "Joining date cannot be in the future";
    }
    if (formData.contract_expiry_date && formData.contract_expiry_date <= now) {
      newErrors.contract_expiry_date = "Contract expiry must be in the future";
    }
    if (formData.visa_expiry_date && formData.visa_expiry_date <= now) {
      newErrors.visa_expiry_date = "Visa expiry must be in the future";
    }


    if (country === "IN") {
      if (formData.aadar_number && !/^[0-9]{12}$/.test(formData.aadar_number.trim())) {
        newErrors.aadar_number = "Enter a valid 12-digit Aadhaar number";
      }
    } else {
      if (formData.iqama_number) {
        const iq = (formData.iqama_number + "").replace(/\D/g, "");
        if (iq.length !== 12) {
          newErrors.iqama_number = "Enter a valid 12-digit Iqama number";
        }
      }
    }

  
    if (formData.passport_number) {
      if (!/^[A-Za-z0-9]{6,9}$/.test(formData.passport_number.trim())) {
        newErrors.passport_number = "Enter a valid passport number (6–9 chars)";
      }
    }

    if (formData.insurance_number && formData.insurance_number.trim().length < 5) {
      newErrors.insurance_number = "Insurance number must be at least 5 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

useEffect(() => {
  if (departmentList.length === 0) {
    dispatch(getDepartments({ page: 1, search: '' }));
  }
}, [dispatch, departmentList]);


  const buildUploadFormData = (plain) => {
    const fd = new FormData();
    Object.entries(plain).forEach(([k, v]) => {
      if (v === null || v === undefined) return;
      // backend expects idcard or id_card? adapt here if needed
      if (k === "idCardPhoto" && v instanceof File) {
        fd.append("idcard", v);
      } else {
        fd.append(k, v);
      }
    });
    return fd;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const plain = { ...formData };
    const uploadForm = buildUploadFormData(plain);

    if (typeof onNext === "function") {
      onNext(plain, uploadForm);
      return;
    }

    console.log("Validated plain data:", plain);
    for (const pair of uploadForm.entries()) {
      console.log("FormData entry:", pair[0], pair[1]);
    }
  };

  return (
    <FormContainer onSubmit={submitHandler} noValidate>
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
          {errors.designation && <div style={{ color: "red", marginTop: 6 }}>{errors.designation}</div>}
        </FormGroup>

        <FormGroup>
          <Label>Joining Date</Label>
          <Input
            type="date"
            name="joining_date"
            value={formData.joining_date}
            onChange={handleChange}
          />
          {errors.joining_date && <div style={{ color: "red", marginTop: 6 }}>{errors.joining_date}</div>}
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label>Department</Label>
          <Select name="department_id" 
          value={formData.department_id} 
          onChange={handleChange}>
            <option value="">Select Department</option>
             {departmentList.map((dept) => (
      <option key={dept.id} value={dept.id}>
        {dept.name}
      </option>
                ))}
            
          </Select>
          {errors.department_id && <div style={{ color: "red", marginTop: 6 }}>{errors.department_id}</div>}
        </FormGroup>

        <FormGroup>
          <Label>Employment Type</Label>
          <Select name="employment_type" value={formData.employment_type} onChange={handleChange}>
            <option value="">Select Type</option>
            <option value="fulltime">Full time</option>
            <option value="parttime">Part time</option>
            <option value="contract">Contract</option>
          </Select>
          {errors.employment_type && <div style={{ color: "red", marginTop: 6 }}>{errors.employment_type}</div>}
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label>Total Leave</Label>
          <Input name="total_leave" placeholder="Total leave" value={formData.total_leave} onChange={handleChange} />
          {errors.total_leave && <div style={{ color: "red", marginTop: 6 }}>{errors.total_leave}</div>}
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
          <Label>Employee Phone Number</Label>
          <Input name="phno" placeholder="Employee phone number" value={formData.phno} onChange={handleChange} />
          {errors.phno && <div style={{ color: "red", marginTop: 6 }}>{errors.phno}</div>}
        </FormGroup>

        <FormGroup>
          <Label>Passport Number</Label>
          <Input name="passport_number" placeholder="Passport number" value={formData.passport_number} onChange={handleChange} />
          {errors.passport_number && <div style={{ color: "red", marginTop: 6 }}>{errors.passport_number}</div>}
        </FormGroup>
      </FormRow>

      <FormRow>
        <FormGroup>
          <Label>Work Permit</Label>
          <Input name="workPermit" placeholder="Work Permit" value={formData.workPermit} onChange={handleChange} />
        </FormGroup>


        <FormGroup>
          <Label>Employee Contract</Label>
          <Input name="employeeContract" placeholder="Employee Contract" value={formData.employeeContract} onChange={handleChange} />
        </FormGroup>
      </FormRow>

      <FormRow>
     
        <FormGroup>
          <Label>Insurance Number</Label>
          <Input name="insurance_number" placeholder="Insurance number" value={formData.insurance_number} onChange={handleChange} />
          {errors.insurance_number && <div style={{ color: "red", marginTop: 6 }}>{errors.insurance_number}</div>}
        </FormGroup>


        <FormGroup>
          <Label>ID Card Photo</Label>
          <FileInputLabel htmlFor="idCardPhoto">{formData.idCardPhoto ? formData.idCardPhoto.name : "Upload ID Card +"}</FileInputLabel>
          <FileInput id="idCardPhoto" name="idCardPhoto" type="file" onChange={handleChange} />
        </FormGroup>

      </FormRow>


      {country === "IN" ? (
        <FormRow>
          <FormGroup>
            <Label>Aadhaar Number</Label>
            <Input name="aadar_number" placeholder="Aadhaar Number" value={formData.aadar_number} onChange={handleChange} />
            {errors.aadar_number && <div style={{ color: "red", marginTop: 6 }}>{errors.aadar_number}</div>}
          </FormGroup>

          <FormGroup>
            <Label>Contract Expiry Date</Label>
            <Input type="date" name="contractExpiryDate" value={formData.contractExpiryDate} onChange={handleChange} />
            {errors.contractExpiryDate && <div style={{ color: "red", marginTop: 6 }}>{errors.contractExpiryDate}</div>}
          </FormGroup>
        </FormRow>
      ) : (
        <FormRow>
          <FormGroup>
            <Label>Iqama Number</Label>
            <Input name="iqama_number" placeholder="Iqama Number" value={formData.iqama_number} onChange={handleChange} />
            {errors.iqama_number && <div style={{ color: "red", marginTop: 6 }}>{errors.iqama_number}</div>}
          </FormGroup>

          <FormGroup>
            <Label>Insurance Number</Label>
            <Input name="insurance_number" placeholder="Insurance number" value={formData.insurance_number} onChange={handleChange} />
            {errors.insurance_number && <div style={{ color: "red", marginTop: 6 }}>{errors.insurance_number}</div>}
          </FormGroup>

          <FormGroup>
          <Label>Visa Expiry Date</Label>
          <Input type="date" name="visaExpiryDate" value={formData.visaExpiryDate} onChange={handleChange} />
          {errors.visaExpiryDate && <div style={{ color: "red", marginTop: 6 }}>{errors.visaExpiryDate}</div>}
        </FormGroup>
        </FormRow>
      )}

      

      <ButtonWrapper>
        <NextButton type="submit">Next</NextButton>
      </ButtonWrapper>
    </FormContainer>
  );
};

export default JobDetails;
