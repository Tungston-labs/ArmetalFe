import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  HeaderSection,
  Title,
  ActionArea,
  Subtitle,
  FormSection,
  InputGroup,
  Label,
  Input,
  TableWrapper,
  StyledTable,
  AddButton,
  IconButton,
  TitleSection,
  EmployeeImage,
  TextBlock,
  BackArrow, 
  ButtonGroup
} from '../department/DepartmentDetails.Styles';
import { FaInfoCircle, FaTrash } from 'react-icons/fa';
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { fetchDepartmentById, updateDepartment } from '../../services/departmentServices';
import { getEmployeesByDepartment, updateDepartmentById, deleteDepartmentById } from '../../Redux/departmentSlice';
import { useNavigate } from 'react-router-dom';
import { deleteEmployeeById } from '../../Redux/employeeSlice';
import Employee from "../../assets/employee.svg";
import { HiArrowLeft } from 'react-icons/hi'; 
import { FaUserCircle } from "react-icons/fa"; 
// import Navbar from '../../Components/Navbar';
import Swal from "sweetalert2";
import Loader from "../../Components/Loader"


const DepartmentDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);


  const { departmentEmployees } = useSelector((state) => state.departments);

  const [department, setDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    department_code: '',
    department_head_id: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const handleConfirmDelete = async () => {
    await dispatch(deleteEmployeeById(selectedEmployeeId));
    await dispatch(getEmployeesByDepartment(id));  // Refetch employee list
    setShowDeleteModal(false);
    setSelectedEmployeeId(null);
  };

  const handleDeleteDepartment = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete this department!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // red
      cancelButtonColor: "#3085d6", // blue
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(deleteDepartmentById(department.id)).unwrap();

          Swal.fire({
            title: "Deleted!",
            text: "Department has been deleted successfully.",
            icon: "success",
            confirmButtonColor: "#3352BA",
          });

          navigate("/department");
        } catch (error) {
          Swal.fire({
            title: "Failed!",
            text: "Something went wrong while deleting.",
            icon: "error",
            confirmButtonColor: "#3352BA",
          });
        }
      }
    });
  };
const handleDeleteEmployee = (employeeId, employeeName) => {
  Swal.fire({
    title: "Are you sure?",
    text: `Employee "${employeeName}" will be permanently deleted from the system.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        // 1️⃣ Delete employee
        await dispatch(deleteEmployeeById(employeeId)).unwrap();

        // 2️⃣ Fetch updated employees in department
        const updatedEmployees = await dispatch(getEmployeesByDepartment(id)).unwrap();

        // 3️⃣ If department was auto-deleted or has no employees
        if (!updatedEmployees || updatedEmployees.length === 0) {
          Swal.fire({
            title: "Department Deleted!",
            text: `Employee "${employeeName}" was the last in this department. The department has been removed automatically.`,
            icon: "success",
            confirmButtonColor: "#3352BA",
          });

          // 4️⃣ Redirect safely (no manual deleteDepartment call)
          navigate("/department");
          return;
        }

        // ✅ Normal case
        Swal.fire({
          title: "Deleted!",
          text: `Employee "${employeeName}" has been deleted successfully.`,
          icon: "success",
          confirmButtonColor: "#3352BA",
        });
      } catch (error) {
        // Handle both employee and department missing cases
        const errMsg =
          error?.detail === "Department not found."
            ? "This department no longer exists — it may have been deleted automatically."
            : "Something went wrong while deleting the employee.";

        Swal.fire({
          title: "Notice",
          text: errMsg,
          icon: "info",
          confirmButtonColor: "#3352BA",
        });

        // Redirect to department list just in case
        navigate("/department");
      }
    }
  });
};



  

  useEffect(() => {
    const getDepartment = async () => {
      try {
        const data = await fetchDepartmentById(id);
        setDepartment(data);
        setFormData({
          name: data.name || '',
          department_code: data.department_code || '',
          department_head_id: data.department_head?.id || ''
        });
      } catch (err) {
        console.error('Error fetching department:', err);
      }
    };
    getDepartment();
  }, [id]);

  useEffect(() => {
    if (id) {
      dispatch(getEmployeesByDepartment(id));
    }
  }, [dispatch, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleUpdate = async () => {
  try {
    const payload = {
      ...formData,
      department_head_id: formData.department_head_id
        ? parseInt(formData.department_head_id)
        : null,
    };

    if (!payload.department_head_id) {
      Swal.fire({
        icon: "warning",
        title: "Missing Department Head",
        text: "Please select a department head before saving.",
        confirmButtonColor: "#3352BA",
      });
      return;
    }

    // Update department in backend
    await dispatch(updateDepartmentById({ id, data: payload })).unwrap();

    // 🔥 Immediately refetch the updated department details
    const updatedData = await fetchDepartmentById(id);
    setDepartment(updatedData);
    setFormData({
      name: updatedData.name || "",
      department_code: updatedData.department_code || "",
      department_head_id: updatedData.department_head?.id || "",
    });

    Swal.fire({
      icon: "success",
      title: "Updated!",
      text: "Department updated successfully.",
      confirmButtonColor: "#3352BA",
    });

    setIsEditing(false);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: "Something went wrong while updating department.",
    });
  }
};

  if (!department) return <Loader />;

  return (
    <>
      {/* <Navbar/> */}
      <Container>

        <HeaderSection>
          <TitleSection>
            <BackArrow onClick={() => navigate("/department")} />
            <EmployeeImage src={Employee} alt="employeeIcon" />
            <TextBlock>
              <Title>Department</Title>
              <Subtitle>Manage all departments within the organization.</Subtitle>
            </TextBlock>
          </TitleSection>


          <ActionArea>
            <ButtonGroup>
          

            <AddButton
              onClick={() => {
                if (isEditing) {
                  handleUpdate(); // Save changes
                }
                setIsEditing(!isEditing);
              }}
            >
              {isEditing ? (
                <>
                  <HiOutlinePencilSquare style={{ width: "18px", height: "19px" }} /> Save
                </>
              ) : (
                <>
                  <HiOutlinePencilSquare style={{ width: "18px", height: "18px" }} /> Edit
                </>
              )}
            </AddButton>
            </ButtonGroup>
          </ActionArea>


        </HeaderSection>


        <FormSection>
          <InputGroup>
            <Label>Department name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              readOnly
              style={{ cursor: "pointer" }}
            />
          </InputGroup>
          <InputGroup>
            <Label>Department Code Name</Label>
            <Input
              name="department_code"
              value={formData.department_code}
              onChange={handleChange}
              // disabled={!isEditing}
              readOnly
              style={{ cursor: "pointer" }}
            />
          </InputGroup>
          <InputGroup>
            <Label>Department head</Label>
            {isEditing ? (
              <select
                name="department_head_id"
                value={formData.department_head_id}
                onChange={handleChange}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '16px',
                    cursor: "pointer" 
                }}
              >
                <option value="">-- Select Department Head --</option>
                {departmentEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            ) : (

              <Input
                name="department_head"
                value={department.department_head?.name || 'Not Assigned'}
                disabled
              />


            )}
          </InputGroup>

        </FormSection>

        <h3>Added employee list</h3>
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Employee name</th>
                <th>Employee ID</th>
                <th>Email ID</th>
                <th>Job Position</th>
                <th>Department</th>
                <th>Delete</th>
              </tr>
            </thead>
  <tbody>
  {departmentEmployees
    .slice() // create a copy to avoid mutating state
    .sort((a, b) => a.name.localeCompare(b.name)) // sort ascending by name
    .map((emp, index) => (
      <tr
        key={index}
        onClick={() =>
          navigate(`/ViewBasic/${emp.id}`, { state: { from: "department" } })
        }
        style={{
          cursor: "pointer",
          transition: "background-color 0.2s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#f4f6fa")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        <td>{index + 1}</td>
        <td style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {emp.profile_pic ? (
            <img
              src={`http://178.248.112.16:8001${emp.profile_pic}`}
              alt={emp.name}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <FaUserCircle size={32} color="#c9cacc" />
          )}
          <span>{emp.name}</span>
        </td>
        <td>{emp.employee_id}</td>
        <td>{emp.email}</td>
        <td>{emp.designation}</td>
        <td>{department.name}</td>
        <td>
          <IconButton
            danger
            onClick={(e) => {
              e.stopPropagation(); // stop row click
              handleDeleteEmployee(emp.id, emp.name);
            }}
          >
            <FaTrash />
          </IconButton>
        </td>
      </tr>
  ))}
</tbody>


          </StyledTable>
        </TableWrapper>
     


      </Container>
    </>
  );
};

export default DepartmentDetail;
