import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  HeaderSection,
  TopBar,
  Title,
  Subtitle,
  FormSection,
  InputGroup,
  Label,
  Input,
  TableWrapper,
  StyledTable,
  Avatar,
  HRManager,
  IconButton,
  TitleSection,
  DropdownMenu,
  DropdownWrapper,
} from '../reimbursement/Reimb2page.Styles';
import { FaInfoCircle } from 'react-icons/fa';
import { HiArrowLeft } from "react-icons/hi2";
import { IoIosArrowDown } from "react-icons/io";
import RemiIcon from "../../assets/remi.svg";
import { fetchReimbursementsByDepartment,updateReimbursementStatus } from '../../services/reimbursement'; // <-- your service


const DepartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const [department, setDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    department_code: "",
    department_head_id: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // 🔹 Fetch reimbursements for department
  useEffect(() => {
    const loadReimbursements = async () => {
      try {
        const data = await fetchReimbursementsByDepartment(id);

        if (data.results.length > 0) {
          // department info from first employee
          const deptInfo = data.results[0].department;

          setDepartment(deptInfo);
          setFormData({
            name: deptInfo?.name || "",
            department_code: deptInfo?.department_code || "",
            department_head_id: deptInfo?.hr_name || "",
          });

          setEmployees(data.results);
        }
      } catch (error) {
        console.error("Error fetching reimbursements:", error);
      }
    };

    loadReimbursements();
  }, [id]);

  const handleStatusChange = async (empId, newStatus) => {
    const prevEmployees = [...employees];
    try {
      // Optimistic update
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === empId ? { ...emp, status: newStatus } : emp
        )
      );
  
      // API call
      const res = await updateReimbursementStatus(empId, newStatus);
      console.log("✅ Backend response:", res);
  
    } catch (error) {
      console.error("❌ Failed to update status:", error);
      setEmployees(prevEmployees); // rollback
    }
  };
  


  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    setDepartment({
      ...department,
      name: formData.name,
      department_code: formData.department_code,
      hr_name: formData.department_head_id,
    });
    setIsEditing(false);
  };

  const handleConfirmDelete = () => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== selectedEmployeeId));
    setShowDeleteModal(false);
    setSelectedEmployeeId(null);
  };

  return (
    <Container>
      {/* Top Bar */}
      <TopBar>
        <div />
        <DropdownWrapper>
          <HRManager onClick={() => setMenuOpen(!menuOpen)}>
            <img src="/images/user.jpg" alt="HR Manager" />
            <IoIosArrowDown size={18} style={{ marginLeft: "5px", cursor: "pointer" }} />
          </HRManager>
          {menuOpen && (
            <DropdownMenu>
              <div>Change Password</div>
              <div>Logout</div>
            </DropdownMenu>
          )}
        </DropdownWrapper>
      </TopBar>

      {/* Header */}
      <HeaderSection>
        <TitleSection>
          <HiArrowLeft
            style={{ width: '24px', height: '24px', cursor: 'pointer', color: "#3250B5" }}
            onClick={() => window.history.back()}
          />
          <img src={RemiIcon} alt="employeeIcon" style={{ height: "60px" }} />
          <div>
            <Title>Reimbursement</Title>
            <Subtitle>Manage all departments within the organization.</Subtitle>
          </div>
        </TitleSection>
      </HeaderSection>

      {/* Form */}
      {department && (
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
                  fontSize: '16px',
                }}
              >
                <option value="">-- Select Department Head --</option>
                <option value="MUNEERA">MUNEERA</option>
                <option value="ARUN">ARUN</option>
                <option value="SNEHA">SNEHA</option>
              </select>
            ) : (
              <Input
                name="department_head"
                value={department.hr_name || 'Not Assigned'}
                disabled
              />
            )}
          </InputGroup>
        </FormSection>
      )}

      {/* Employee Table */}
      <h3>Employee Reimbursements</h3>
      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Employee name</th>
              <th>Employee ID</th>
              <th>Job Position</th>
              <th>Department</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={emp.id}>
                <td>{index + 1}</td>
                <td>
                  <Avatar src={emp.profile_pic || 'https://i.pravatar.cc/40'} />
                  {emp.employee_name}
                </td>
                <td>{emp.employee_id}</td>
                <td>{emp.designation}</td>
                <td>{emp.department?.name}</td>
                <td>{emp.amount}</td>
                <td>
                  <select
                    value={emp.status || ""}
                    onChange={(e) => handleStatusChange(emp.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="">Select</option>
                    <option value="Approve">Approve</option>
                    <option value="On Hold">On Hold</option>
                    <option value="In Verification">In Verification</option>                    
                  </select>
                </td>
                <td>
                  <IconButton onClick={() => navigate(`/reimb_info/${emp.id}`)}>
                    <FaInfoCircle />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 999,
        }}>
          <div style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            minWidth: '300px',
            textAlign: 'center',
          }}>
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete employee{' '}
              <strong>{employees.find((e) => e.id === selectedEmployeeId)?.employee_name || 'this employee'}</strong>?
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
