import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  HeaderSection,
  TopBar,
  Title,
  ActionArea,
  Subtitle,
  FormSection,
  InputGroup,
  Label,
  Input,
  TableWrapper,
  StyledTable,
  Avatar,
  AddButton,
  HRManager,
  IconButton,
  TitleSection,
  DropdownMenu, DropdownWrapper,
  EmployeeImage,
  TextBlock,
  BackArrow, DeleteButton
} from '../department/DepartmentDetails.Styles';
import { FaInfoCircle, FaTrash } from 'react-icons/fa';
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { fetchDepartmentById, updateDepartment } from '../../services/departmentServices';
import { getEmployeesByDepartment, updateDepartmentById, deleteDepartmentById } from '../../Redux/departmentSlice';
import { useNavigate } from 'react-router-dom';
import { deleteEmployeeById } from '../../Redux/employeeSlice';
import Employee from "../../assets/employee.svg";
import { HiArrowLeft } from 'react-icons/hi'; // or another arrow icon of your choice
import { IoIosArrowDown } from "react-icons/io";
import Navbar from '../../Components/Navbar';
import Swal from "sweetalert2";
import Loader from "../../Components/Loader"
import { GoInfo } from 'react-icons/go';

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
      text: `Do you want to delete employee "${employeeName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await dispatch(deleteEmployeeById(employeeId)).unwrap();
          await dispatch(getEmployeesByDepartment(id)); // refresh employee list
  
          Swal.fire({
            title: "Deleted!",
            text: "Employee has been deleted successfully.",
            icon: "success",
            confirmButtonColor: "#3352BA",
          });
        } catch (error) {
          Swal.fire({
            title: "Failed!",
            text: "Something went wrong while deleting the employee.",
            icon: "error",
            confirmButtonColor: "#3352BA",
          });
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
        department_head_id: formData.department_head_id ? parseInt(formData.department_head_id) : null,
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

      await dispatch(updateDepartmentById({ id, data: payload })).unwrap();

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
            <DeleteButton onClick={handleDeleteDepartment}>
              <FaTrash style={{ width: "14px", height: "14px" }} /> Delete
            </DeleteButton>

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
            />
          </InputGroup>
          <InputGroup>
            <Label>Department Code Name</Label>
            <Input
              name="department_code"
              value={formData.department_code}
              onChange={handleChange}
              disabled={!isEditing}
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
                  fontSize: '16px'
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
                <th>Info</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {departmentEmployees.map((emp, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <Avatar src={emp.profile_pic ? `http://178.248.112.16:8000${emp.profile_pic}` : 'https://i.pravatar.cc/40'} />
                    {emp.name}
                  </td>
                  <td>{emp.employee_id}</td>
                  <td>{emp.email}</td>
                  <td>{emp.designation}</td>
                  <td>{department.name}</td>
                  <td>
                    <IconButton onClick={() => navigate(`/ViewBasic/${emp.id}`)}>
                      <GoInfo />
                    </IconButton>

                  </td>
                  <td>
                  <IconButton danger onClick={() => handleDeleteEmployee(emp.id, emp.name)}>
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
