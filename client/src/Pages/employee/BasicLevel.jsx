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
  Container, Header, RoleInfo, Title, Subtitle, Hr, ColumnRow,
  InfoGrid, FlexRow, ProfileImage, ApproveButton, IconWrapper,
  FullWidthInput, TwoColumn, TwoColumnRow, TwoColumnRows, SectionTitle, Input, InfoSection
} from './BasicLevel.Styles';
import Multistep from '../../Components/Multistep';
import { PiUserCirclePlusThin } from "react-icons/pi";
import SyncLoader from '../../Components/Loder';
import { FaPlus } from 'react-icons/fa';
import { FiChevronDown } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import Navbar from '../../Components/Navbar';
import { Spin } from "antd";
import EmployeeIcon from "../../assets/employeeicon.svg";
export default function AddEmployeeForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, formData: reduxFormData } = useSelector((state) => state.employee);
  const departmentList = useSelector((state) => state.departments.list);
  const [menuOpen, setMenuOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const stepTitles = ['Basic Info', 'Job Details', 'Legal Info'];
  const user = JSON.parse(localStorage.getItem("user"));
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
    department: '',
    employment_type: '',
    passport_number: '',
    visa_expiry_date: '',
    iqama_number: '',
    insurance_number: '',
    profile_pic: null,
    total_leave: '',
    role: '',
    contract_expiry_date: '',
    idcard: null,
  });
  useEffect(() => {
    // if (reduxFormData?.basic) setFormData(reduxFormData.basic);
    if (departmentList.length === 0) dispatch(getDepartments());
  }, [reduxFormData, dispatch, departmentList]);
  console.log(localStorage.getItem("user"));

  console.log("country is", country);


 const handleChange = (e) => {
  const { name, value } = e.target;

  let newValue = value;

  // ✅ Force passport_number to uppercase
  if (name === "passport_number") {
    newValue = value.toUpperCase();
  }

  setFormData((prev) => ({
    ...prev,
    [name]: newValue,
  }));

  // ✅ Optional: validation logic for passport
  if (name === "passport_number") {
    if (!/^[A-Z0-9]*$/.test(newValue)) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Passport number must contain only uppercase letters and numbers",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }
};


  const validateForm = () => {
    const newErrors = {};

    // Required fields
    const requiredFields = [
      'name',
      'address',
      'email',
      'dob',
      'phno',
      'gender',
      'designation',
      'department',
      'employment_type',
      'joining_date',
      'passport_number',

      'visa_expiry_date',
      'insurance_number',
      'total_leave',
      'contract_expiry_date',
      'role',
    ];

if (country !== 'IN') {
    requiredFields.push('visa_expiry_date', 'insurance_number');
  }

    requiredFields.forEach((field) => {
    const val = formData[field];
    if (val === null || val === undefined || (typeof val === 'string' && !val.trim())) {
      newErrors[field] = 'This field is required';
    }
  });

    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phno && !phoneRegex.test(formData.phno.trim())) {
      newErrors.phno = 'Enter a valid 10-digit phone number';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email.trim())) {
      newErrors.email = alert('Enter a valid email address')
    }

    // Example validation inside handleSubmit or a separate validateForm()
if (!formData.passport_number) {
  newErrors.passport_number = "Passport number is required";
} else if (!/^[A-ZA-Z0-9]{6,9}$/.test(formData.passport_number)) {
  newErrors.passport_number = "Enter a valid passport number (6–9 alphanumeric)";
}

    setErrors(newErrors);
      console.log('validateForm -> errors:', newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    console.log('handleSubmit -> validation failed', errors);
    if (!validateForm()) return;

    dispatch(submitEmployee(formData)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        const id = res.payload?.id || res.payload?.employee?.id;
        if (id) {
          dispatch(setEmployeeId(id));
          dispatch(setBasicFormData(formData));
          navigate('/bank-payment');
        }
      } else {
        const backendErrors = res.payload;

        if (backendErrors && typeof backendErrors === 'object') {
          const newErrors = {};

          for (const field in backendErrors) {
            let message = Array.isArray(backendErrors[field])
              ? backendErrors[field][0]
              : backendErrors[field];

            if (field === 'email' && message.includes('already exists')) {
              message = 'Email is already registered';
            } else if (field === 'phno' && message.includes('already exists')) {
              message = 'Phone number is already registered';
            }

            newErrors[field] = message;
          }

          setErrors(newErrors);
        }
      }
    });
  };

  return (
    <>

      <Container>
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

        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '50%' }}>
            <Multistep currentStep={currentStep} steps={stepTitles} />
          </div>
        </div>

        <InfoGrid>
     <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}>
  {/* ✅ Wrap everything inside the label */}
  <label
    htmlFor="profile-upload"
    style={{ display: "inline-block", position: "relative", cursor: "pointer" }}
  >
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

    {/* ✅ Plus icon stays inside label */}
    <span
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
    </span>
  </label>

  {/* ✅ Hidden file input */}
  <input
    id="profile-upload"
    type="file"
    accept="image/*"
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        profile_pic: e.target.files[0],
      }))
    }
    style={{ display: 'none' }}
  />
</div>


          <TwoColumn>
         <div>
  <label
    htmlFor="name"
    style={{
      display: "block",
      marginBottom: "2px", // keeps label close to the input
      fontSize: "0.9rem",
      fontWeight: "500",
      color: "#333",
    }}
  >
    Name
  </label>

  {errors.name && (
    <p
      style={{
        color: "red",
        fontSize: "0.8rem",
        margin: "0 0 2px 0",
      }}
    >
      {errors.name}
    </p>
  )}

  <Input
    id="name"
    name="name"
    placeholder="Name"
    value={formData.name}
    onChange={handleChange}
    autoComplete="off"
  />
</div>

           <div>
  <label
    htmlFor="email"
    style={{
      display: "block",
      marginBottom: "2px", // keeps label close to the input
      fontSize: "0.9rem",
      fontWeight: "500",
      color: "#333",
    }}
  >
    Email ID
  </label>

  {errors.email && (
    <p
      style={{
        color: "red",
        fontSize: "0.8rem",
        margin: "0 0 2px 0",
      }}
    >
      {errors.email}
    </p>
  )}

  <Input
    id="email"
    name="email"
    placeholder="Email ID"
    value={formData.email}
    onChange={handleChange}
    autoComplete="off"
  />
</div>

          </TwoColumn>

          <InfoSection>
          <div>
  <label
    htmlFor="address"
    style={{
      display: "block",
     
      fontWeight: "500",
      color: "#333",
    }}
  >
    Address
  </label>

  {errors.address && (
    <p
      style={{
        color: "red",
        fontSize: "0.8rem",
        margin: "0 0 2px 0",
      }}
    >
      {errors.address}
    </p>
  )}

  <FullWidthInput
    id="address"
    name="address"
    placeholder="Address"
    value={formData.address}
    onChange={handleChange}
    autoComplete="off"
  />
</div>


            <TwoColumnRow>
             <div style={{marginTop:"-5px"}}>
  <label
    htmlFor="dob"
    style={{
      display: "block",
      marginBottom: "2px", // tight spacing
      fontSize: "0.9rem",
      fontWeight: "500",
      color: "#333",
    }}
  >
    Date of Birth
  </label>

  {errors.dob && (
    <p
      style={{
        color: "red",
        fontSize: "0.8rem",
        margin: "0 0 2px 0",
      }}
    >
      {errors.dob}
    </p>
  )}

  <Input
    id="dob"
    type="date"
    name="dob"
    value={formData.dob}
    onChange={handleChange}
    autoComplete="off"
    placeholder="Date of Birth"
    onFocus={(e) => (e.target.type = "date")}
    onBlur={(e) => {
      if (!e.target.value) e.target.type = "date";
    }}
  />
</div>

            <div style={{marginTop:"-5px"}}>
  <label
    htmlFor="gender"
    style={{
      display: "block",
      marginBottom: "2px", // keeps label close to select
      fontSize: "0.9rem",
      fontWeight: "500",
      color: "#333",
    }}
  >
    Gender
  </label>

  {errors.gender && (
    <p
      style={{
        color: "red",
        fontSize: "0.8rem",
        margin: "0 0 2px 0",
      }}
    >
      {errors.gender}
    </p>
  )}

  <select
    id="gender"
    name="gender"
    value={formData.gender}
    onChange={handleChange}
    autoComplete="off"
    style={{
      width: "100%",
      padding: "0.8rem",
      fontSize: "0.9rem",
      borderRadius: "7px",
      border: "1px solid #052DB4",
      background: "#FFF",
      color: "black",
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

        <SectionTitle>Job Details</SectionTitle>


        <TwoColumnRows>
          <div>
            <label
              htmlFor="department"
              style={{
                display: "block",
                marginBottom: "2px", // keeps label close to the select
                fontSize: "0.9rem",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Department
            </label>

            {errors.department && (
              <p
                style={{
                  color: "red",
                  fontSize: "0.8rem",
                  margin: "0 0 2px 0",
                }}
              >
                {errors.department}
              </p>
            )}

            <select
              id="department"
              name="department"
              value={formData.department}
              autoComplete="off"
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.7rem",
                borderRadius: "7px",
                border: "1px solid #052DB4",
                background: "#FFF",
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
            <label
              htmlFor="employment_type"
              style={{
                display: "block",
                marginBottom: "2px", // keeps it close to the select
                fontSize: "0.9rem",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Employment Type
            </label>

            {errors.employment_type && (
              <p
                style={{
                  color: "red",
                  fontSize: "0.8rem",
                  margin: "0 0 2px 0",
                }}
              >
                {errors.employment_type}
              </p>
            )}

            <select
              id="employment_type"
              name="employment_type"
              value={formData.employment_type}
              onChange={handleChange}
              autoComplete="off"
              style={{
                width: "100%",
                padding: "0.7rem",
                fontSize: "0.9rem",
                borderRadius: "7px",
                border: "1px solid #052DB4",
                background: "#FFF",
                color: "black",
              }}
            >
              <option value="">Select Employment Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

        </TwoColumnRows>
        <TwoColumnRows>
          <div>
            <label
              htmlFor="designation"
              style={{
                display: "block",
                marginBottom: "0px", // keeps it close to the input
                fontSize: "0.9rem",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Designation
            </label>

            {errors.designation && (
              <p
                style={{
                  color: "red",
                  fontSize: "0.8rem",
                  margin: "0 0 2px 0",
                }}
              >
                {errors.designation}
              </p>
            )}

            <Input
              id="designation"
              name="designation"
              placeholder="Enter Designation"
              value={formData.designation}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          <div>
            <label
              htmlFor="joining_date"
              style={{
                display: "block",
                marginBottom: "px", // very small gap so it "touches" the input
                fontSize: "0.9rem",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Joining Date
            </label>

            {errors.joining_date && (
              <p
                style={{
                  color: "red",
                  fontSize: "0.8rem",
                  margin: "0 0 2px 0", // small margin so error is close too
                }}
              >
                {errors.joining_date}
              </p>
            )}

            <Input
              id="joining_date"
              type="date"
              name="joining_date"
              value={formData.joining_date}
              onChange={handleChange}
              autoComplete="off"
              placeholder="Joining Date"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!e.target.value) e.target.type = "date";
              }}
            />
          </div>

        </TwoColumnRows>

        <TwoColumnRows>
          <div>
            <label
              htmlFor="total_leave"
              style={{
                display: "block",
                marginBottom: "0px", // keeps it close to the input
                fontSize: "0.9rem",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Total Leaves
            </label>

            {errors.total_leaves && (
              <p
                style={{
                  color: "red",
                  fontSize: "0.8rem",
                  margin: "0 0 2px 0",
                }}
              >
                {errors.total_leaves}
              </p>
            )}

            <Input
              id="total_leave"
              name="total_leave"
              placeholder="Total Leaves"
              value={formData.total_leave}
              onChange={handleChange}
              autoComplete="off"
              type="number"
              min="0"
            />
          </div>


          <div>
            <label
              htmlFor="role"
              style={{
                display: "block",
                marginBottom: "2px", // keeps label close to select
                fontSize: "0.9rem",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Role
            </label>

            {errors.role && (
              <p
                style={{
                  color: 'red',
                  fontSize: '0.8rem',
                  margin: '0 0 2px 0',
                }}
              >
                {errors.role}
              </p>
            )}

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              autoComplete="off"
              style={{
                width: '100%',
                padding: '0.7rem',
                fontSize: '0.9rem',
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

        <SectionTitle>Employee Legal & ID Information</SectionTitle>

    <ColumnRow>
  {[
    { key: 'phno', label: 'Phone Number', placeholder: 'Enter phone number' },
 {
  key: 'passport_number',
  label: 'Passport Number',
  placeholder: 'Enter passport number',
  type: 'text',
  validate: (value) => {
    if (!/^[A-Z0-9]*$/.test(value)) {
      return "Passport number must contain only uppercase letters and numbers";
    }
    return "";
  },
  transform: (value) => value.toUpperCase(), // ✅ auto-convert to uppercase
}
,
    { key: 'visa_expiry_date', label: 'Visa Expiry Date', type: 'date', placeholder: 'Select visa expiry date' },
    { key: 'iqama_number', label: 'Iqama/Aadhar', placeholder: 'Enter Iqama/Aadhar' },
    { key: 'insurance_number', label: 'Insurance Number', placeholder: 'Enter insurance number' },
    { key: 'contract_expiry_date', label: 'Contract Expiry Date', type: 'date', placeholder: 'Select contract expiry date' },
    { key: 'idcard', label: 'ID Card', placeholder: 'Upload ID Card' },
  ]
    .filter(
      ({ key }) =>
        !(country === "IN" && (key === "visa_expiry_date" || key === "insurance_number"))
    )
    .map(({ key, label, type, placeholder }) => (
      <div key={key} style={{ marginBottom: "1rem" }}>
        {/* ✅ Label above input */}
        <label
          htmlFor={key}
          style={{
            display: "block",
            marginBottom: "2px",
            fontSize: "0.9rem",
            fontWeight: "500",
            color: "#333",
          }}
        >
          {label}
        </label>

        {/* ❌ Error right under label */}
        {errors[key] && (
          <p
            style={{
              color: "red",
              fontSize: "0.8rem",
              margin: "0 0 2px 0",
            }}
          >
            {errors[key]}
          </p>
        )}

        {/* 📄 Input OR File Upload */}
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
              {formData.idcard?.name || placeholder}
            </span>

            <FaPlus style={{ color: '#3352BA', fontSize: '1rem', marginLeft: '0.5rem' }} />

            <input
              id="idcard-upload"
              type="file"
              name="idcard"
              accept="image/*"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  idcard: e.target.files[0],
                }))
              }
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <Input
            id={key}
            name={key}
            type={key === 'visa_expiry_date' || key === 'contract_expiry_date' ? 'text' : type || 'text'}
            placeholder={placeholder}  
            value={formData[key]}
            onChange={handleChange}
            autoComplete="off"
            onFocus={
              key === 'visa_expiry_date' || key === 'contract_expiry_date'
                ? (e) => (e.target.type = 'date')
                : undefined
            }
            onBlur={
              key === 'visa_expiry_date' || key === 'contract_expiry_date'
                ? (e) => {
                    if (!e.target.value) e.target.type = 'text';
                  }
                : undefined
            }
          />
        )}
      </div>
    ))}
</ColumnRow>





        <FlexRow>
          <ApproveButton onClick={handleSubmit}>Next</ApproveButton>
        </FlexRow>

        {status === "loading" && <Spin size="large" tip="Loading..." />}
        {/* {status === 'loading' && <p>Submitting...</p>} */}

      </Container>
    </>
  );
}
