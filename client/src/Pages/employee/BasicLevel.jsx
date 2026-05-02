import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  submitEmployee,
  setEmployeeId,
  setBasicFormData,
} from "../../Redux/employeeSlice";
import { getDepartments } from "../../Redux/departmentSlice";
import { useNavigate } from "react-router-dom";
import UnsavedChangesGuard from "../../Components/UnsavedChangesGuard";
import {
  Container,
  Header,
  Title,
  Subtitle,
  Hr,
  EmployeeImage,
} from "./BasicLevel.Styles";

import Multistep from "../../Components/Multistep";
import { PiUserCirclePlusThin } from "react-icons/pi";
import JobDetails from "../../Components/JobDetails";
import Loader from "../../Components/Loader";
import EmployeeIcon from "../../assets/employeeicon.svg";
// import Navbar from "../../Components/Navbar";
import EmployeeHeader from "../../Components/EmployeeHeader";
import { ButtonWrapper, NextButton } from "../../Components/JobDetails.Styles";
import EmployeeTitle from "../../Components/EmployeeTitle";
import { Divider } from "../reimbursement/Reimb_info.Styles";

export default function AddEmployeeForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formData: reduxFormData } = useSelector((state) => state.employee);
  const departmentList = useSelector((state) => state.departments.list);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep] = useState(0);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const jobref = useRef();
  const stepTitles = ["Basic Info", "Job Details", "Legal Info"];
  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user"),
  );
  const country = user?.company?.country || "IN";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phno: "",
    address: "",
    dob: "",
    gender: "",
    designation: "",
    joining_date: "",
    department_id: "",
    employment_type: "",
    passport_number: "",
    visa_expiry_date: "",
    iqama_number: "",
    aadar_number: "",
    insurance_number: "",
    profile_pic: null,
    total_leave: "",
    role: "",
    contract_expiry_date: "",
    idcard: null,
  });
useEffect(() => {
  if (departmentList.length === 0) {
    dispatch(getDepartments({ page: 1, search: "" }));
  }
}, [dispatch, departmentList.length]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    // Handle file change separately (like profile_pic)
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files?.[0] || null }));
      dispatch(setBasicFormData({ ...formData, [name]: files?.[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      dispatch(setBasicFormData({ ...formData, [name]: value }));
    }
    setIsFormDirty(true);
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, profile_pic: file }));
    setIsFormDirty(true);
    // You should also update Redux state here if needed
    dispatch(setBasicFormData({ ...formData, profile_pic: file }));
  };

const validateForm = () => {
  const newErrors = {};
  const now = new Date().toISOString().split("T")[0];

  const requiredFields = [
    "name", "address", "email", "dob", "phno",
    "gender", "designation", "joining_date",
    "department_id", "employment_type", "total_leave", "role",
  ];

  if (country !== "IN") {
    requiredFields.push("visa_expiry_date", "insurance_number", "iqama_number");
  } else {
    requiredFields.push("aadar_number");
  }

  requiredFields.forEach((field) => {
    if (!formData[field] || !formData[field].toString().trim()) {
      newErrors[field] = "This field is required";
    }
  });

  // ✅ Add these date checks:
  if (formData.dob && formData.dob >= now) {
    newErrors.dob = "Date of birth must be in the past";
  }
  if (formData.joining_date && formData.joining_date > now) {
    newErrors.joining_date = "Joining date cannot be in the future";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleNext = async () => {


    const isBasicValid = validateForm(); // this triggers setErrors


    const jobComp = jobref.current;


    const isJobValid = jobComp?.validate?.();

    setErrors((prev) => ({ ...prev }));

    if (!isBasicValid || !isJobValid) {

      return;
    }

    setLoading(true);
    try {
      dispatch(setBasicFormData(formData));
      const res = await dispatch(submitEmployee({ basic: formData }));
      if (res.meta.requestStatus === "fulfilled") {
        const id = res.payload?.employee?.id || res.payload?.id;
        if (id) {
          dispatch(setEmployeeId(id));
          setIsFormDirty(false);
          navigate("/bank-payment");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      {loading && <Loader />}
      <Container>
        <UnsavedChangesGuard isDirty={isFormDirty} />

        <EmployeeTitle
          key={departmentList?.length || 0}
          iconSrc={EmployeeIcon}
          showAddButton={false}
          showTabs={false}
          showSearch={false}
          showDropdown={false}
        />
        <div
          style={{ display: "flex", justifyContent: "center", padding: "0px" }}
        >
          <div style={{ width: "50%" }}>
            <Multistep currentStep={currentStep} steps={stepTitles} />
          </div>
        </div>
        
        <EmployeeHeader
          formData={formData}
          setFormData={setFormData}
          setIsFormDirty={setIsFormDirty}
          onFileChange={handleFileChange}
          errors={errors}
        />
        <JobDetails
          country={country}
          departments={departmentList}
          initialValues={formData}
          // validateParent={validateForm}
          onFormChange={handleChange}
          errors={errors}
          ref={jobref}
        />

        <ButtonWrapper>
          <NextButton type="button" onClick={handleNext}>
            Next
          </NextButton>
        </ButtonWrapper>
      </Container>
    </>
  );
}
