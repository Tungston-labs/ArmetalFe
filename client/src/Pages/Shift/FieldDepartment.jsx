import React, { useState } from "react";
import EmployeeModal from "../../Components/EmployeeModal";
import EditProjectModal from "../../Components/EditProjectModal"; 
import {
  PageWrapper,
  Header,
  BackButton,
  FormContainer,
  FormRow,
  InputField,
  ButtonGroup,
  ActionButton,
  EmployeesSection,
  TableWrapper,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  AddButton,


} from "./FieldDepartment.Styles";
import FieldShiftIcon from "../../assets/shifttopper.svg";
import { GoInfo } from "react-icons/go";
import { FaPlus, FaTrash } from "react-icons/fa";
import { LuArrowLeft } from "react-icons/lu";
import { IconWrapper, Subtitle,  TitleSection,  Title,
  TextGroup,} from "./FieldShift.Styles";
import Navbar from "../../Components/Navbar";
import { BiEditAlt } from "react-icons/bi";
const FieldShift = () => {
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    projectName: "Project ABC",
    punchType: "Variant",
    latitude: "12.3456",
    longitude: "78.9012",
  });

  const handleDelete = () => {
    setFormData({
      projectName: "",
      punchType: "Variant",
      latitude: "",
      longitude: "",
    });
  };

  const handleSaveFromModal = (updatedData) => {
    setFormData({
      projectName: updatedData.projectName,
      punchType: updatedData.punchInType,
      latitude: updatedData.latitude,
      longitude: updatedData.longitude,
    });
    setIsEditModalOpen(false);
  };

  const employees = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    name: "Employee",
    employeeId: "EMP125425",
    email: "dummy@gmail.com",
    position: "UI/UX Designer",
    department: "Design Department",
  }));

  return (
    <>
    <Navbar/>
      <PageWrapper>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <LuArrowLeft />
          </BackButton>

          <TitleSection>
            <IconWrapper>
              <img src={FieldShiftIcon} alt="FieldShift" />
            </IconWrapper>
            <TextGroup>
              <Title>FieldShift</Title>
              <Subtitle>Manage all departments within the organization.</Subtitle>
            </TextGroup>
          </TitleSection>
        </Header>
<FormContainer>
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10rem" }}>
    {/* Left: Form fields */}
    <div style={{ flex: "1" }}>
      <FormRow>
        <div>
          <label>Project name</label>
          <InputField value={formData.projectName} disabled />
        </div>
        <div>
          <label>Punch in type</label>
          <InputField value={formData.punchType} disabled />
        </div>
      </FormRow>

      <FormRow>
        <div>
          <label>Latitude</label>
          <InputField value={formData.latitude} disabled />
        </div>
        <div>
          <label>Longitude</label>
          <InputField value={formData.longitude} disabled />
        </div>
      </FormRow>
    </div>

    {/* Right: Buttons */}
   <div
  style={{
    display: "flex",
    gap: "1rem",
    minWidth: "120px",
    marginTop: "2rem",
  }}
>
  <ActionButton color="edit" onClick={() => setIsEditModalOpen(true)}>
    <BiEditAlt style={{ marginRight: "6px" }} />
    Edit
  </ActionButton>
  <ActionButton color="delete" onClick={handleDelete}>
       <FaTrash style={{ marginRight: "6px" }} />
    Delete
  </ActionButton>
</div>
  </div>
</FormContainer>





        <EmployeesSection>
          <div className="employee-header">
            <h2>Employees</h2>
            <AddButton onClick={() => setShowEmployeeModal(true)}>
              <FaPlus /> Add
            </AddButton>
          </div>

          <TableWrapper>
            <Table>
              <thead>
                <TableRow>
                  <TableHeader>Sl No</TableHeader>
                  <TableHeader>Employee Name</TableHeader>
                  <TableHeader>Employee ID</TableHeader>
                  <TableHeader>Email ID</TableHeader>
                  <TableHeader>Job Position</TableHeader>
                  <TableHeader>Department</TableHeader>
                  <TableHeader>Info</TableHeader>
                  <TableHeader>Delete</TableHeader>
                </TableRow>
              </thead>
              <tbody>
                {employees.map((emp, i) => (
                  <TableRow key={i} className={i % 2 === 0 ? "even" : ""}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>{emp.employeeId}</TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell>{emp.position}</TableCell>
                    <TableCell>{emp.department}</TableCell>
                    <TableCell>
                      <GoInfo />
                    </TableCell>
                    <TableCell>
                      <FaTrash color="red" />
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </EmployeesSection>

        {showEmployeeModal && (
          <EmployeeModal onClose={() => setShowEmployeeModal(false)} />
        )}
      </PageWrapper>

      {/* Edit Modal outside PageWrapper */}
      {isEditModalOpen && (
        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveFromModal}
          projectData={{ ...formData, punchInType: formData.punchType }}
        />
      )}
    </>
  );
};

export default FieldShift;
