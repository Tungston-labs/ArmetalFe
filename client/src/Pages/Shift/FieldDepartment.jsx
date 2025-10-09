import React, { useEffect, useState } from "react";
import EmployeeModal from "../../Components/EmployeeModal";
import EditProjectModal from "../../Components/EditProjectModal";
import Navbar from "../../Components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById, updateProject, deleteProject } from "../../Redux/fieldShiftSlice";
import {
  PageWrapper,
  Header,
  BackButton,
  FormContainer,
  FormRow,
  InputField,
  ActionButton,
  EmployeesSection,
  TableWrapper,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  AddButton,
} from "./FieldDepartment.Styles";
import {
  IconWrapper,
  Subtitle,
  TitleSection,
  Title,
  TextGroup,
} from "./FieldShift.Styles";
import FieldShiftIcon from "../../assets/shifttopper.svg";
import { GoInfo } from "react-icons/go";
import { FaPlus, FaTrash } from "react-icons/fa";
import { LuArrowLeft } from "react-icons/lu";
import { BiEditAlt } from "react-icons/bi";
import Swal from "sweetalert2";

const FieldShift = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { project, loading, error } = useSelector((state) => state.projects);

  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    punchType: "",
    latitude: "",
    longitude: "",
  });
  const [employees, setEmployees] = useState([]);

  // ✅ Fetch project details on mount
  useEffect(() => {
    if (id) dispatch(getProjectById(id));
  }, [dispatch, id]);

  // ✅ Update form and employee list when project data changes
  useEffect(() => {
    if (project) {
      setFormData({
        projectName: project.name || "",
        punchType: project.punch_type || "",
        latitude: project.latitude || "",
        longitude: project.longitude || "",
      });

      setEmployees(
        project.employees?.map((emp) => ({
          id: emp.id,
          name: emp.name,
          employeeId: emp.employee_id,
          email: emp.email,
          position: emp.designation,
          department: emp.department,
        })) || []
      );
    }
  }, [project]);

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the project!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(deleteProject(id)).unwrap();
          Swal.fire({
            title: "Deleted!",
            text: "The project has been successfully deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          setIsDeleted(true);
        } catch (err) {
          Swal.fire({
            title: "Error!",
            text: "Failed to delete project.",
            icon: "error",
          });
        }
      }
    });
  };


  // ✅ Handle employee delete
  const handleEmployeeDelete = (id) => {
    const employee = employees.find((emp) => emp.id === id);
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${employee.name}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        Swal.fire({
          title: "Deleted!",
          text: `${employee.name} has been removed from the list.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleSaveFromModal = async (updatedData) => {
    const updatedProject = {
      name: updatedData.projectName,
      punch_type: updatedData.punchInType,
      latitude: updatedData.latitude,
      longitude: updatedData.longitude,
    };

    try {
      await dispatch(updateProject({ id, projectData: updatedProject })).unwrap();

      Swal.fire({
        title: "Updated!",
        text: "Project details have been updated successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setIsEditModalOpen(false);
      dispatch(getProjectById(id)); // refresh project data
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Failed to update project.",
        icon: "error",
      });
    }
  };

  // ✅ Show loading and error states
  if (loading) {
    return (
      <>
        <Navbar />
        <PageWrapper>
          <h3>Loading project details...</h3>
        </PageWrapper>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <PageWrapper>
          <h3 style={{ color: "red" }}>Failed to load project: {error}</h3>
        </PageWrapper>
      </>
    );
  }

  return (
    <>
      <Navbar />
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

        {!isDeleted ? (
          <>
            <FormContainer>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "10rem",
                }}
              >
                {/* Left side form */}
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

                {/* Right side buttons */}
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

            {/* ✅ Employees Section */}
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
                      <TableRow key={emp.id} className={i % 2 === 0 ? "even" : ""}>
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
                          <FaTrash
                            color="red"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleEmployeeDelete(emp.id)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
              </TableWrapper>
            </EmployeesSection>

            {showEmployeeModal && (
              <EmployeeModal
                onClose={() => setShowEmployeeModal(false)}
                projectId={id}
              />
            )}

          </>
        ) : (
          <div style={{ textAlign: "center", marginTop: "4rem" }}>
            <h3>The project has been deleted.</h3>
          </div>
        )}
      </PageWrapper>

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
