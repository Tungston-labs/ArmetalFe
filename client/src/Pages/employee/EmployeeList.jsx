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
  TitleSection
} from "./EmployeeList.styles";
import { PiUserCirclePlusThin } from "react-icons/pi";
import SyncLoader from "react-spinners/SyncLoader"; // Spinner loader
import { FaInfoCircle, FaTrash, FaPlus } from "react-icons/fa";
import { LuArrowLeft } from "react-icons/lu";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getAllEmployees, deleteEmployeeById } from "../../Redux/employeeSlice";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeList, pagination, loading } = useSelector((state) => state.employees);
console.log(employeeList)
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(pagination?.current_page || 1);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(getAllEmployees({ page, search: searchText }));
  }, [dispatch, page, searchText]);

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
    dispatch(getAllEmployees({ page, search: searchText }));
    setShowDeleteModal(false);
    setSelectedEmployeeId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedEmployeeId(null);
  };
console.log("loading",loading)
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

        <ActionArea>
          <AddButton onClick={() => navigate('/basic-details')}>
            <FaPlus /> Add Employee
          </AddButton>
          <SearchInput
            type="text"
            placeholder="Search by employee name or ID"
            value={searchText}
            onChange={handleSearch}
          />
        </ActionArea>
      </HeaderSection>

      <Tabs>
        <NavLink to="/employee" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/employee'}>Employee list</Tab>
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
      </Tabs>

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
                 <p>Loading...</p>
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
  {/* ← Previous */}
  <span
    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
    style={{
      cursor: page > 1 ? 'pointer' : 'not-allowed',
      marginRight: '8px',
      color: page > 1 ? '#000' : '#ccc',
    }}
  >
    &larr;
  </span>

  {/* Page Numbers */}
  {Array.from({ length: pagination?.total_pages || 1 }, (_, i) => i + 1).map((pageNumber) => {
    const isActive = pageNumber === page;
    return (
      <span
        key={pageNumber}
        onClick={() => setPage(pageNumber)}
        style={{
          margin: '0 4px',
          padding: '6px 12px',
          borderRadius: '6px',
          cursor: 'pointer',
          backgroundColor: isActive ? '#003366' : '#e0e0e0',
          color: isActive ? '#ffffff' : '#000000',
          fontWeight: isActive ? 'bold' : 'normal',
        }}
      >
        {pageNumber}
      </span>
    );
  })}

  {/* → Next */}
  <span
    onClick={() => {
      if (page < (pagination?.total_pages || 1)) {
        setPage(page + 1);
      }
    }}
    style={{
      cursor: page < (pagination?.total_pages || 1) ? 'pointer' : 'not-allowed',
      marginLeft: '8px',
      color: page < (pagination?.total_pages || 1) ? '#000' : '#ccc',
    }}
  >
    &rarr;
  </span>
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
