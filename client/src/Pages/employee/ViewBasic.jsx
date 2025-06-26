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
  TextGroup,
  Column,
  HRManager,
} from "./ViewBasic.Style";

import { useDispatch, useSelector } from "react-redux";
import { getEmployeeById, submitEmployee } from "../../Redux/employeeSlice";

import { NavLink, useLocation, useParams } from "react-router-dom";

const ViewBasic = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = useParams();
  const { employeeDetail, loading } = useSelector((state) => state.employees);
  const departmentList = useSelector((state) => state.departments.list);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(getEmployeeById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (employeeDetail) {
      setFormData({ ...employeeDetail });
    }
  }, [employeeDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async () => {
  await dispatch(submitEmployee(formData));
  await dispatch(getEmployeeById(id)); // refresh Redux state after submit
  setEditMode(false);
};

  if (loading || !formData) return <p>Loading employee details...</p>;

  return (
    <Container>
      <Header>
        <HeaderWrapper>
          <div style={{ width: "10%" }}>
            <img src="/images/employee.png" alt="Icon" style={{ height: "50px" }} />
          </div>
          <TextGroup>
            <Title>Employee</Title>
            <Subtitle>Manage your Employee.</Subtitle>
          </TextGroup>
        </HeaderWrapper>
        <Rightside>
          <HRManager>
            <img src="/images/user.jpg" alt="HR Manager" />
            <span>HR Manager</span>
          </HRManager>
          <EditButton onClick={() => setEditMode((prev) => !prev)}>
           {editMode ? "Cancel" : "Edit"}
          </EditButton>
        </Rightside>
      </Header>

      <Hr />
      <h3>Employee Details</h3>

      <FormWrapper>
        <ImageColumn>
          <ProfileImage src={formData.profile_pic || "/profile-placeholder.png"} alt="Profile" />
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
          <Input
            name="work_permit"
            placeholder="Work Permit"
            value={formData.work_permit || ""}
            onChange={handleChange}
            readOnly={!editMode}
          />
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
            name="contract_id"
            placeholder="Employment Contract"
            value={formData.contract_id || ""}
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
        </Column>

       
        {editMode && (
  <Button onClick={handleSubmit}>Submit</Button>
)}
        
      </Section>
    </Container>
  );
};

export default ViewBasic;
