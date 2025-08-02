import React, { useEffect, useState } from "react";
import {
  Container,
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
  FilterSection,
  DepartmentSelect,
  SearchWrapper
} from "../employee/EmployeeList.styles";

import { FaInfoCircle, FaTrash, FaPlus } from "react-icons/fa";
import { LuArrowLeft } from "react-icons/lu";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { PiUserCirclePlusThin } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { getAllEmployees, deleteEmployeeById } from "../../Redux/employeeSlice";
import SyncLoader from "react-spinners/SyncLoader";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { employeeList, loading, pagination } = useSelector((state) => state.employees);
  console.log("EmployeeList from Redux:", employeeList);

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("");



  useEffect(() => {
    dispatch(getAllEmployees({ page, search: searchText }));
  }, [dispatch, page, searchText]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPage(1); // Reset to page 1 on new search
  };
  const handleDeleteClick = (id) => {
    setSelectedEmployeeId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await dispatch(deleteEmployeeById(selectedEmployeeId));
    dispatch(getAllEmployees({ page, search: searchText })); // Refetch
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
          {/* <LuArrowLeft style={{ width: "30px", height: 30 }} /> */}
          <img src="/images/employee.png" alt="Payroll Icon" style={{ height: "50px" }} />
          <div>
            <Title>Employee</Title>
            <Subtitle>Manage your Employee.</Subtitle>
          </div>
        </TitleSection>

        {/* Row 1: Search + Add button */}
        <ActionArea>
          <FilterSection>
            <SearchWrapper>
              <SearchInput
                type="text"
                placeholder="Search by employee name or ID"
                value={searchText}
                onChange={handleSearch}
              />
            </SearchWrapper>
          </FilterSection>

          <AddButton onClick={() => navigate('/basic-details')}>
            <FaPlus /> Add Employee
          </AddButton>
        </ActionArea>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
            width: "100%"
          }}
        >
          {/* Left side: label */}
          <div style={{ fontWeight: "bold" }}>
            Departments: <span style={{ color: "#555", fontWeight: 400 }}>{departmentFilter || "All"}</span>
          </div>

          {/* Right side: dropdown */}
          <DepartmentSelect
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
          </DepartmentSelect>
        </div>


      </HeaderSection>


      <Tabs>
        <NavLink to="/employee" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/employee'}>Total Employees</Tab>
        </NavLink>
        <NavLink to="/leave-request" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/leave-request'}>Employee leave request</Tab>
        </NavLink>
        <NavLink to="/on-leave" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/on-leave'}>Employee Attendance</Tab>
        </NavLink>
        <NavLink to="/employee-visa" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/employee-visa'}>Employee Visa</Tab>
        </NavLink>
        <NavLink to="/emp-on-leave" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/emp-on-leave'}>Employees on Leave</Tab>
        </NavLink>
      </Tabs>

      <Table>
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Employee name</th>
            <th>Employee ID</th>
            <th>Email ID</th>
            <th>Visa expiry</th>
            <th>Info</th>
            <th>Delete</th>

          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                  <p>Loading...</p>
                </div>
              </td>
            </tr>
          ) : Array.isArray(employeeList) && employeeList.length > 0 ? (

            employeeList.map((emp, index) => (
              <tr key={emp.id}>
                <td>{index + 1 + (page - 1) * 7}</td>
                <td style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {emp.profile_pic ? (
                    <ProfileImg src={emp.profile_pic} alt="profile" />
                  ) : (
                    <PiUserCirclePlusThin size={40} color="#999" />
                  )}
                  {emp.name}
                </td>
                <td>{emp.employee_id}</td>
                <td>{emp.email}</td>
                <td>{emp.visa_expiry_date}</td>

                <td onClick={() => navigate(`/ViewBasic/${emp.id}`)}><FaInfoCircle /></td>
                <td>
                  <FaTrash color="red" style={{ cursor: 'pointer' }} onClick={() => handleDeleteClick(emp.id)} />
                </td>

              </tr>
            ))
          ) : (
            <tr><td colSpan="8">No employees found.</td></tr>
          )}
        </tbody>
      </Table>

      {pagination?.total_pages > 1 && (
        <Pagination>
          <span
            onClick={() => page > 1 && setPage(page - 1)}
            style={{ cursor: 'pointer', marginRight: '8px' }}
          >
            &larr;
          </span>

          {Array.from({ length: pagination.total_pages }, (_, i) => {
            const pageNumber = i + 1;
            const isActive = page === pageNumber;
            return (
              <span
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                style={{
                  margin: '0 4px',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#003366' : '#e0e0e0',
                  color: isActive ? '#fff' : '#000',
                  fontWeight: isActive ? 'bold' : 'normal',
                }}
              >
                {pageNumber}
              </span>
            );
          })}

          <span
            onClick={() => page < pagination.total_pages && setPage(page + 1)}
            style={{ cursor: 'pointer', marginLeft: '8px' }}
          >
            &rarr;
          </span>
        </Pagination>
      )}



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
              <button
                onClick={confirmDelete}
                style={{
                  marginRight: "1rem",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                style={{
                  backgroundColor: "gray",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </Container>
  );
};

export default EmployeeList;



