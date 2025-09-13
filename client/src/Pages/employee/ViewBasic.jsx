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
  TextGroup,TitleSection,
  Column,
  HRManager,FullPageLoaderWrapper,
  FieldGroup,
} from "./ViewBasic.Style";
import { LuArrowLeft } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeById, submitEmployee } from "../../Redux/employeeSlice";
import { PiUserCirclePlusThin } from "react-icons/pi";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import EmployeeIcon from "../../assets/employeeicon.svg";
import { getDepartments } from "../../Redux/departmentSlice";
import Loader from "../../Components/Loader"
import { Label } from "./BasicLevel.Styles";

const ViewBasic = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const { employeeDetail, loading } = useSelector((state) => state.employees);
  const departmentList = useSelector((state) => state.departments.list);
  console.log("employeeDetail",employeeDetail)
  console.log("departmentList",departmentList)
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
    const [menuOpen, setMenuOpen] = useState(false);
const { user } = useSelector((state) => state.auth);

// 👇 Fetch departments on mount
useEffect(() => {
  dispatch(getDepartments({ page: 1, search: "" }));
}, [dispatch]);



console.log("fff",formData)
const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(getEmployeeById(id));
    }
  }, [dispatch, id]);

useEffect(() => {
  if (employeeDetail) {
    let deptId = "";
    if (typeof employeeDetail.department === "string") {
      // department is a name → convert it to an ID
      const match = departmentList.find((d) => d.name === employeeDetail.department);
      deptId = match ? match.id : "";
    } else if (typeof employeeDetail.department === "number") {
      // department is already an ID
      deptId = employeeDetail.department;
    }

    setFormData({
      ...employeeDetail,
      id: employeeDetail.id, 
      department: deptId,
      total_leave: employeeDetail.total_leave || "",
       contract_expiry_date: employeeDetail.contract_expiry_date || "",
  role: employeeDetail.role || "",
  idcard: employeeDetail.idcard || "",
    company: employeeDetail.company
    });
  }
}, [employeeDetail, departmentList]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async () => {
  let payload = { ...formData };

  // 🧹 Step 1: remove empty or null fields first
  Object.keys(payload).forEach((key) => {
    if (
      payload[key] === "" ||
      payload[key] === null ||
      payload[key] === undefined
    ) {
      delete payload[key];
    }
  });

  // 🧹 Step 2: enforce country-specific validation
  if (employeeDetail?.company?.country === "IN") {
    // Aadhaar required
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
    // Iqama required
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

  // 🧹 Step 3: trim iqama if present
  if (payload.iqama_number) {
    payload.iqama_number = payload.iqama_number.toString().trim();
  }

  console.log("🚀 Final payload:", payload);

  await dispatch(submitEmployee(payload));
  await dispatch(getEmployeeById(id));
  setEditMode(false);
};





useEffect(() => {
  console.log("Role changed:", formData.role);
}, [formData.role]);

if (loading || !formData || Object.keys(formData).length === 0) {
  return (
    <FullPageLoaderWrapper>
      <Loader size="large" tip="Loading..." />
    </FullPageLoaderWrapper>
  );
}

  return (
    
    <Container>
      <Header>
        <HeaderWrapper>      
          <TitleSection>
                   <LuArrowLeft
            style={{ width: "30px", height: 30, cursor: "pointer",color:"#304EB0" }}
            onClick={() => navigate(-1)}
            />
        <img src={EmployeeIcon} alt="employeeIcon" style={{ height: "60px" }} />
                  <div>
               
                    <Title>Employee</Title>
                    <Subtitle style={{color:"#304EB0"}}>Manage your Employee.</Subtitle>
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
      <h3>Employee Details</h3>

      <FormWrapper>
<ImageColumn
 style={{ position: "relative", width: "150px", height: "150px" }}>
  {formData.profile_pic instanceof File || typeof formData.profile_pic === "string" ? (
    <ProfileImage
      src={
        formData.profile_pic instanceof File
          ? URL.createObjectURL(formData.profile_pic)
          : formData.profile_pic
      }
      alt="Profile"
      style={{ width: "150px", height: "150px", borderRadius: "10%", objectFit: "cover" }}
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
          setFormData((prev) => ({
            ...prev,
            profile_pic: e.target.files[0],
          }))
        }
        style={{ display: "none" }}
      />
      <label
        htmlFor="profilePicInput"
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          backgroundColor: "#007bff",
          color: "#fff",
          borderRadius: "50%",
          width: "20px",
          height: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          cursor: "pointer",
        }}
      >
        +
      </label>
    </>
  )}
</ImageColumn>


        <Row>
          <LeftSection>
           
            <Input
              name="name"
              type="text"
              value={formData.name || ""}
              onChange={handleChange}
              readOnly={!editMode}
            />
          <Input
  name="employee_id"
  type="text"
  value={formData.employee_id || ""}
  readOnly={true}
/>
            <Input
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              readOnly={!editMode}
            />
          </LeftSection>

          <RightSection>
            <Textarea
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              readOnly={!editMode}
            />
            <Rows style={{ marginTop: "1rem" }}>
              <Input
                name="dob"
                type="text"
                value={formData.dob || ""}
                onChange={handleChange}
                readOnly={!editMode}
              />
              <Input
                name="gender"
                type="text"
                value={formData.gender || ""}
                onChange={handleChange}
                readOnly={!editMode}
              />
            </Rows>
          </RightSection>
        </Row>
      </FormWrapper>

      <Hr />

      <Section>
        <Tabs>
          <NavLink to={`/ViewBasic/${id}`} style={{ textDecoration: "none" }}>
            <Tab active={location.pathname === `/ViewBasic/${id}`}>Basic Details</Tab>
          </NavLink>

          <NavLink to={`/ViewBasic/${id}/bank`} style={{ textDecoration: "none" }}>
            <Tab active={location.pathname === `/ViewBasic/${id}/bank`}>
              Bank and payment details
            </Tab>
          </NavLink>

          <NavLink to={`/ViewBasic/${id}/documents`} style={{ textDecoration: "none" }}>
            <Tab active={location.pathname === `/ViewBasic/${id}/documents`}>Documents</Tab>
          </NavLink>
        </Tabs>

        <GroupLabel>Job Details</GroupLabel>
        
       <Rowes>
  <div style={{ flex: 1,}}>
    <Label>Designation</Label>
    <Input
      name="designation"
      value={formData.designation || ""}
      onChange={handleChange}
      readOnly={!editMode}
    />
  </div>

  <div style={{ flex: 1 }}>
    <Label>Joining Date</Label>
    <Input
      name="joining_date"
      value={formData.joining_date || ""}
      onChange={handleChange}
      readOnly={!editMode}
    />
  </div>
</Rowes>


       <Rowes>
  <FieldGroup>
    <Label>Department</Label>
    <select
      name="department"
      value={formData.department}
      onChange={handleChange}
      disabled={!editMode}
      style={{
        backgroundColor: "white",
        padding: "0.7rem",
        fontSize: "0.9rem",
        borderRadius: "7px",
        border: "1px solid #052DB4",
        width: "100%",
      }}
    >
      <option value="">Select Department</option>
      {departmentList.map((dept) => (
        <option key={dept.id} value={dept.id}>
          {dept.name}
        </option>
      ))}
    </select>
  </FieldGroup>

  <FieldGroup>
    <Label>Employment Type</Label>
    <Input
      name="employment_type"
      value={formData.employment_type || ""}
      onChange={handleChange}
      readOnly={!editMode}
      placeholder="Employment Type"
    />
  </FieldGroup>
</Rowes>

<Rowes>
  <FieldGroup>
    <Label>Total Leaves</Label>
    <Input
      type="number"
      name="total_leave"
      placeholder="Enter total leaves"
      value={formData.total_leave || ""}
      onChange={handleChange}
      readOnly={!editMode}
    />
  </FieldGroup>
</Rowes>


        <GroupLabel>Employee Legal & ID Information</GroupLabel>
      <Column>
  <FieldGroup>
    <Label>Phone Number</Label>
    <Input
      name="phno"
      placeholder="Phone Number"
      value={formData.phno || ""}
      onChange={handleChange}
      readOnly={!editMode}
    />
  </FieldGroup>

  <FieldGroup>
    <Label>Passport Number</Label>
    <Input
      name="passport_number"
      placeholder="Passport Number"
      value={formData.passport_number || ""}
      onChange={handleChange}
      readOnly={!editMode}
    />
  </FieldGroup>

  {/* 👇 Country-based conditional fields */}
{/* Show Aadhaar if it exists, otherwise show Iqama/Visa/Insurance */}
{formData?.aadar_number ? (
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
) : (
  <>
    <FieldGroup>
      <Label>Visa Expiry Date</Label>
      <Input
        type={editMode ? "date" : "text"}
        name="visa_expiry_date"
        placeholder="Visa Expiry Date"
        value={formData.visa_expiry_date || ""}
        onChange={handleChange}
        readOnly={!editMode}
      />
    </FieldGroup>

    <FieldGroup>
      <Label>Iqama Number</Label>
      <Input
        name="iqama_number"
        placeholder="Iqama Number"
        value={formData.iqama_number || ""}
        onChange={handleChange}
        readOnly={!editMode}
      />
    </FieldGroup>

    <FieldGroup>
      <Label>Insurance Number</Label>
      <Input
        name="insurance_number"
        placeholder="Insurance Number"
        value={formData.insurance_number || ""}
        onChange={handleChange}
        readOnly={!editMode}
      />
    </FieldGroup>
  </>
)}

  <FieldGroup>
    <Label>Role</Label>
    <Select
      name="role"
      value={formData.role}
      onChange={handleChange}
      disabled={!editMode}
    >
      <option value="">Select Role</option>
      <option value="employee">Employee</option>
      <option value="hr">HR</option>
      <option value="manager">Manager</option>
    </Select>
  </FieldGroup>

  <FieldGroup>
    <Label>Contract Expiry Date</Label>
    <Input
      type={editMode ? "date" : "text"}
      name="contract_expiry_date"
      placeholder="Contract Expiry Date"
      value={formData.contract_expiry_date || ""}
      onChange={handleChange}
      readOnly={!editMode}
    />
  </FieldGroup>

  <FieldGroup>
    <Label>ID Card</Label>
    <div>
      {formData.idcard && (
        <img
          src={
            formData.idcard instanceof File
              ? URL.createObjectURL(formData.idcard)
              : formData.idcard
          }
          alt="ID Card"
          style={{ width: "120px", height: "auto", marginBottom: "10px" }}
        />
      )}
      {editMode && (
        <input
          type="file"
          accept="image/*"
          name="idcard"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setFormData({ ...formData, idcard: file });
            }
          }}
        />
      )}
    </div>
  </FieldGroup>
</Column>


       
        {editMode && (
  <Button onClick={handleSubmit}>Submit</Button>
)}
        
      </Section>
    </Container>
  );
};

export default ViewBasic;
