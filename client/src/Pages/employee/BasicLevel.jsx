// pages/AddEmployeeForm.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitEmployee } from '../../Redux//employeeSlice';
import { useNavigate } from 'react-router-dom';
import {
  Container, Header, RoleInfo, Stepper, Step, FormSection, Input,
  TextArea, Button, Title, Subtitle, SectionTitle,
  InfoGrid, FlexRow, ProfileImage, ApproveButton, Hr,
  InfoSection, FullWidthInput, TwoColumnRow, TwoColumnRows, TwoColumn
} from './BasicLevel.Styles';
import Multistep from '../../Components/Multistep'
export default function AddEmployeeForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.employee);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    address: '',
    dob: '',
    gender: '',
    position: '',
    joiningDate: '',
    department: '',
    contractType: '',
    passportNumber: '',
    workPermit: '',
    visaExpiry: '',
    iqamaNumber: '',
    employmentContract: '',
    insuranceNumber: '',
  });

const departmentList = useSelector((state) => state.departments.list);
const [currentStep, setCurrentStep] = useState(0);

const stepTitles = [
  'Basic Info',
  'Job Details',
  'Legal Info'
];
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = () => {
    if (validateForm()) return;
    const modifiedData = {
      ...formData,
      name: formData.name,
      passport_number: formData.passportNumber,
      visa_expiry_date: formData.visaExpiry,
      iqama_number: formData.iqamaNumber,
      insurance_number: formData.insuranceNumber,
      contractType: formData.employment_type,
      designation: formData.position,
      employment_type: formData.contractType,


    };

    dispatch(submitEmployee(modifiedData)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        navigate('/bank-payment');
      }
    });
  };
  const validateForm = () => {
    const newErrors = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  return (
    <>
    <Container>
      {/* Header */}
      <Header>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img src="/images/employee.png" alt="Icon" style={{ height: "50px" }} />
          <div>
            <Title>Employee</Title>
            <Subtitle>Manage your Employee.</Subtitle>
          </div>
        </div>
        <RoleInfo>
          <img src="https://i.pravatar.cc/40?img=5" alt="HR Manager" />
          <span>HR Manager</span>
        </RoleInfo>
      </Header>

      <Hr />
       <div style={{ width: "100%", justifyContent: "center", display: "flex", padding: "20px" }}>
        <div style={{ width: "50%" }}>
         <Multistep currentStep={currentStep} steps={stepTitles} /> 
        </div>
      </div>
      {/* Form */}
      <InfoGrid>
        <ProfileImage src="https://i.pravatar.cc/100?img=5" alt="Employee" />
        <TwoColumn>
          <>
            {errors.name && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.name}</p>}
            <Input name="name" placeholder="Name" onChange={handleChange} />
          </>
          <>
            {errors.employeeId && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.employeeId}</p>}
            <Input name="employeeId" placeholder="Employee ID" onChange={handleChange} />
          </>
          <>
            {errors.email && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.email}</p>}
            <Input name="email" placeholder="Email ID" onChange={handleChange} />
          </>
        </TwoColumn>

        <InfoSection>
          <>
            {errors.address && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.address}</p>}
            <FullWidthInput name="address" placeholder="Address" onChange={handleChange} />
          </>

          <TwoColumnRow>
  <div>
    {errors.dob && <p style={{ color: 'red', fontSize: '0.8rem', marginBottom: '4px' }}>{errors.dob}</p>}
    <Input type="date" name="dob" placeholder="DOB" onChange={handleChange} />
  </div>
  <div>
    {errors.gender && <p style={{ color: 'red', fontSize: '0.8rem', marginBottom: '4px' }}>{errors.gender}</p>}
    <Input name="gender" placeholder="Gender" onChange={handleChange} />
  </div>
</TwoColumnRow>

        </InfoSection>
      </InfoGrid>

      <Hr />
      <SectionTitle>Job Details</SectionTitle>
    <TwoColumnRows>
  <div>
    {errors.position && <p style={{ color: 'red', fontSize: '0.8rem', marginBottom: '4px' }}>{errors.position}</p>}
    <Input name="position" placeholder="Job Position" onChange={handleChange} />
  </div>
  <div>
    {errors.joiningDate && <p style={{ color: 'red', fontSize: '0.8rem', marginBottom: '4px' }}>{errors.joiningDate}</p>}
    <Input name="joiningDate" placeholder="Joining Date" onChange={handleChange} />
  </div>
</TwoColumnRows>

<TwoColumnRows>
<div>
  {errors.department && (
    <p style={{ color: 'red', fontSize: '0.8rem', marginBottom: '4px' }}>
      {errors.department}
    </p>
  )}
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
  }}
>
  <option value="">Select Department</option>
  {departmentList.map((dept) => (
    <option key={dept.id} value={dept.id}> {/* ✅ send ID, not name */}
      {dept.name}
    </option>
  ))}
</select>

</div>


  <div>
    {errors.contractType && <p style={{ color: 'red', fontSize: '0.8rem', marginBottom: '4px' }}>{errors.contractType}</p>}
    <Input name="contractType" placeholder="Full time" onChange={handleChange} />
  </div>
</TwoColumnRows>


      <SectionTitle>Legal Info</SectionTitle>

      <>
        {errors.passportNumber && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.passportNumber}</p>}
        <Input name="passportNumber" placeholder="Passport number" onChange={handleChange} />
      </>
      <>
        {errors.workPermit && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.workPermit}</p>}
        <Input name="workPermit" placeholder="Work Permit" onChange={handleChange} />
      </>
      <>
        {errors.visaExpiry && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.visaExpiry}</p>}
        <Input name="visaExpiry" placeholder="Visa Expiry Date" onChange={handleChange} />
      </>
      <>
        {errors.iqamaNumber && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.iqamaNumber}</p>}
        <Input name="iqamaNumber" placeholder="Iqama Number" onChange={handleChange} />
      </>
     
      <>
        {errors.insuranceNumber && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.insuranceNumber}</p>}
        <Input name="insuranceNumber" placeholder="Insurance Number" onChange={handleChange} />
      </>

      <FlexRow>
        <ApproveButton onClick={handleSubmit}>Next</ApproveButton>
      </FlexRow>

      {status === 'loading' && <p>Submitting...</p>}
      {status === 'failed' && <p style={{ color: 'red' }}>{error}</p>}
    </Container>
    </>
  );
}
