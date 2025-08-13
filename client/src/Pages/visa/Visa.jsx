import React, { useEffect, useState } from "react";
import {
  Container, DepartmentSelect,
  HeaderSection,
  Tabs,
  Tab,
  Table,
  Title,
  TopBar,
  ProfileImg,
  Pagination,
  SearchInput,
  HRManager,
  Subtitle,
  TitleSection,
  DropdownMenu, DropdownWrapper
} from "../leaveDetails/EmployeeList.styles";

import { FaInfoCircle, FaTrash } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { PiUserCirclePlusThin } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { getAllEmployees, deleteEmployeeById } from "../../Redux/employeeSlice";
import { IoIosArrowDown } from "react-icons/io";
import { getUpcomingExpiryEmployees } from "../../Redux/employeeSlice";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { employeeList, loading, pagination } = useSelector((state) => state.employees);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortBy, setSortBy] = useState(""); // visa_expiry_date or contract_expiry_date
  const [expiryFilter, setExpiryFilter] = useState(""); // '' | 'visa' | 'contract'


  useEffect(() => {
    if (expiryFilter) {
      dispatch(getUpcomingExpiryEmployees({
        expiryType: expiryFilter,
        page,
        search: searchText
      }));
    } else if (expiryFilter === "") {
      // Call only if you want "All Employees" mode
      dispatch(getAllEmployees({ page, search: searchText }));
    }
  }, [dispatch, page, searchText, expiryFilter]);
  
  
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handleDeleteClick = (id) => {
    setSelectedEmployeeId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await dispatch(deleteEmployeeById(selectedEmployeeId));
    dispatch(getAllEmployees({ page, search: searchText, sortBy }));
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

      <HeaderSection>
        <TitleSection>
          <img src="/images/employee.png" alt="Payroll Icon" style={{ height: "50px" }} />
          <div>
            <Title>Employee</Title>
            <Subtitle>Manage your Employee.</Subtitle>
          </div>
        </TitleSection>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent:"space-between" }}>
          <SearchInput
            type="text"
            placeholder="Search by employee name or ID"
            value={searchText}
            onChange={handleSearch}
          />
         <select
  value={expiryFilter}
  onChange={(e) => {
    setExpiryFilter(e.target.value);
    setPage(1);
  }}
  style={{
    padding: "8px 10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    cursor: "pointer"
  }}
>
  <option value="">All Employees</option>
  <option value="visa">Visa Expiry (next 30 days)</option>
  <option value="contract">Contract Expiry (next 30 days)</option>
</select>

        </div>
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
        <NavLink to="/employee-Contract-Visa-Expiry" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/employee-Contract-Visa-Expiry'}>Employee Contract & Visa Expiry</Tab>
        </NavLink>
        <NavLink to="/emp-on-leave" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/emp-on-leave'}>Employees on Leave</Tab>
        </NavLink>
      </Tabs>

      <hr style={{ marginTop: "-18px" }} />

      <Table>
        <thead>
          <tr>
            <th>Sl No</th>
            <th>Employee name</th>
            <th>Employee ID</th>
            <th>Email ID</th>
            <th>Expiry Date</th>
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
                 <td
  onClick={() => navigate(`/fulldashboard/${emp.id}`)}
  style={{ cursor: "pointer" }}
>
           <FaInfoCircle />
  </td>
                <td>
                  <FaTrash
                    color="red"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleDeleteClick(emp.id)}
                  />
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
