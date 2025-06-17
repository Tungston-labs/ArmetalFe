// pages/AddEmployeeForm.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitEmployee, setEmployeeId } from '../../Redux/employeeSlice';
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
  const { status, error } = useSelector((state) => state.employee);
  const departmentList = useSelector((state) => state.departments.list);

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const stepTitles = ['Basic Info', 'Job Details', 'Legal Info'];
console.log(errors)
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
    insuranceNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    for (const [key, value] of Object.entries(formData)) {
      if (!value || value.trim() === '') {
        newErrors[key] = 'This field is required';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length > 0; // returns true if form has errors
  };

  const handleSubmit = () => {
    console.log(validateForm())
    if (validateForm()) return;

  const modifiedData = {
  name: formData.name.trim(),
  employee_id: formData.employeeId.trim(),
  email: formData.email.trim(),
  address: formData.address.trim(),
  dob: new Date(formData.dob).toISOString().split("T")[0], // ✅ YYYY-MM-DD
  gender: formData.gender.trim(),
  designation: formData.position.trim(),
  joining_date: new Date(formData.joiningDate).toISOString().split("T")[0], // ✅
  department: parseInt(formData.department), // ✅ ensure it's a number ID
  employment_type: formData.contractType.trim(),
  passport_number: formData.passportNumber.trim(),
  work_permit: formData.workPermit.trim(),
  visa_expiry_date: new Date(formData.visaExpiry).toISOString().split("T")[0], // ✅
  iqama_number: formData.iqamaNumber.trim(),
  insurance_number: formData.insuranceNumber.trim(),
};

  dispatch(submitEmployee(modifiedData)).then((res) => {
  if (res.meta.requestStatus === 'fulfilled') {
    // Set employeeId in Redux from the response payload
    console.log("ubuhbujn",res)
    dispatch(setEmployeeId(res.payload.employee.id));

    // Navigate to next step
    navigate('/bank-payment');
  } else {
    console.error('Employee creation failed:', res.payload);
  }
});
 
  };

  return (
    <Container>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/images/employee.png" alt="Icon" style={{ height: '50px' }} />
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

      <div style={{ width: '99%', justifyContent: 'center', display: 'flex', padding: '20px' }}>
        <div style={{ width: '50%' }}>
          <Multistep currentStep={currentStep} steps={stepTitles} />
        </div>
      </div>

      <InfoGrid>
        <ProfileImage src="https://i.pravatar.cc/100?img=5" alt="Employee" />
        <TwoColumn>
          <div>
            {errors.name && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.name}</p>}
            <Input name="name" placeholder="Name" onChange={handleChange} />
          </div>
          <div>
            {errors.employeeId && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.employeeId}</p>}
            <Input name="employeeId" placeholder="Employee ID" onChange={handleChange} />
          </div>
          <div>
            {errors.email && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.email}</p>}
            <Input name="email" placeholder="Email ID" onChange={handleChange} />
          </div>
        </TwoColumn>

        <InfoSection>
          <div>
            {errors.address && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.address}</p>}
            <FullWidthInput name="address" placeholder="Address" onChange={handleChange} />
          </div>

          <TwoColumnRow>
            <div>
              {errors.dob && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.dob}</p>}
              <Input type="date" name="dob" placeholder="DOB" onChange={handleChange} />
            </div>
            <div>
              {errors.gender && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.gender}</p>}
              <Input name="gender" placeholder="Gender" onChange={handleChange} />
            </div>
          </TwoColumnRow>
        </InfoSection>
      </InfoGrid>

      <Hr />
      <SectionTitle>Job Details</SectionTitle>
      <TwoColumnRows>
        <div>
          {errors.position && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.position}</p>}
          <Input name="position" placeholder="Job Position" onChange={handleChange} />
        </div>
        <div>
          {errors.joiningDate && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.joiningDate}</p>}
          <Input type="date" name="joiningDate" placeholder="Joining Date" onChange={handleChange} />
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
            }}
          >
            <option value="">Select Department</option>
            {departmentList.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          {errors.contractType && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.contractType}</p>}
          <Input name="contractType" placeholder="Full time" onChange={handleChange} />
        </div>
      </TwoColumnRows>

      <SectionTitle>Legal Info</SectionTitle>

      <div>
        {errors.passportNumber && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.passportNumber}</p>}
        <Input name="passportNumber" placeholder="Passport number" onChange={handleChange} />
      </div>
      <div>
        {errors.workPermit && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.workPermit}</p>}
        <Input name="workPermit" placeholder="Work Permit" onChange={handleChange} />
      </div>
      <div>
        {errors.visaExpiry && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.visaExpiry}</p>}
        <Input name="visaExpiry" placeholder="Visa Expiry Date" onChange={handleChange} />
      </div>
      <div>
        {errors.iqamaNumber && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.iqamaNumber}</p>}
        <Input name="iqamaNumber" placeholder="Iqama Number" onChange={handleChange} />
      </div>
      <div>
        {errors.insuranceNumber && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.insuranceNumber}</p>}
        <Input name="insuranceNumber" placeholder="Insurance Number" onChange={handleChange} />
      </div>

      <FlexRow>
        <ApproveButton onClick={handleSubmit}>Next</ApproveButton>
      </FlexRow>

      {status === 'loading' && <p>Submitting...</p>}
      {status === 'failed' && <p style={{ color: 'red' }}>{error}</p>}
    </Container>
  );
}
