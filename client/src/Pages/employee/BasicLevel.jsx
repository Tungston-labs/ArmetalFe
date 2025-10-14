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
  EmployeeImage,
  Select,
  UploadWrapper,
  FileName,
  HiddenFileInput,
  PlusIcon,
  UploadWrappers,
  ProfileImages,
  IconWrappers,
  ProfileLabel,
  HiddenFileInputs,
  PlusButtons,
  FormGroup,
  FormGroups,
  ErrorText,
} from './BasicLevel.Styles';

import Multistep from '../../Components/Multistep';
import { PiUserCirclePlusThin } from "react-icons/pi";
import { FaPlus } from 'react-icons/fa';
import Loader from "../../Components/Loader"
import EmployeeIcon from "../../assets/employeeicon.svg";
import Navbar from '../../Components/Navbar';

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
    <>
    <Navbar/>
    <Container>
      {/* Unsaved changes guard */}
      <UnsavedChangesGuard isDirty={isFormDirty} />

      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <EmployeeImage  src={EmployeeIcon} alt="employeeIcon" />
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
  <UploadWrappers>
  <ProfileLabel htmlFor="profile-upload">
    {formData.profile_pic ? (
      <ProfileImages src={URL.createObjectURL(formData.profile_pic)} alt="Employee" />
    ) : (
      <IconWrappers>
        <PiUserCirclePlusThin size={50} />
      </IconWrappers>
    )}
  </ProfileLabel>

  <PlusButtons htmlFor="profile-upload">+</PlusButtons>

  <HiddenFileInputs
    id="profile-upload"
    type="file"
    accept="image/*"
    onChange={(e) => {
      setFormData((prev) => ({ ...prev, profile_pic: e.target.files[0] }));
      setIsFormDirty(true);
    }}
  />
</UploadWrappers>


        {/* Name & Email */}
        <TwoColumn>
          <FormGroups style={{marginTop:"-10px"}}> 
            {errors.name && <ErrorText >{errors.name}</ErrorText>}
            <Label>Name</Label>
            <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} autoComplete="off" />
          </FormGroups>
          <FormGroups style={{marginTop:"5px"}}>
            {errors.email && <ErrorText >{errors.email}</ErrorText>}
            <Label>Email</Label>
            <Input name="email" placeholder="Email ID" value={formData.email} onChange={handleChange} autoComplete="off" />
          </FormGroups>
        </TwoColumn>

        {/* Address, DOB, Gender */}
        <InfoSection>
          <FormGroups>
            {errors.address && <ErrorText >{errors.address}</ErrorText>}
              <Label>Address</Label>
            <FullWidthInput name="address" placeholder="Address" value={formData.address} onChange={handleChange} autoComplete="off"/>
          </FormGroups>

          <TwoColumnRow>
            <FormGroups >
              {errors.dob && <ErrorText>{errors.dob}</ErrorText>}
                <Label>Date of Birth</Label>
              <Input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                autoComplete="off"
              />
            </FormGroups>
            <FormGroups>
              {errors.gender && <ErrorText >{errors.gender}</ErrorText>}
                <Label>Gender</Label>
           <Select
  name="gender"
  value={formData.gender}
  onChange={handleChange}
  autoComplete="off"
>
  <option value="">Select Gender</option>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
  <option value="Other">Other</option>
</Select>

            </FormGroups>
          </TwoColumnRow>
        </InfoSection>
      </InfoGrid>

      <Hr />

      {/* Job Details */}
      <SectionTitle>Job Details</SectionTitle>

      <TwoColumnRows>
       <FormGroups>
  {errors.department_id && <ErrorText>{errors.department_id}</ErrorText>}
  <Label htmlFor="department_id">Department</Label>
  <Select
    name="department_id"
    value={formData.department_id}
    onChange={handleChange}
    autoComplete="off"
  >
    <option value="">Select Department</option>
    {departmentList.map((dept) => (
      <option key={dept.id} value={dept.id}>
        {dept.name}
      </option>
    ))}
  </Select>
</FormGroups>

        <FormGroups>
          {errors.employment_type && <ErrorText >{errors.employment_type}</ErrorText>}
            <Label>Employee Type</Label>
        <Select
  name="employment_type"
  value={formData.employment_type}
  onChange={handleChange}
  autoComplete="off"
>
  <option value="">Select Employment Type</option>
  <option value="Full-time">Full-time</option>
  <option value="Part-time">Part-time</option>
  <option value="Contract">Contract</option>
</Select>

        </FormGroups>
      </TwoColumnRows>

      <TwoColumnRows >
        <FormGroups>
          {errors.designation && <ErrorText >{errors.designation}</ErrorText>}
          <Label>Designation</Label>
          <Input      
           name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} autoComplete="off" />
        </FormGroups>
        <FormGroups>
          {errors.joining_date && <ErrorText>{errors.joining_date}</ErrorText>}
            <Label>Joining Date</Label>
          <Input 
            type="date"
            name="joining_date"
            value={formData.joining_date}
            onChange={handleChange}
            autoComplete="off"
          />
        </FormGroups>
      </TwoColumnRows>

      <TwoColumnRows>
        <FormGroups>
          {errors.total_leave && <ErrorText >{errors.total_leave}</ErrorText>}
            <Label>Total Leaves</Label>
          <Input
            name="total_leave"
            placeholder="Total Leaves"
            value={formData.total_leave}
            onChange={handleChange}
            autoComplete="off"
            type="number"
            min="0"
          />
        </FormGroups>
        <FormGroups >
          {errors.role && <ErrorText >{errors.role}</ErrorText>}
            <Label>Roles</Label>
         <Select
  name="role"
  value={formData.role}
  onChange={handleChange}
  autoComplete="off"
>
  <option value="">Select Role</option>
  <option value="employee">Employee</option>
  <option value="hr">HR</option>
  <option value="manager">Manager</option>
</Select>

        </FormGroups>
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
    


      {errors[key] && (
        <ErrorText>
          {errors[key]}
        </ErrorText>
      )}
  <Label htmlFor={key}>{label}</Label>
     {key === 'idcard' ? (
  <UploadWrapper onClick={() => document.getElementById("idcard-upload").click()}>
    <FileName hasFile={!!formData.idcard}>
      {formData.idcard?.name || "Choose file"}
    </FileName>
    <PlusIcon />
    <HiddenFileInput
      id="idcard-upload"
      type="file"
      name="idcard"
      accept="image/*"
      onChange={(e) => {
        setFormData((prev) => ({ ...prev, idcard: e.target.files[0] }));
        setIsFormDirty(true);
      }}
    />
  </UploadWrapper>
) : (
  <Input
    id={key}
    name={key}
    placeholder={label}
    type={type || "text"}
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
    </>
  );
}
