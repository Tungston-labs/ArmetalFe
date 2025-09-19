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
  AddButton,
  HRManager,
  Subtitle,
  ActionArea,
  TitleSection,
  DropdownWrapper,
  DropdownMenu,
  SearchWrapper,
  SearchIcon,
  TopRow,
  BottomRow,
  TextBlock,
  EmployeeImage,
} from "./EmployeeList.styles";
import {
  ModalOverlay,
  ModalContainer,
  ModalTitle,
  ModalText,
  ModalButton,
  ModalButtonWrapper
} from "./DeletModal.styles";
import { PiUserCirclePlusThin } from "react-icons/pi";
import { FaInfoCircle, FaTrash, FaPlus } from "react-icons/fa";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllEmployees, deleteEmployeeById } from "../../Redux/employeeSlice";
import { getDepartments } from "../../Redux/departmentSlice";
import EmployeeIcon from "../../assets/employeeicon.svg";
import Navbar from "../../Components/Navbar";
import Loader from "../../Components/Loader"
import { FiSearch } from "react-icons/fi";
import { GoInfo } from "react-icons/go";
const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [departmentFilter, setDepartmentFilter] = useState("");
  

  // Employee state
  const { employeeList, pagination, loading } = useSelector(
    (state) => state.employees
  );

  // Department state (FIX)
  const { list: departmentList, loading: deptLoading } = useSelector(
    (state) => state.departments
  );
  

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(pagination?.current_page || 1);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch employees
  useEffect(() => {
    dispatch(
      getAllEmployees({
        page,
        search: searchText,
        department_id: departmentFilter,
      })
    );
  }, [dispatch, page, searchText, departmentFilter]);

  // Fetch departments
  useEffect(() => {
    dispatch(getDepartments());
  }, [dispatch]);

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
    dispatch(
      getAllEmployees({
        page,
        search: searchText,
        department_id: departmentFilter,
      })
    );
    setShowDeleteModal(false);
    setSelectedEmployeeId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedEmployeeId(null);
  };
  const handlePageChange = (newPage) => {
    dispatch(
      getAllEmployees({
        page: newPage,
        search: searchText,
        department_id: departmentFilter,
      })
    ).then(() => {
      setPage(newPage); // update only after data loads
    });
  };
  

  return (
  <>
    {loading && <Loader />} {/* Full-page loader */}
    <Navbar />
    <Container>
     <HeaderSection>
  {/* Top row: Title + Add Button */}
  <TopRow>
  <TitleSection>
  <EmployeeImage  src={EmployeeIcon} alt="employeeIcon" />
  <TextBlock>
    <Title>Employee</Title>
    <Subtitle>Manage your Employee.</Subtitle>
  </TextBlock>
</TitleSection>



    <AddButton onClick={() => navigate("/basic-details")}>
      <FaPlus /> Add Employee
    </AddButton>
  </TopRow>

  {/* Bottom row: Search + Department */}
  <BottomRow>
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
      value={departmentFilter}
      onChange={(e) => setDepartmentFilter(e.target.value)}
    >
      <option value="">All Departments</option>
      {deptLoading ? (
        <option>Loading...</option>
      ) : departmentList && departmentList.length > 0 ? (
        departmentList.map((dept) => (
          <option key={dept.id} value={dept.id}>
            {dept.name}
          </option>
        ))
      ) : (
        <option>No departments found</option>
      )}
    </DepartmentSelect>
  </BottomRow>
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

      {/* ✅ Show table only when NOT loading */}
      {!loading && (
        <>
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
              {Array.isArray(employeeList) && employeeList.length > 0 ? (
                employeeList.map((emp, index) => (
                  <tr key={emp.id}>
                    <td>{index + 1 + (page - 1) * 20}</td>
                    <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {emp.profile_pic ? (
                        <img
                          src={emp.profile_pic}
                          alt={emp.name}
                          style={{
                            width: "25px",
                            height: "25px",
                            borderRadius: "50%",
                          }}
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
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          <Pagination>
  <span onClick={() => handlePageChange(Math.max(page - 1, 1))}>&larr;</span>
  {Array.from({ length: pagination?.total_pages || 1 }, (_, i) => i + 1).map(
    (pageNumber) => (
      <span
        key={pageNumber}
        onClick={() => handlePageChange(pageNumber)}
        className={page === pageNumber ? "active" : ""}
      >
        {pageNumber}
      </span>
    )
  )}
  <span
    onClick={() => {
      if (page < (pagination?.total_pages || 1)) {
        handlePageChange(page + 1);
      }
    }}
  >
    &rarr;
  </span>
</Pagination>

        </>
      )}

     {showDeleteModal && (
  <ModalOverlay>
   <ModalContainer>
  <ModalTitle>Confirm Deletion</ModalTitle>
  <ModalText>Are you sure you want to delete this employee?</ModalText>

  {/* Use the styled wrapper for responsive button layout */}
  <ModalButtonWrapper>
    <ModalButton bg="red" onClick={confirmDelete}>
      Delete
    </ModalButton>
    <ModalButton bg="gray" onClick={cancelDelete}>
      Cancel
    </ModalButton>
  </ModalButtonWrapper>
</ModalContainer>

  </ModalOverlay>
)}
    </Container>
  </>
);

};

export default EmployeeList;
