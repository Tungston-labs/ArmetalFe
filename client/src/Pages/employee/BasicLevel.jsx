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

  InfoGrid,

  FullWidthInput,
  TwoColumn,
  TwoColumnRow,
 
  Input,
  InfoSection,
  Label,
  EmployeeImage,
  Select,
 
  UploadWrappers,
  ProfileImages,
  IconWrappers,
  ProfileLabel,
  HiddenFileInputs,
  PlusButtons,

  FormGroups,
  ErrorText,
} from './BasicLevel.Styles';

import Multistep from '../../Components/Multistep';
import { PiUserCirclePlusThin } from "react-icons/pi";
import JobDetails from '../../Components/JobDetails';
import Loader from "../../Components/Loader"
import EmployeeIcon from "../../assets/employeeicon.svg";
import Navbar from '../../Components/Navbar';

export default function AddEmployeeForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, formData: reduxFormData } = useSelector((state) => state.employee);
  const departmentList = useSelector((state) => state.departments.list);
const [loading, setLoading] = useState(false);

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


  useEffect(() => {
    if (departmentList.length === 0) {
      dispatch(getDepartments({ page: 1, search: '' }));
    }
  }, [reduxFormData, dispatch, departmentList]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    dispatch(setBasicFormData({ ...formData, [name]: value }));
    setIsFormDirty(true);
  };
console.log({country});

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

 
  const phoneRegex = /^[0-9]{10}$/;

if (formData.phno) {
  if (country === "IN") {

    const indiaRegex = /^[0-9]{10}$/;
    if (!indiaRegex.test(formData.phno.trim())) {
      newErrors.phno = "Enter a valid 10-digit phone number";
    }
  } else {
   
    const intlRegex = /^\+?[1-9]\d{7,14}$/;
    if (!intlRegex.test(formData.phno.trim())) {
      newErrors.phno = "Enter a valid phone number with country code (e.g. +966512345678)";
    }
  }
}



  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.email && !emailRegex.test(formData.email.trim())) {
    newErrors.email = "Enter a valid email address";
  }


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

  
  if (passport_number && !/^[A-Za-z0-9]{6,9}$/.test(passport_number.trim())) {
    newErrors.passport_number = "Enter a valid passport number (6–9 chars)";
  }


  if (insurance_number && insurance_number.trim().length < 5) {
    newErrors.insurance_number = "Insurance number must be at least 5 characters";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};



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
      {loading && <Loader />} 
    <Container>
  
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

    
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '50%' }}>
          <Multistep currentStep={currentStep} steps={stepTitles} />
        </div>
      </div>

      <InfoGrid>
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
<JobDetails
  country={country}
  departments={departmentList}
  initialValues={formData}
  validateParent={validateForm}
  onNext={async (jobPlain, jobFormData) => {
    const merged = { ...formData, ...jobPlain };

    setLoading(true); // 🔹 show loader before submission

    try {
      dispatch(setBasicFormData(merged));
      const res = await dispatch(submitEmployee({ basic: merged }));

      if (res.meta.requestStatus === "fulfilled") {
        const id = res.payload?.employee?.id || res.payload?.id;
        if (id) {
          dispatch(setEmployeeId(id));
          setIsFormDirty(false);
          navigate("/bank-payment");
        }
      } else {
        const backendErrors = res.payload;
        if (backendErrors && typeof backendErrors === "object") {
          const newErrors = {};
          for (const field in backendErrors) {
            newErrors[field] = Array.isArray(backendErrors[field])
              ? backendErrors[field][0]
              : backendErrors[field];
          }
          setErrors(newErrors);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false); // 🔹 hide loader after completion
    }
  }}
/>

  
    </Container>
    </>
  );
}
