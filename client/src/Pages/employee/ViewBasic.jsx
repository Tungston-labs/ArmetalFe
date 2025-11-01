// pages/ViewBasic.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Header,
  LeftSection,
  RightSection,
  Textarea,
  EditButton,
  Row,
  Tabs,
  Tab,
  Section,
  GroupLabel,
  Rows,
  Input,
  Select,
  Hr,
  Button,
  ProfileImage,
  Rowes,
  ImageColumn,
  Title,
  FormWrapper,
  Subtitle,
  Rightside,
  HeaderWrapper,
  TitleSection,
  Column,
  FullPageLoaderWrapper,
  FieldGroup,
  FieldWrapper,
  FieldWrappers,
  EmployeeImage,
  ResponsiveH3,
} from "./ViewBasic.Style";
import { LuArrowLeft } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeById, submitEmployee } from "../../Redux/employeeSlice";
import { PiUserCirclePlusThin } from "react-icons/pi";
import { NavLink, useLocation, useParams, useNavigate } from "react-router-dom";
import EmployeeIcon from "../../assets/employeeicon.svg";
import { getDepartments } from "../../Redux/departmentSlice";
import Loader from "../../Components/Loader";
import { Label } from "./BasicLevel.Styles";

const ViewBasic = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { employeeDetail, loading } = useSelector((state) => state.employees);
  const departmentList = useSelector((state) => state.departments.list);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const user = JSON.parse(localStorage.getItem("user")||sessionStorage.getItem("user"));


  // Fetch departments
  useEffect(() => {
    if (departmentList.length === 0) {
      dispatch(getDepartments({ page: 1, search: "" }));
    }
  }, [dispatch, departmentList.length]);

  // Fetch employee details
  useEffect(() => {
    if (id) {
      dispatch(getEmployeeById(id));
    }
  }, [dispatch, id]);

  // inside your component, before the return statement

console.log("Employee Detail:", employeeDetail);
console.log("Form Data:", formData);
console.log("Company Object:", formData.company);
console.log("Company Country:", formData?.company?.country);


useEffect(() => {
  // Run only when valid employee data is fetched
  if (!employeeDetail || Object.keys(employeeDetail).length === 0) return;

  // Compute department ID
  let deptId = "";
  if (typeof employeeDetail.department === "string") {
    const match = departmentList.find((d) => d.name === employeeDetail.department);
    deptId = match ? match.id : "";
  } else if (typeof employeeDetail.department === "number") {
    deptId = employeeDetail.department;
  }

  const company =
    employeeDetail.company && typeof employeeDetail.company === "object"
      ? employeeDetail.company
      : user?.company || { country: "" };

  const updatedFormData = {
    ...employeeDetail,
    department: deptId,
    total_leave: employeeDetail.total_leave || "",
    contract_expiry_date: employeeDetail.contract_expiry_date || "",
    role: employeeDetail.role || "",
    idcard: employeeDetail.idcard || "",
    company,
    aadar_number: employeeDetail.aadar_number || employeeDetail.aadhaar_number || "",
  };

  setFormData((prev) => {
    const same = JSON.stringify(prev) === JSON.stringify(updatedFormData);
    return same ? prev : updatedFormData;
  });
}, [employeeDetail, departmentList, user]);



  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async () => {
    let payload = { ...formData };

    // Remove empty fields
    Object.keys(payload).forEach((key) => {
      if (payload[key] === "" || payload[key] === null || payload[key] === undefined) {
        delete payload[key];
      }
    });

    const country = formData?.company?.country;

    // Country-specific validations
    if (country === "IN") {
      delete payload.iqama_number;
      delete payload.insurance_number;
      delete payload.visa_expiry_date;

      if (!payload.aadar_number?.trim()) {
        alert("Aadhaar number is required for India");
        return;
      }
      if (payload.aadar_number.length !== 12) {
        alert("Aadhaar number must be 12 digits");
        return;
      }
    } else {
      delete payload.aadar_number;

      if (!payload.iqama_number?.trim()) {
        alert("Iqama number is required");
        return;
      }
      if (payload.iqama_number.length !== 12) {
        alert("Iqama number must be 12 digits");
        return;
      }
    }

    await dispatch(submitEmployee(payload));
    await dispatch(getEmployeeById(id));
    setEditMode(false);
  };

  if (loading || !formData || Object.keys(formData).length === 0) {
    return (
      <FullPageLoaderWrapper>
        <Loader size="large" tip="Loading..." />
      </FullPageLoaderWrapper>
    );
  }

  return (
    <Container>
      {/* Header */}
      <Header>
        <HeaderWrapper>
          <TitleSection>
            <LuArrowLeft
              style={{ width: 30, height: 30, cursor: "pointer", color: "#304EB0" }}
              onClick={() => navigate("/employee")}
            />
           <EmployeeImage  src={EmployeeIcon} alt="employeeIcon" />
            <div>
              <Title>Employee</Title>
              <Subtitle>Manage your Employee.</Subtitle>
            </div>
          </TitleSection>
        </HeaderWrapper>
        <Rightside>
          <EditButton onClick={() => setEditMode((prev) => !prev)}>
            {editMode ? "Cancel" : "Edit"}
          </EditButton>
        </Rightside>
      </Header>

      <Hr />
<ResponsiveH3>Employee Details</ResponsiveH3>


      {/* Form */}
      <FormWrapper>
      <ImageColumn style={{ position: "relative" }}>
  {formData.profile_pic ? (
    <ProfileImage
      src={
        formData.profile_pic instanceof File
          ? URL.createObjectURL(formData.profile_pic)
          : formData.profile_pic
      }
      alt="Profile"
    />
  ) : (
    <div
      style={{
        width: "10rem",
        height: "10rem",
        borderRadius: "10%",
        backgroundColor: "#f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <PiUserCirclePlusThin size={100} color="#ccc" />
    </div>
  )}

  {editMode && (
    <>
      <input
        type="file"
        name="profile_pic"
        accept="image/*"
        id="profilePicInput"
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, profile_pic: e.target.files[0] }))
        }
        style={{ display: "none" }}
      />
      <label
        htmlFor="profilePicInput"
        style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          backgroundColor: "#007bff",
          color: "#fff",
          borderRadius: "50%",
          width: 30,
          height: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          cursor: "pointer",
        }}
      >
        +
      </label>
    </>
  )}
</ImageColumn>

        {/* Basic Info */}
  <Row>
  <LeftSection>
    <FieldWrapper>
      <Label>Name</Label>
      <Input name="name" value={formData.name || ""} onChange={handleChange} readOnly={!editMode} />
    </FieldWrapper>

    <FieldWrapper>
      <Label>Employee ID</Label>
      <Input name="employee_id" value={formData.employee_id || ""} readOnly />
    </FieldWrapper>

    <FieldWrapper>
      <Label>Email</Label>
      <Input name="email" value={formData.email || ""} onChange={handleChange} readOnly={!editMode} />
    </FieldWrapper>
  </LeftSection>

  <RightSection>
    <FieldWrapper>
      <Label>Address</Label>
      <Textarea name="address" value={formData.address || ""} onChange={handleChange} readOnly={!editMode} />
    </FieldWrapper>

    <Rows>
     <FieldWrappers>
  <FieldWrapper style={{ flex: 1, marginRight: "1rem" }}>
    <Label>Date of Birth</Label>
    <Input
      name="dob"
      value={formData.dob || ""}
      onChange={handleChange}
      readOnly={!editMode}
    />
  </FieldWrapper>

  <FieldWrapper style={{ flex: 1 }}>
    <Label>Gender</Label>
    <Input
      name="gender"
      value={formData.gender || ""}
      onChange={handleChange}
      readOnly={!editMode}
    />
  </FieldWrapper>
</FieldWrappers>

    </Rows>
  </RightSection>
</Row>

      </FormWrapper>

      <Hr />

      {/* Job & Legal Info */}
      <Section>
        <Tabs>
          <NavLink to={`/ViewBasic/${id}`} style={{ textDecoration: "none" }}>
            <Tab active={location.pathname === `/ViewBasic/${id}`}>Basic Details</Tab>
          </NavLink>
          <NavLink to={`/ViewBasic/${id}/bank`} style={{ textDecoration: "none" }}>
            <Tab active={location.pathname === `/ViewBasic/${id}/bank`}>Bank and payment details</Tab>
          </NavLink>
          <NavLink to={`/ViewBasic/${id}/documents`} style={{ textDecoration: "none" }}>
            <Tab active={location.pathname === `/ViewBasic/${id}/documents`}>Documents</Tab>
          </NavLink>
        </Tabs>

        <GroupLabel>Job Details</GroupLabel>
        <Rowes>
          <FieldGroup>
            <Label>Designation</Label>
            <Input name="designation" value={formData.designation || ""} onChange={handleChange} readOnly={!editMode} />
          </FieldGroup>
          <FieldGroup>
            <Label>Joining Date</Label>
            <Input name="joining_date" value={formData.joining_date || ""} onChange={handleChange} readOnly={!editMode} />
          </FieldGroup>
        </Rowes>

        <Rowes>
          <FieldGroup>
            <Label>Department</Label>
           <Select
  name="department"
  value={formData.department || ""}
  onChange={handleChange}
  disabled={!editMode}
>
  <option value="">Select Department</option>
  {departmentList.map((dept) => (
    <option key={dept.id} value={dept.id}>
      {dept.name}
    </option>
  ))}
</Select>
          </FieldGroup>

          <FieldGroup>
            <Label>Employment Type</Label>
            <Input name="employment_type" value={formData.employment_type || ""} onChange={handleChange} readOnly={!editMode} />
          </FieldGroup>
        </Rowes>

        <Rowes>
          <FieldGroup>
            <Label>Total Leaves</Label>
            <Input type="number" name="total_leave" value={formData.total_leave || ""} onChange={handleChange} readOnly={!editMode} />
          </FieldGroup>
        </Rowes>

        <GroupLabel>Employee Legal & ID Information</GroupLabel>
        <Column>
          <FieldGroup>
            <Label>Phone Number</Label>
            <Input name="phno" value={formData.phno || ""} onChange={handleChange} readOnly={!editMode} />
          </FieldGroup>

          <FieldGroup>
            <Label>Passport Number</Label>
            <Input name="passport_number" value={formData.passport_number || ""} onChange={handleChange} readOnly={!editMode} />
          </FieldGroup>

          {/* Country-based conditional fields */}
      {/* Country-based conditional fields */}
{formData?.company?.country === "IN" ? (
  <>
    {console.log("Rendering Aadhaar Field, country:", formData.company.country)}
    <FieldGroup>
      <Label>Aadhaar Number</Label>
      <Input
        name="aadar_number"
        placeholder="Aadhaar Number"
        value={formData.aadar_number || ""}
        onChange={handleChange}
        readOnly={!editMode}
      />
    </FieldGroup>
  </>
) : (
  <>
    {console.log("Rendering Iqama/Insurance/Visa Fields, country:", formData?.company?.country)}
    <FieldGroup>
      <Label>Visa Expiry Date</Label>
      <Input
        type={editMode ? "date" : "text"}
        name="visa_expiry_date"
        value={formData.visa_expiry_date || ""}
        onChange={handleChange}
        readOnly={!editMode}
      />
    </FieldGroup>
    <FieldGroup>
      <Label>Iqama Number</Label>
      <Input
        name="iqama_number"
        value={formData.iqama_number || ""}
        onChange={handleChange}
        readOnly={!editMode}
      />
    </FieldGroup>
    <FieldGroup>
      <Label>Insurance Number</Label>
      <Input
        name="insurance_number"
        value={formData.insurance_number || ""}
        onChange={handleChange}
        readOnly={!editMode}
      />
    </FieldGroup>
  </>
)}


          <FieldGroup>
            <Label>Role</Label>
            <Select name="role" value={formData.role || ""} onChange={handleChange} disabled={!editMode}>
              <option value="">Select Role</option>
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
              <option value="manager">Manager</option>
            </Select>
          </FieldGroup>

          <FieldGroup>
            <Label>Contract Expiry Date</Label>
            <Input type={editMode ? "date" : "text"} name="contract_expiry_date" value={formData.contract_expiry_date || ""} onChange={handleChange} readOnly={!editMode} />
          </FieldGroup>

          <FieldGroup>
            <Label>ID Card</Label>
            <div>
              {formData.idcard && (
                <img
                  src={formData.idcard instanceof File ? URL.createObjectURL(formData.idcard) : formData.idcard}
                  alt="ID Card"
                  style={{ width: 120, height: "auto", marginBottom: 10 }}
                />
              )}
              {editMode && (
                <input type="file" accept="image/*" name="idcard" onChange={(e) => setFormData({ ...formData, idcard: e.target.files[0] })} />
              )}
            </div>
          </FieldGroup>
        </Column>

        {editMode && <Button onClick={handleSubmit}>Submit</Button>}
      </Section>
    </Container>
  );
};

export default ViewBasic;
