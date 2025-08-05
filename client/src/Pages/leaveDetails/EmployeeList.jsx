import React, { useEffect, useState } from "react";
import {
  Container,DepartmentSelect,
  HeaderSection,
  Tabs,
  Tab,
  Table,
  Title,
  TopBar,
  ProfileImg,
  Pagination,
  SearchInput,
  AddButton,
  HRManager,
  Subtitle,
  ActionArea,
  TitleSection,
  // FilterSection,
  // SearchWrapper,
  // SearchIcon
} from "./EmployeeList.styles";
import { PiUserCirclePlusThin } from "react-icons/pi";
import { FaInfoCircle, FaTrash, FaPlus } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getAllEmployees, deleteEmployeeById } from "../../Redux/employeeSlice";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeList, pagination, loading } = useSelector((state) => state.employees);

  const [searchText, setSearchText] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [page, setPage] = useState(pagination?.current_page || 1);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(getAllEmployees({ page, search: searchText, department: departmentFilter }));
  }, [dispatch, page, searchText, departmentFilter]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  const handleDeleteClick = (id) => {
    setSelectedEmployeeId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await dispatch(deleteEmployeeById(selectedEmployeeId));
    dispatch(getAllEmployees({ page, search: searchText, department: departmentFilter }));
    setShowDeleteModal(false);
    setSelectedEmployeeId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedEmployeeId(null);
  };

  return (
    <Container>
      <TopBar>
        <div />
        <HRManager>
          <img src="/images/user.jpg" alt="HR Manager" />
          <span>HR Manager</span>
        </HRManager>
      </TopBar>

      <HeaderSection>
        <TitleSection>
          <img src="/images/employee.png" alt="Payroll Icon" style={{ height: "50px" }} />
          <div>
            <Title>Employee</Title>
            <Subtitle>Manage your Employee.</Subtitle>
          </div>
          
        </TitleSection>
          <SearchInput
            type="text"
            placeholder="Search by employee name or ID"
            value={searchText}
            onChange={handleSearch}
          />
       
        <ActionArea>
          <AddButton onClick={() => navigate('/basic-details')}>
            <FaPlus /> Add Employee
          </AddButton>
            <DepartmentSelect>
        <option value="">All Departments</option>
        <option value="Design">Design</option>
        <option value="Engineering">Engineering</option>
        <option value="HR">HR</option>
        {/* Add more departments as needed */}
      </DepartmentSelect>
        </ActionArea>

        {/* <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
            width: "100%"
          }}
        > */}
          {/* Left side: label */}
          {/* <div style={{ fontWeight: "bold" }}>
            Departments <span style={{ color: "#555", fontWeight: 400 }}>{departmentFilter || "All"}</span>
          </div> */}

          {/* Right side: dropdown */}
          {/* <DepartmentSelect
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value=""><strong>Departments</strong></option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
          </DepartmentSelect> */}
        {/* </div> */}

      </HeaderSection>


      <Tabs>
        <NavLink to="/employee" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/employee'}>Total Employee </Tab>
        </NavLink>
        <NavLink to="/leave-request" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/leave-request'}>Employee leave request</Tab>
        </NavLink>
        <NavLink to="/employee-attendance" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/employee-attendance'}>Employee Attendance</Tab>
        </NavLink>
        <NavLink to="/employee-visa" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/employee-visa'}>Employee Visa</Tab>
        </NavLink>
         <NavLink to="/employee-visa" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/employee-visa'}>Employee OnLeave</Tab>
        </NavLink>
        </Tabs>
        <hr style={{marginTop:"-18px"}}></hr>
        
      <Table>
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
          {loading ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "2rem" }}>
                Loading...
              </td>
            </tr>
          ) : Array.isArray(employeeList) && employeeList.length > 0 ? (
            employeeList.map((emp, index) => (
              <tr key={emp.id}>
                <td>{index + 1 + (page - 1) * 7}</td>
                <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {emp.profile_pic ? (
                    <img
                      src={emp.profile_pic}
                      alt={emp.name}
                      style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                    />
                  ) : (
                    <PiUserCirclePlusThin size={40} color="#999" />
                  )}
                  {emp.name}
                </td>
                <td>{emp.employee_id}</td>
                <td>{emp.email}</td>
                <td>{emp.designation}</td>
                <td>{emp.department}</td>
                <td onClick={() => navigate(`/ViewBasic/${emp.id}`)} style={{ cursor: 'pointer' }}>
                  <FaInfoCircle />
                </td>
                <td>
                  <FaTrash color="red" style={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(emp.id)} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>No employees found.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Pagination>
        <span onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>&larr;</span>
        {Array.from({ length: pagination?.total_pages || 1 }, (_, i) => i + 1).map((pageNumber) => (
          <span
            key={pageNumber}
            onClick={() => setPage(pageNumber)}
            className={page === pageNumber ? 'active' : ''}

            
          >
            {pageNumber}
          </span>
        ))}
        <span onClick={() => {
          if (page < (pagination?.total_pages || 1)) setPage(page + 1);
        }}>&rarr;</span>
      </Pagination>

      {showDeleteModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "2rem",
            borderRadius: "10px",
            textAlign: "center",
            maxWidth: "400px",
            width: "100%"
          }}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this employee?</p>
            <div style={{ marginTop: "1rem" }}>
              <button onClick={confirmDelete} style={{
                marginRight: "1rem", backgroundColor: "red", color: "white",
                border: "none", padding: "0.5rem 1rem", borderRadius: "5px", cursor: "pointer"
              }}>Delete</button>
              <button onClick={cancelDelete} style={{
                backgroundColor: "gray", color: "white", border: "none",
                padding: "0.5rem 1rem", borderRadius: "5px", cursor: "pointer"
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default EmployeeList;
