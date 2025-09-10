import React, { useEffect, useState } from "react";
import {
  Container,
  DepartmentSelect,
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
  TitleSection
} from "./DetailOnleaveStyles";

import { FaInfoCircle, FaTrash } from "react-icons/fa";
import { NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { PiUserCirclePlusThin } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { getAllEmployees, deleteEmployeeById } from "../../Redux/employeeSlice";
import { getOnLeaveEmployees } from "../../Redux/leaveSlice";
import EmployeeIcon from "../../assets/employeeicon.svg";
import Loader from "../../Components/Loader"
const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const departmentId = searchParams.get("departmentId");

  const { onLeaveEmployees, loading: leaveLoading } = useSelector(
    (state) => state.leave
  );
  
  const { employeeList, loading, pagination } = useSelector(
    (state) => state.employees
  );
  
  const dataToRender = departmentId ? onLeaveEmployees : employeeList;
  const isDataLoading = departmentId ? leaveLoading : loading;
  
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const departmentId = params.get("departmentId");
    if (departmentId) {
      dispatch(getOnLeaveEmployees(departmentId));
    }
  }, [location.search, dispatch]);
  

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
    if (departmentId) {
      dispatch(fetchEmployeesOnLeave(departmentId));
    } else {
      dispatch(getAllEmployees({ page, search: searchText }));
    }
    setShowDeleteModal(false);
    setSelectedEmployeeId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedEmployeeId(null);
  };
console.log(location.pathname.startsWith('/employee-on-leave') ||
      location.pathname.startsWith('/employee-leave'))
  return (
    <>
 {isDataLoading && <Loader />}   
    <Container>
  

      <HeaderSection>
        <TitleSection>
           <img src={EmployeeIcon} alt="employeeIcon" style={{ height: "60px" }} />
          <div>
            <Title>Employee</Title>
            <Subtitle>
           {departmentId ? "Employees On Leave" : "Manage your Employee."}
            </Subtitle>
          </div>
        </TitleSection>
        {!departmentId && (
          <SearchInput
            type="text"
            placeholder="Search by employee name or ID"
            value={searchText}
            onChange={handleSearch}
          />
        )}
      </HeaderSection>

    <Tabs>
  <NavLink to="/employee" style={{ textDecoration: "none" }}>
    <Tab active={location.pathname === "/employee"}>Employee list</Tab>
  </NavLink>

  <NavLink to="/employee-leave-request" style={{ textDecoration: "none" }}>
    <Tab active={location.pathname.startsWith("/employee-leave-request")}>
      Employee leave request
    </Tab>
  </NavLink>

  <NavLink to="/employee-attendance" style={{ textDecoration: "none" }}>
    <Tab active={location.pathname.startsWith("/employee-attendance")}>
      Employee Attendance
    </Tab>
  </NavLink>

  <NavLink to="/employee-Contract-Visa-Expiry" style={{ textDecoration: "none" }}>
    <Tab active={location.pathname.startsWith("/employee-Contract-Visa-Expiry")}>
      Employee Contract & Visa Expiry
    </Tab>
  </NavLink>

  <NavLink to="/employee-on-leave" style={{ textDecoration: "none" }}>
    <Tab
      active={
        location.pathname.startsWith("/employee-on-leave") ||
        location.pathname.startsWith("/employee-leave")
      }
    >
      Employees on Leave
    </Tab>
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
            <th>Visa expiry</th>
            <th>Info</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {isDataLoading ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center", padding: "2rem" }}>
                Loading...
              </td>
            </tr>
          ) : Array.isArray(dataToRender) && dataToRender.length > 0 ? (
            dataToRender.map((emp, index) => (
              <tr key={emp.id}>
                <td>{index + 1 + (page - 1) * 7}</td>
                <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                <td onClick={() => navigate(`/ViewBasic/${emp.id}`)}>
                  <FaInfoCircle />
                </td>
                <td>
                  <FaTrash
                    color="red"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteClick(emp.id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No employees found.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {!departmentId && pagination?.total_pages > 1 && (
        <Pagination>
          <span onClick={() => page > 1 && setPage(page - 1)}>&larr;</span>
          {Array.from({ length: pagination.total_pages }, (_, i) => (
            <span
              key={i + 1}
              onClick={() => setPage(i + 1)}
              style={{
                margin: "0 4px",
                padding: "6px 10px",
                borderRadius: "4px",
                cursor: "pointer",
                backgroundColor: page === i + 1 ? "#003366" : "#e0e0e0",
                color: page === i + 1 ? "#fff" : "#000",
                fontWeight: page === i + 1 ? "bold" : "normal"
              }}
            >
              {i + 1}
            </span>
          ))}
          <span onClick={() => page < pagination.total_pages && setPage(page + 1)}>&rarr;</span>
        </Pagination>
      )}

      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div style={{ background: "white", padding: "2rem", borderRadius: "10px" }}>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this employee?</p>
            <div>
              <button
                onClick={confirmDelete}
                style={{ background: "red", color: "white", marginRight: "1rem" }}
              >
                Delete
              </button>
              <button onClick={cancelDelete} style={{ background: "gray", color: "white" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
    </>
  );
};

export default EmployeeList;
