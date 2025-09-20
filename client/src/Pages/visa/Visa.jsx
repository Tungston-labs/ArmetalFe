import React, { useEffect, useState } from "react";
import {
  Container,
  HeaderSection,
  Tabs,
  Tab,
  Table,
  Title,
  Subtitle,
  TitleSection,
  SearchWrapper,
  SearchInput,
  SearchIcon,
  ProfileImg,
  Pagination,
  LoaderOverlay,
  EmployeeImage,
  DepartmentSelect,
} from "./Visa.Styles";
import EmployeeIcon from "../../assets/employeeicon.svg";
import { FaTrash } from "react-icons/fa";
import { PiUserCirclePlusThin } from "react-icons/pi";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllEmployees,
  deleteEmployeeById,
  getUpcomingExpiryEmployees,
} from "../../Redux/employeeSlice";
import Loader from "../../Components/Loader";
import Navbar from "../../Components/Navbar";
import { TextBlock } from "../leaveDetails/EmployeeList.styles";
import { GoInfo } from "react-icons/go";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { employeeList, loading, pagination } = useSelector(
    (state) => state.employees
  );

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [expiryFilter, setExpiryFilter] = useState(""); // '' | 'visa' | 'contract'
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch employees whenever page, searchText, or expiryFilter changes
  useEffect(() => {
    const fetchEmployees = () => {
      if (expiryFilter) {
        dispatch(
          getUpcomingExpiryEmployees({
            expiryType: expiryFilter,
            page,
            search: searchText,
          })
        );
      } else {
        dispatch(getAllEmployees({ page, search: searchText }));
      }
    };
    fetchEmployees();
  }, [dispatch, page, searchText, expiryFilter]);

  // Ensure current page does not exceed total pages
  useEffect(() => {
    if (pagination?.total_pages && page > pagination.total_pages) {
      setPage(pagination.total_pages);
    }
  }, [pagination.total_pages]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleDeleteClick = (id) => {
    setSelectedEmployeeId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await dispatch(deleteEmployeeById(selectedEmployeeId));
    // Refresh list after deletion
    if (expiryFilter) {
      dispatch(
        getUpcomingExpiryEmployees({
          expiryType: expiryFilter,
          page,
          search: searchText,
        })
      );
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

  const currentPage = pagination?.current_page || 1;

  return (
    <>
        <Container>
      <Navbar />
      {loading && (
        <LoaderOverlay>
          <Loader />
        </LoaderOverlay>
      )}

      <HeaderSection>
          <TitleSection>
                  <EmployeeImage  src={EmployeeIcon} alt="employeeIcon" />
                  <TextBlock>
                    <Title>Employee</Title>
                    <Subtitle>Manage your Employee.</Subtitle>
                  </TextBlock>
                </TitleSection>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent:"space-between" }}>
            <SearchWrapper>
              {/* <SearchIcon /> */}
              <SearchInput
                type="text"
                placeholder="Enter Employee ID or Name"
                value={searchText}
                onChange={handleSearch}
              />
            </SearchWrapper>

            <DepartmentSelect
              value={expiryFilter}
              onChange={(e) => {
                setExpiryFilter(e.target.value);
                setPage(1);
              }}
              style={{
                padding: "5px",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              <option value="">All Employees</option>
              <option value="visa">Visa Expiry (next 30 days)</option>
              <option value="contract">Contract Expiry (next 30 days)</option>
            </DepartmentSelect>
          </div>
        </HeaderSection>

        <Tabs>
          <NavLink to="/employee" style={{ textDecoration: "none" }}>
            <Tab active={location.pathname === "/employee"}>Total Employee</Tab>
          </NavLink>
          <NavLink to="/employee-leave-request" style={{ textDecoration: "none" }}>
            <Tab active={location.pathname === "/employee-leave-request"}>
              Employee leave request
            </Tab>
          </NavLink>
          <NavLink to="/employee-attendance" style={{ textDecoration: "none" }}>
            <Tab active={location.pathname === "/employee-attendance"}>
              Employee Attendance
            </Tab>
          </NavLink>
          <NavLink
            to="/employee-Contract-Visa-Expiry"
            style={{ textDecoration: "none" }}
          >
            <Tab active={location.pathname === "/employee-Contract-Visa-Expiry"}>
              Employee Contract & Visa Expiry
            </Tab>
          </NavLink>
          <NavLink to="/employee-on-leave" style={{ textDecoration: "none" }}>
            <Tab active={location.pathname === "/employee-on-leave"}>
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
              <th>Expiry Date</th>
              <th>Info</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8">
                  <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
                    <p>Loading...</p>
                  </div>
                </td>
              </tr>
            ) : employeeList && employeeList.length > 0 ? (
              employeeList.map((emp, index) => (
                <tr key={emp.id}>
                  <td>{index + 1 + (currentPage - 1) * 20}</td>
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
                  <td
                    onClick={() => navigate(`/fulldashboard/${emp.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <GoInfo />
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

        {pagination?.total_pages > 1 && (
          <Pagination>
            <span
              onClick={() => currentPage > 1 && setPage(currentPage - 1)}
              style={{ cursor: "pointer", marginRight: "8px" }}
            >
              &larr;
            </span>

            {Array.from({ length: pagination.total_pages }, (_, i) => {
              const pageNumber = i + 1;
              const isActive = currentPage === pageNumber;
              return (
                <span
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  style={{
                    margin: "0 4px",
                    // padding: "6px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    backgroundColor: isActive ? "#003366" : "#e0e0e0",
                    color: isActive ? "#fff" : "#000",
                    fontWeight: isActive ? "bold" : "normal",
                  }}
                >
                  {pageNumber}
                </span>
              );
            })}

            <span
              onClick={() =>
                currentPage < pagination.total_pages && setPage(currentPage + 1)
              }
              style={{ cursor: "pointer", marginLeft: "8px" }}
            >
              &rarr;
            </span>
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
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "white",
                padding: "2rem",
                borderRadius: "10px",
                textAlign: "center",
                maxWidth: "400px",
                width: "100%",
              }}
            >
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
                    cursor: "pointer",
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
                    cursor: "pointer",
                  }}
                >
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
