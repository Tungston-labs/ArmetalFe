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
  Header3,
  BackArrow,
} from '../reimbursement/Reimb2page.Styles';
import { FaInfoCircle } from 'react-icons/fa';
import { FaArrowLeft } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import RemiIcon from "../../assets/remi.svg";
import { fetchReimbursementsByDepartment,updateReimbursementStatus } from '../../services/reimbursement'; // <-- your service
import Navbar from '../../Components/Navbar';
import Loader from "../../Components/Loader"
import { Pagination } from '../leaveDetails/EmployeeList.styles';
import { IoInformationCircleOutline } from "react-icons/io5";
const DepartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const [page, setPage] = useState(1);
const [pagination, setPagination] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const [department, setDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);
  const getStatusStyle = (status) => {
    switch (status) {
      case "Approve":
        return { backgroundColor: "#4B976D", color: "white" }; // Paid → Approve
      case "On Hold":
        return { backgroundColor: "#BA703A", color: "white" };
      case "In Verification":
        return { backgroundColor: "#DD991D", color: "black" }; // Pending
      case "Cancel":
        return { backgroundColor: "#E67B7B", color: "white" };
      default:
        return { backgroundColor: "#fff", color: "#000" };
    }
  };
  
  
  
  
  const [formData, setFormData] = useState({
    name: "",
    department_code: "",
    department_head_id: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // 🔹 Fetch reimbursements for department
 const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadReimbursements = async () => {
    try {
      const data = await fetchReimbursementsByDepartment(id,page);
      if (data.results.length > 0) {
        const deptInfo = data.results[0].department;
        setDepartment(deptInfo);
        setFormData({
          name: deptInfo?.name || "",
          department_code: deptInfo?.department_code || "",
          department_head_id: deptInfo?.hr_name || "",
        });
        setEmployees(data.results);
           if (data.count) {
          setPagination({
            total_pages: Math.ceil(data.count / 20), // 👈 10 = page size
          });
        }
      } else {
        setEmployees([]);
      }
   
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  loadReimbursements();
}, [id,page]);


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
      console.log(" Backend response:", res);
  
    } catch (error) {
      console.error(" Failed to update status:", error);
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
    <>
    {loading && <Loader text="Loading Department..." />}
    {!loading && (
    <Container>
      {/* Top Bar */}
   <Navbar/>

      {/* Header */}
      <HeaderSection>
        <TitleSection>
<BackArrow onClick={() => window.history.back()} />

          <img src={RemiIcon} alt="employeeIcon" style={{ height: "70px" }} />
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
    
      <Header3> Employee Reimbursements </Header3>
      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Employee name</th>
              <th>Employee ID</th>
              <th>Job Position</th>
              <th>Department</th>
              <th>Amount(AED)</th>
              <th>Status</th>
              <th>Info</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={emp.id}>
          <td>{(page - 1) * 20 + (index + 1)}</td>

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
    value={emp.status || ""} // placeholder empty string
    onChange={async (e) => {
      const newStatus = e.target.value;

      // Optimistic UI update
      setEmployees(prev =>
        prev.map(empItem =>
          empItem.id === emp.id ? { ...empItem, status: newStatus } : empItem
        )
      );

      try {
        await updateReimbursementStatus(emp.id, newStatus);
      } catch (err) {
        console.error(err);
        // rollback if API fails
        setEmployees(prev =>
          prev.map(empItem =>
            empItem.id === emp.id ? { ...empItem, status: emp.status } : empItem
          )
        );
      }
    }}
    style={{
      ...getStatusStyle(emp.status),
      appearance: 'none',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      padding: '5px 10px',
      borderRadius: '6px',
      fontWeight: 'bold',
      cursor: 'pointer',
    }}
  >
    <option value="" disabled>Select</option>
    <option value="Approve">Approved</option>
    <option value="On Hold">On Hold</option>
    <option value="In Verification">In Verification</option>
  </select>
</td>




                <td>
                  <IconButton onClick={() => navigate(`/reimbursement_info/${emp.id}`)}>
                    <IoInformationCircleOutline /> 
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>
 <Pagination>
        <span onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
          &larr;
        </span>
        {Array.from({ length: pagination?.total_pages || 1 }, (_, i) => i + 1).map(
          (pageNumber) => (
            <span
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={page === pageNumber ? "active" : ""}
            >
              {pageNumber}
            </span>
          )
        )}
        <span
          onClick={() => {
            if (page < (pagination?.total_pages || 1)) setPage(page + 1);
          }}
        >
          &rarr;
        </span>
      </Pagination>

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
    )}
    </>
  );
};

export default DepartmentDetail;
