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
} from "./ViewBasic.Style";
import { LuArrowLeft } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeById, submitEmployee } from "../../Redux/employeeSlice";
import { PiUserCirclePlusThin } from "react-icons/pi";
import { NavLink, useLocation, useParams } from "react-router-dom";
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownWrapper } from "../leaveDetails/EmployeeList.styles";
import { IoIosArrowDown } from "react-icons/io";
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
  idcard: employeeDetail.idcard || ""
    });
  }
}, [employeeDetail, departmentList]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async () => {
  // const payload = {
  //   ...formData,
  //   department_id: formData.department,
  // };

  // delete payload.department;
console.log("📤 Submitting employee", formData);

  await dispatch(submitEmployee(formData));
  await dispatch(getEmployeeById(id));
  setEditMode(false);
};
useEffect(() => {
  console.log("Role changed:", formData.role);
}, [formData.role]);

 if (loading || !formData || Object.keys(formData).length === 0) {
  return (
    <FullPageLoaderWrapper>
      <SyncLoader size={12} />
    </FullPageLoaderWrapper>
  );
}

  return (
    <Container>
      <Header>
        <HeaderWrapper>      
          <TitleSection>
                   <LuArrowLeft
            style={{ width: "30px", height: 30, cursor: "pointer" }}
            onClick={() => navigate(-1)}
            />
                  <img src="/images/employee.png" alt=" Icon" style={{ height: "50px" }} />
                  <div>
               
                    <Title>Employee</Title>
                    <Subtitle>Manage your Employee.</Subtitle>
                  </div>
                </TitleSection>
        </HeaderWrapper>
        <Rightside>
                  <DropdownWrapper>
         <HRManager onClick={() => setMenuOpen(!menuOpen)}>
                     <img src="/images/user.jpg" alt="HR Manager" />
                     <IoIosArrowDown
                       size={18}
                       style={{ marginLeft: "5px", cursor: "pointer" }}
                     />
                   </HRManager>
         
                   {menuOpen && (
                     <DropdownMenu>
                       <div>Change Password</div>
                       <div>Logout</div>
                     </DropdownMenu>
                   )}
                 </DropdownWrapper>
          <EditButton onClick={() => setEditMode((prev) => !prev)}>
           {editMode ? "Cancel" : "Edit"}
          </EditButton>
        </Rightside>
      </Header>

      <Hr />
      <h3>Employee Details</h3>

      <FormWrapper>
<ImageColumn style={{ position: "relative", width: "150px", height: "150px" }}>
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
          width: "30px",
          height: "30px",
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
          <Input
            name="designation"
            value={formData.designation || ""}
            onChange={handleChange}
            readOnly={!editMode}
          />
          <Input
            name="joining_date"
            value={formData.joining_date || ""}
            onChange={handleChange}
            readOnly={!editMode}
          />
        </Rowes>

        <Rowes>
        <select
  name="department"
  value={formData.department}
  onChange={handleChange}
  disabled={!editMode}
  style={{
    backgroundColor:'white'
  }}
>
  <option value="">Select Department</option>
  {departmentList.map((dept) => (
    <option key={dept.id} value={dept.id}>
      {dept.name}
    </option>
  ))}
</select>
          <Input
            name="employment_type"
            value={formData.employment_type || ""}
            onChange={handleChange}
            readOnly={!editMode}
          />
        </Rowes>
<Rowes>
  <Input
    type="number"
    name="total_leave"
    placeholder="Total Leaves"
    value={formData.total_leave || ""}
    onChange={handleChange}
    readOnly={!editMode}
  />
</Rowes>

        <GroupLabel>Employee Legal & ID Information</GroupLabel>
        <Column>
          <Input
            name="phno"
            placeholder="Phone Number"
            value={formData.phno || ""}
            onChange={handleChange}
            readOnly={!editMode}
          />
          <Input
            name="passport_number"
            placeholder="Passport Number"
            value={formData.passport_number || ""}
            onChange={handleChange}
            readOnly={!editMode}
          />
          {/* <Input
            name="contract_expiry_date"
            placeholder="contract_expiry_date"
            value={formData.contract_expiry_date || ""}
            onChange={handleChange}
            readOnly={!editMode}
          /> */}
          <Input
            name="visa_expiry_date"
            placeholder="Visa Expiry Date"
            value={formData.visa_expiry_date || ""}
            onChange={handleChange}
            readOnly={!editMode}
          />
          <Input
            name="iqama_number"
            placeholder="Iqama Number"
            value={formData.iqama_number || ""}
            onChange={handleChange}
            readOnly={!editMode}
          />
         
          <Input
            name="insurance_number"
            placeholder="Insurance Number"
            value={formData.insurance_number || ""}
            onChange={handleChange}
            readOnly={!editMode}
          />

        <select
  name="role"
  value={formData.role}
  onChange={handleChange}
  disabled={!editMode}
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


<Input
  type={editMode ? "date" : "text"}
  name="contract_expiry_date"
  placeholder="Contract Expiry Date"
  value={formData.contract_expiry_date || ""}
  onChange={handleChange}
  readOnly={!editMode}
/>
<div>
  {formData.idcard && (
    <img
      src={formData.idcard}
      alt="ID Card"
      style={{ width: '120px', height: 'auto', marginBottom: '10px' }}
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
        </Column>

       
        {editMode && (
  <Button onClick={handleSubmit}>Submit</Button>
)}
        
      </Section>
    </Container>
  );
};

export default ViewBasic;
