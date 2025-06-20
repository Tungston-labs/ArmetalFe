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
} from '../department/DepartmentDetails.Styles';
import { FaInfoCircle, FaTrash } from 'react-icons/fa';
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { fetchDepartmentById, updateDepartment } from '../../services/departmentServices';
import { getEmployeesByDepartment } from '../../Redux/departmentSlice';
import { useNavigate } from 'react-router-dom';
import { deleteEmployeeById } from '../../Redux/employeeSlice';




const DepartmentDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);



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
      await updateDepartment(id, formData);
      const data = await fetchDepartmentById(id);  // Re-fetch full data
      setDepartment(data);
      setFormData({
        name: data.name || '',
        department_code: data.department_code || '',
        department_head: data.department_head?.id || ''
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };


  if (!department) return <p>Loading...</p>;

  return (
    <Container>
      <TopBar>
        <div />
        <HRManager>
          <img src="images/user.jpg" alt="HR Manager" />
          <span>HR Manager</span>
        </HRManager>
      </TopBar>

      <HeaderSection>
        <TitleSection>
          <img src="/images/department.png" alt="Icon" style={{ height: "74px" }} />
          <div>
            <Title>Department</Title>
            <Subtitle>Manage all departments within the organization.</Subtitle>
          </div>
        </TitleSection>
        <ActionArea>
          <AddButton onClick={() => setIsEditing(!isEditing)}>
            <HiOutlinePencilSquare style={{ width: '18px', height: '18px' }} /> {isEditing ? 'Cancel' : 'Edit'}
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
        {isEditing && (
          <AddButton style={{ marginTop: '1rem' }} onClick={handleUpdate}>
            Save Changes
          </AddButton>
        )}
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
                <Avatar src={emp.profile_pic ? `http://localhost:8000${emp.profile_pic}` : 'https://i.pravatar.cc/40'} />

                  {/* <Avatar src={emp.profile_pic || 'https://i.pravatar.cc/40'} alt="" /> */}
                  {emp.name}
                </td>
                <td>{emp.employee_id}</td>
                <td>{emp.email}</td>
                <td>{emp.designation}</td>
                <td>{department.name}</td>
                <td>
                  <IconButton onClick={() => navigate('/view-basic')}>
                    <FaInfoCircle />
                  </IconButton>

                </td>
                <td>
                <IconButton danger onClick={() => {
  setSelectedEmployeeId(emp.id);
  setShowDeleteModal(true);
}}>
  <FaTrash />
</IconButton>

                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>
      {showDeleteModal && (
  <div style={{
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 999
  }}>
    <div style={{
      background: '#fff',
      padding: '2rem',
      borderRadius: '8px',
      minWidth: '300px',
      textAlign: 'center'
    }}>
      <h3>Confirm Delete</h3>
      <p>
  Are you sure you want to delete employee{' '}
  <strong>
    {
      departmentEmployees.find((e) => e.id === selectedEmployeeId)?.name ||
      'this employee'
    }
  </strong>
  ?
</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        <button onClick={() => setShowDeleteModal(false)} style={{ padding: '8px 16px' }}>
          Cancel
        </button>
        <button onClick={handleConfirmDelete} style={{ padding: '8px 16px', background: 'red', color: '#fff' }}>
          Delete
        </button>
      </div>
    </div>
  </div>
)}

    </Container>
  );
};

export default DepartmentDetail;
