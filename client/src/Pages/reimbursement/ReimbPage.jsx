import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  FormSection,
  InputGroup,
  Label,
  Input,
  TableWrapper,
  StyledTable,
  Avatar,
  Header3,
} from './Reimbpage.Styles';
import RemiIcon from "../../assets/remi.svg";
import { fetchReimbursementsByDepartment, updateReimbursementStatus } from '../../services/reimbursement';
import Navbar from '../../Components/Navbar';
import Loader from "../../Components/Loader"
import { Pagination } from '../leaveDetails/EmployeeList.styles';
import EmployeeTitle from '../../Components/EmployeeTitle';

const DepartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [department, setDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    department_code: "",
    department_head_id: "",
  });

  // ✅ Status color mapping
  const getStatusStyle = (status) => {
    switch (status) {
      case "Approve": return { backgroundColor: "#4B976D", color: "white" };
      case "On Hold": return { backgroundColor: "#BA703A", color: "white" };
      case "In Verification": return { backgroundColor: "#DD991D", color: "black" };
      case "Cancel": return { backgroundColor: "#E67B7B", color: "white" };
      default: return { backgroundColor: "#fff", color: "#000" };
    }
  };

  // 🔹 Fetch reimbursements for department
  useEffect(() => {
    const loadReimbursements = async () => {
      setLoading(true);
      try {
        const data = await fetchReimbursementsByDepartment(id, page);

        if (data.results.length > 0) {
          const deptInfo = data.results[0].department;
          setDepartment(deptInfo);
          setFormData({
            name: deptInfo?.name || "",
            department_code: deptInfo?.department_code || "",
            department_head_id: deptInfo?.hr_name || "",
          });

          // Map reimbursement id separately
          const mappedEmployees = data.results.map((r) => ({
            ...r,
            reimbursement_id: r.id, // Use this for navigation & status updates
          }));
          setEmployees(mappedEmployees);

          if (data.count) {
            setPagination({
              total_pages: Math.ceil(data.count / 20),
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
  }, [id, page]);

  // 🔹 Handle status update
  const handleStatusChange = async (reimbursementId, newStatus) => {
    const prevEmployees = [...employees];
    try {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.reimbursement_id === reimbursementId ? { ...emp, status: newStatus } : emp
        )
      );

      await updateReimbursementStatus(reimbursementId, newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
      setEmployees(prevEmployees); // rollback
    }
  };

  // 🔹 Form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Save department updates
  const handleUpdate = () => {
    setDepartment({
      ...department,
      name: formData.name,
      department_code: formData.department_code,
      hr_name: formData.department_head_id,
    });
    setIsEditing(false);
  };

  return (
    <>
      <Navbar/>
      {loading && <Loader text="Loading Department..." />}
      {!loading && (
        <Container>
          {/* Header */}
          <EmployeeTitle
            iconSrc={RemiIcon}
            title="Reimbursement"
            subtitle="Manage all departments within the organization"
            showAddButton={false}
            showDropdown={false}
            showTabs={false}
            showSearch={false}
          />

          {/* Department Form */}
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
                <Label>Department Code</Label>
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
          <Header3>Employee Reimbursements</Header3>
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
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, index) => (
                  <tr
                    key={emp.reimbursement_id}
                    onClick={() => navigate(`/reimbursement_info/${emp.reimbursement_id}`)}
                    style={{ cursor: "pointer", transition: "background-color 0.2s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td>{(page - 1) * 20 + (index + 1)}</td>
                    <td>
                      <Avatar src={emp.profile_pic || 'https://i.pravatar.cc/40'} />
                      {emp.employee_name}
                    </td>
                    <td>{emp.employee_id}</td>
                    <td>{emp.designation}</td>
                    <td>{emp.department?.name}</td>
                    <td>{emp.amount}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        value={emp.status || ""}
                        onChange={(e) => handleStatusChange(emp.reimbursement_id, e.target.value)}
                        style={{
                          ...getStatusStyle(emp.status),
                          appearance: "none",
                          WebkitAppearance: "none",
                          MozAppearance: "none",
                          padding: "5px 10px",
                          borderRadius: "6px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        <option value="" disabled>Select</option>
                        <option value="Approve">Approved</option>
                        <option value="On Hold">On Hold</option>
                        <option value="In Verification">In Verification</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </TableWrapper>

          {/* Pagination */}
          <Pagination>
            <span onClick={() => setPage(prev => Math.max(prev - 1, 1))}>&larr;</span>
            {Array.from({ length: pagination?.total_pages || 1 }, (_, i) => i + 1).map((pageNumber) => (
              <span
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={page === pageNumber ? "active" : ""}
              >
                {pageNumber}
              </span>
            ))}
            <span
              onClick={() => {
                if (page < (pagination?.total_pages || 1)) setPage(page + 1);
              }}
            >
              &rarr;
            </span>
          </Pagination>
        </Container>
      )}
    </>
  );
};

export default DepartmentDetail;
