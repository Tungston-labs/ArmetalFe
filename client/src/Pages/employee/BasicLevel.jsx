import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  submitEmployee,
  setEmployeeId,
  setBasicFormData,
} from '../../Redux/employeeSlice';
import { getDepartments } from '../../Redux/departmentSlice';
import { useNavigate } from 'react-router-dom';
import {
  Container, Header, RoleInfo, Stepper, Step, FormSection, Input,
  TextArea, Button, Title, Subtitle, SectionTitle,
  InfoGrid, FlexRow, ProfileImage, ApproveButton, Hr,
  InfoSection, FullWidthInput, TwoColumnRow, TwoColumnRows, TwoColumn
} from './BasicLevel.Styles';
import Multistep from '../../Components/Multistep';

export default function AddEmployeeForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, formData: reduxFormData } = useSelector((state) => state.employee);
  const departmentList = useSelector((state) => state.departments.list);

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const stepTitles = ['Basic Info', 'Job Details', 'Legal Info'];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phno: '',
    address: '',
    dob: '',
    gender: '',
    designation: '',
    joining_date: '',
    department: '',
    employment_type: '',
    passport_number: '',
    // workPermit: '',
    visa_expiry_date: '',
    iqama_number: '',
    insurance_number: '',
    profilePic: null,
  });

  useEffect(() => {
    if (reduxFormData?.basic) setFormData(reduxFormData.basic);
    if (departmentList.length === 0) dispatch(getDepartments());
  }, [reduxFormData, dispatch, departmentList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'string' && !value.trim()) {
        newErrors[key] = 'This field is required';
      }
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phno && !phoneRegex.test(formData.phno.trim())) {
      newErrors.phoneNumber = 'Enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = () => {
  console.log('🔄 Submitting form...');

  if (!validateForm()) {
    console.log('❌ Validation failed');
    return; // exit if form is invalid
  }

  // ✅ now proceed to prepare FormData and submit
  const formPayload = new FormData();
  const payload = {
    name: formData.name,
    email: formData.email,
    phno: formData.phno,
    address: formData.address,
    dob: new Date(formData.dob).toISOString().split("T")[0],
    gender: formData.gender,
    designation: formData.designation,
    joining_date: new Date(formData.joining_date).toISOString().split("T")[0],
    department_id: parseInt(formData.department),
    employment_type: formData.employment_type,
    passport_number: formData.passport_number,
    visa_expiry_date: new Date(formData.visa_expiry_date).toISOString().split("T")[0],
    iqama_number: formData.iqama_number,
    insurance_number: formData.insurance_number,
  };
  console.log("payload",payload)

  for (const [key, value] of Object.entries(payload)) {
    if (value !== '' && value !== undefined && value !== null) {
      formPayload.append(key, value);
    }
  }

  if (formData.profilePic) {
    formPayload.append("profile_pic", formData.profilePic);
  }
console.log("formPayload",formPayload)
  dispatch(submitEmployee(formPayload)).then((res) => {
    if (res.meta.requestStatus === 'fulfilled') {
      const id = res.payload?.id || res.payload?.employee?.id;
      if (id) {
        dispatch(setEmployeeId(id));
        dispatch(setBasicFormData(formData));
        navigate('/bank-payment');
      } else {
        console.error('ID not found in response:', res.payload);
      }
    } else {
      const err = res.payload;
      if (err && typeof err === 'object') {
        const newErrors = {};
        for (let key in err) {
          newErrors[key] = Array.isArray(err[key]) ? err[key][0] : err[key];
        }
        setErrors(newErrors);
      } else {
        console.error('Employee creation failed:', err);
      }
    }
  });
}; 




  

  return (
    <Container>
      {/* Header Section */}
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/images/employee.png" alt="Icon" style={{ height: '50px' }} />
          <div>
            <Title>Employee</Title>
            <Subtitle>Manage your Employee.</Subtitle>
          </div>
        </div>
        <RoleInfo>
          <img src="/images/user.jpg" alt="HR Manager" />
          <span>HR Manager</span>
        </RoleInfo>
      </Header>

      <Hr />

      <div style={{ width: '100%', justifyContent: 'center', display: 'flex', padding: '20px' }}>
        <div style={{ width: '50%' }}>
          <Multistep currentStep={currentStep} steps={stepTitles} />
        </div>
      </div>

      {/* Profile Upload */}
      <InfoGrid>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <ProfileImage
            src={formData.profilePic ? URL.createObjectURL(formData.profilePic) : "https://i.pravatar.cc/100?img=5"}
            alt="Employee"
            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
          />
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
              boxShadow: '0 0 4px rgba(0,0,0,0.3)',
            }}
          >
            +
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFormData((prev) => ({
                ...prev,
                profilePic: e.target.files[0],
              }));
            }}
            style={{ display: 'none' }}
          />
        </div>

        {/* Basic Info Fields */}
        <TwoColumn>
          <div>
            {errors.name && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.name}</p>}
            <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            {errors.email && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.email}</p>}
            <Input name="email" placeholder="Email ID" value={formData.email} onChange={handleChange} />
          </div>
        </TwoColumn>

        <InfoSection>
          <div>
            {errors.address && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.address}</p>}
            <FullWidthInput name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
          </div>

          <TwoColumnRow>
            <div>
              {errors.dob && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.dob}</p>}
              <Input type="date" name="dob" value={formData.dob} onChange={handleChange} />
            </div>
            <div>
              {errors.gender && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.gender}</p>}
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '1rem',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  background: 'white',
                  color: '#999999',
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

      {/* Job Details Section */}
      <SectionTitle>Job Details</SectionTitle>
      <TwoColumnRows>
        <div>
          {errors.designation && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.designation}</p>}
          <Input name="designation" placeholder=" designation" value={formData.designation} onChange={handleChange} />
        </div>
        <div>
          {errors.joining_date && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.joining_date}</p>}
          <Input type="date" name="joining_date" value={formData.joining_date} onChange={handleChange} />
        </div>
      </TwoColumnRows>

      <TwoColumnRows>
        <div>
          {errors.department && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.department}</p>}
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              fontSize: '1rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              background: 'white',
              color: '#999999',
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
          <select
            name="employment_type"
            value={formData.employment_type}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              fontSize: '1rem',
              borderRadius: '6px',
              border: '1px solid #ccc',
              background: 'white',
              color: '#999999',
            }}
          >
            <option value="">Select Employment Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
      </TwoColumnRows>

      {/* Legal Info Section */}
      <SectionTitle>Employee Legal & ID Information</SectionTitle>
      {[
        { key: 'phno', label: 'Phno' },
        { key: 'passport_number', label: 'passport_number' },
        // { key: 'workPermit', label: 'Work Permit' },
        { key: 'visa_expiry_date', label: 'visa_expiry_date', type: 'date' },
        { key: 'iqama_number', label: 'iqama_number ' },
        { key: 'insurance_number', label: 'insurance_number' },
      ].map(({ key, label, type }) => (
        <div key={key}>
          {errors[key] && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors[key]}</p>}
          <Input
            name={key}
            placeholder={label}
            type={type || 'text'}
            value={formData[key]}
            onChange={handleChange}
          />
        </div>
      ))}

      <FlexRow>
        <ApproveButton onClick={handleSubmit}>Next</ApproveButton>
      </FlexRow>

      {status === 'loading' && <p>Submitting...</p>}
      {status === 'failed' && <p style={{ color: 'red' }}>{error}</p>}
    </Container>
  );
}
