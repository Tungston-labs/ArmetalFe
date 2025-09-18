import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  submitEmployee,
  setEmployeeId,
  setBasicFormData,
} from '../../Redux/employeeSlice';
import { getDepartments } from '../../Redux/departmentSlice';
import { useNavigate } from 'react-router-dom';
import UnsavedChangesGuard from "../../Components/UnsavedChangesGuard";

import {
  Container,
  Header,
  Title,
  Subtitle,
  Hr,
  ColumnRow,
  InfoGrid,
  FlexRow,
  ProfileImage,
  ApproveButton,
  IconWrapper,
  FullWidthInput,
  TwoColumn,
  TwoColumnRow,
  TwoColumnRows,
  SectionTitle,
  Input,
  InfoSection,
  Label,
} from './BasicLevel.Styles';

import Multistep from '../../Components/Multistep';
import { PiUserCirclePlusThin } from "react-icons/pi";
import { FaPlus } from 'react-icons/fa';
import Loader from "../../Components/Loader"
import EmployeeIcon from "../../assets/employeeicon.svg";

export default function AddEmployeeForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, formData: reduxFormData } = useSelector((state) => state.employee);
  const departmentList = useSelector((state) => state.departments.list);

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const stepTitles = ['Basic Info', 'Job Details', 'Legal Info'];

  const user = JSON.parse(localStorage.getItem("user")||sessionStorage.getItem("user"));
  const country = user?.company?.country;

  

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phno: '',
    address: '',
    dob: '',
    gender: '',
    designation: '',
    joining_date: '',
    department_id: '',
    employment_type: '',
    passport_number: '',
    visa_expiry_date: '',
    iqama_number: '',
    aadar_number: '',
    insurance_number: '',
    profile_pic: null,
    total_leave: '',
    role: '', 
    contract_expiry_date: '', 
    idcard: null, 
  });

  // Load department list
  useEffect(() => {
    if (departmentList.length === 0) {
      dispatch(getDepartments({ page: 1, search: '' }));
    }
  }, [reduxFormData, dispatch, departmentList]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    dispatch(setBasicFormData({ ...formData, [name]: value }));
    setIsFormDirty(true);
  };
console.log({country});

  // Validate before submit
 // Validate before submit
const validateForm = () => {
  const newErrors = {};

  const {
    dob,
    joining_date,
    contract_expiry_date,
    visa_expiry_date,
    passport_number,
    insurance_number,
    aadar_number,
    iqama_number,
  } = formData;

  const requiredFields = [
    "name", "address", "email", "dob", "phno", "gender", "designation",
    "department_id", "employment_type", "joining_date", "passport_number",
    "total_leave", "contract_expiry_date", "role",
  ];
  if (country !== "IN")
    requiredFields.push("visa_expiry_date", "insurance_number", "iqama_number");
  if (country === "IN") requiredFields.push("aadar_number");

  requiredFields.forEach((field) => {
    if (!formData[field] || !formData[field].toString().trim()) {
      newErrors[field] = "This field is required";
    }
  });

  // Phone
  const phoneRegex = /^[0-9]{10}$/;
// --- Phone Validation ---
if (formData.phno) {
  if (country === "IN") {
    // ✅ India: strict 10-digit numbers
    const indiaRegex = /^[0-9]{10}$/;
    if (!indiaRegex.test(formData.phno.trim())) {
      newErrors.phno = "Enter a valid 10-digit phone number";
    }
  } else {
    // 🌍 Other countries: E.164 international format
    const intlRegex = /^\+?[1-9]\d{7,14}$/;
    if (!intlRegex.test(formData.phno.trim())) {
      newErrors.phno = "Enter a valid phone number with country code (e.g. +966512345678)";
    }
  }
}


  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.email && !emailRegex.test(formData.email.trim())) {
    newErrors.email = "Enter a valid email address";
  }

  // --- Date Validations ---
  const today = new Date().toISOString().split("T")[0];
  if (dob && dob >= today) {
    newErrors.dob = "Date of birth must be in the past";
  }
  if (joining_date && joining_date > today) {
    newErrors.joining_date = "Joining date cannot be in the future";
  }
  if (contract_expiry_date && contract_expiry_date <= today) {
    newErrors.contract_expiry_date = "Contract expiry must be in the future";
  }
  if (visa_expiry_date && visa_expiry_date <= today) {
    newErrors.visa_expiry_date = "Visa expiry must be in the future";
  }

  // Aadhaar
  const twelveDigitRegex = /^[0-9]{12}$/;
  if (country === "IN") {
    if (!aadar_number || !twelveDigitRegex.test(aadar_number.trim())) {
      newErrors.aadar_number = "Enter a valid 12-digit Aadhaar number";
    }
  } else {
    const iqama = iqama_number?.replace(/\D/g, "");
    if (!iqama || iqama.length !== 12) {
      newErrors.iqama_number = "Enter a valid 12-digit Iqama number";
    }
  }

  // Passport
  if (passport_number && !/^[A-Za-z0-9]{6,9}$/.test(passport_number.trim())) {
    newErrors.passport_number = "Enter a valid passport number (6–9 chars)";
  }

  // Insurance
  if (insurance_number && insurance_number.trim().length < 5) {
    newErrors.insurance_number = "Insurance number must be at least 5 characters";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  // Submit form
  const handleSubmit = () => {
    if (!validateForm()) return;

    dispatch(submitEmployee({ basic: formData }))
      .then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          const id = res.payload?.employee?.id || res.payload?.id;
          if (id) {
            dispatch(setEmployeeId(id));
            dispatch(setBasicFormData(formData));
            setIsFormDirty(false);
            navigate('/bank-payment');
          }
        } else {
          const backendErrors = res.payload;
          if (backendErrors && typeof backendErrors === 'object') {
            const newErrors = {};
            for (const field in backendErrors) {
              newErrors[field] = Array.isArray(backendErrors[field])
                ? backendErrors[field][0]
                : backendErrors[field];
            }
            setErrors(newErrors);
          }
        }
      });
  };

  return (
    <Container>
      {/* Unsaved changes guard */}
      <UnsavedChangesGuard isDirty={isFormDirty} />

      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src={EmployeeIcon} alt="employeeIcon" style={{ height: "60px" }} />
          <div>
            <Title>Employee</Title>
            <Subtitle>Manage your Employee.</Subtitle>
          </div>
        </div>
      </Header>

      <Hr />

      {/* Multistep progress bar */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '50%' }}>
          <Multistep currentStep={currentStep} steps={stepTitles} />
        </div>
      </div>

      {/* Basic Info Section */}
      <InfoGrid>
        {/* Profile Picture Upload */}
        <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
  <label htmlFor="profile-upload" style={{ cursor: 'pointer' }}>
    {formData.profile_pic ? (
      <ProfileImage
        src={URL.createObjectURL(formData.profile_pic)}
        alt="Employee"
      />
    ) : (
      <IconWrapper>
        <PiUserCirclePlusThin size={50} />
      </IconWrapper>
    )}
  </label>

  {/* Small "+" button (optional, keep if you want it visible) */}
  <label
    htmlFor="profile-upload"
    style={{
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      background: '#001F3F',
      color: 'white',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      cursor: 'pointer',
    }}
  >
    +
  </label>

  {/* Hidden file input */}
  <input
    id="profile-upload"
    type="file"
    accept="image/*"
    onChange={(e) => {
      setFormData((prev) => ({ ...prev, profile_pic: e.target.files[0] }));
      setIsFormDirty(true);
    }}
    style={{ display: 'none' }}
  />
</div>


        {/* Name & Email */}
        <TwoColumn>
          <div style={{marginTop:"-10px"}}> 
            {errors.name && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.name}</p>}
            <Label>Name</Label>
            <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} autoComplete="off" />
          </div>
          <div style={{marginTop:"5px"}}>
            {errors.email && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.email}</p>}
            <Label>Email</Label>
            <Input name="email" placeholder="Email ID" value={formData.email} onChange={handleChange} autoComplete="off" />
          </div>
        </TwoColumn>

        {/* Address, DOB, Gender */}
        <InfoSection>
          <div>
            {errors.address && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.address}</p>}
              <Label>Address</Label>
            <FullWidthInput name="address" placeholder="Address" value={formData.address} onChange={handleChange} autoComplete="off"/>
          </div>

          <TwoColumnRow>
            <div >
              {errors.dob && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.dob}</p>}
                <Label>Date of Birth</Label>
              <Input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                autoComplete="off"
              />
            </div>
            <div>
              {errors.gender && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.gender}</p>}
                <Label>Gender</Label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                autoComplete="off"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  fontSize: '0.9rem',
                  borderRadius: '7px',
                  border:"1px solid #052DB4",
                  background:"#FFF",
                  color: 'black',
                }}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </TwoColumnRow>
        </InfoSection>
      </InfoGrid>

      <Hr />

      {/* Job Details */}
      <SectionTitle>Job Details</SectionTitle>

      <TwoColumnRows>
        <div>
          {errors.department_id && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.department_id}</p>}
            <Label>Department</Label>
          <select
          
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
            autoComplete="off"
            style={{
              width: '100%',
              padding: '0.7rem',
              borderRadius: '7px',
              border: '1px solid #052DB4',
              background: '#FFF',
              marginTop:"5px"
            }}
          >
            <option value="">Select Department</option>
            {departmentList.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
        <div>
          {errors.employment_type && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.employment_type}</p>}
            <Label>Employee Type</Label>
          <select
            name="employment_type"
            value={formData.employment_type}
            onChange={handleChange}
            autoComplete="off"
            style={{
              width: '100%',
              padding: '0.7rem',
              fontSize: '0.8rem',
              borderRadius: '7px',
              border:"1px solid #052DB4",
              background:"#FFF",
              color: 'black',
               marginTop:"5px"
            }}
          >
            <option value="">Select Employment Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
      </TwoColumnRows>

      <TwoColumnRows >
        <div>
          {errors.designation && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.designation}</p>}
          <Label>Designation</Label>
          <Input      
           style={{marginTop:"5px"}} name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} autoComplete="off" />
        </div>
        <div>
          {errors.joining_date && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.joining_date}</p>}
            <Label>Joining Date</Label>
          <Input style={{marginTop:"5px"}}
            type="date"
            name="joining_date"
            value={formData.joining_date}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
      </TwoColumnRows>

      <TwoColumnRows>
        <div>
          {errors.total_leave && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.total_leave}</p>}
            <Label>Total Leaves</Label>
          <Input
          style={{marginTop:"5px"}}
            name="total_leave"
            placeholder="Total Leaves"
            value={formData.total_leave}
            onChange={handleChange}
            autoComplete="off"
            type="number"
            min="0"
          />
        </div>
        <div >
          {errors.role && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.role}</p>}
            <Label>Roles</Label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            autoComplete="off"
            style={{
              width: '100%',
              padding: '0.7rem',
              fontSize: '0.8rem',
              borderRadius: '7px',
              border: '1px solid #052DB4',
              background: '#FFF',
              color: 'black',
            }}
          >
            <option value="">Select Role</option>
            <option value="employee">Employee</option>
            <option value="hr">HR</option>
            <option value="manager">Manager</option>
          </select>
        </div>
      </TwoColumnRows>

      {/* Legal & ID Info */}
      <SectionTitle>Employee Legal & ID Information</SectionTitle>

<ColumnRow>
  {[
    { key: 'phno', label: 'Phone Number' },
    { key: 'passport_number', label: 'Passport Number' },
    ...(country === "IN"
      ? [
          { key: 'aadar_number', label: 'Aadhaar Number' }
        ]
      : [
          { key: 'visa_expiry_date', label: 'Visa Expiry Date', type: 'date' },
          { key: 'iqama_number', label: 'Iqama Number' },
          { key: 'insurance_number', label: 'Insurance Number' },
        ]),
    { key: 'contract_expiry_date', label: 'Contract Expiry Date', type: 'date' },
    { key: 'idcard', label: 'ID Card' },
  ].map(({ key, label, type }) => (
    <div key={key} style={{ marginBottom: '1rem' }}>
      <label
        htmlFor={key}
        style={{
          display: 'block',
          marginBottom: '0.4rem',
          fontSize: '0.9rem',
          fontWeight: '500',
          color: '#3352BA'
        }}
      >
        {label}
      </label>

      {errors[key] && (
        <p style={{ color: 'red', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
          {errors[key]}
        </p>
      )}

      {key === 'idcard' ? (
        <div
          onClick={() => document.getElementById('idcard-upload').click()}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #052DB4',
            borderRadius: '7px',
            padding: '0.7rem',
            cursor: 'pointer',
            backgroundColor: '#fff',
            fontSize: '0.9rem',
          }}
        >
          <span
            style={{
              flex: 1,
              color: formData.idcard ? '#000' : '#999',
              fontSize: '0.8rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {formData.idcard?.name || 'Choose file'}
          </span>
          <FaPlus style={{ color: '#3352BA', fontSize: '1rem', marginLeft: '0.5rem' }} />
          <input
            id="idcard-upload"
            type="file"
            name="idcard"
            accept="image/*"
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, idcard: e.target.files[0] }));
              setIsFormDirty(true);
            }}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <Input
          id={key}
          name={key}
          placeholder={label}
          type={type || 'text'}
          value={formData[key]}
          onChange={handleChange}
        />
      )}
    </div>
  ))}
</ColumnRow>



      {/* Next button */}
      <FlexRow>
        <ApproveButton onClick={handleSubmit}>Next</ApproveButton>
      </FlexRow>

      {status === "loading" && <Loader size="large" tip="Loading..." />}
    </Container>
  );
}
