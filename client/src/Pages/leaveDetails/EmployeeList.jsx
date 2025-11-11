import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Pagination,
  TruncatedText,
} from "./EmployeeList.styles";
import {
  ModalOverlay,
  ModalContainer,
  ModalTitle,
  ModalText,
  ModalButton,
  ModalButtonWrapper,
} from "./DeletModal.styles";
import { PiUserCirclePlusThin } from "react-icons/pi";
import { FaTrash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllEmployees, deleteEmployeeById } from "../../Redux/employeeSlice";
import { getDepartments } from "../../Redux/departmentSlice";
import EmployeeIcon from "../../assets/employeeicon.svg";
import Navbar from "../../Components/Navbar";
import Loader from "../../Components/Loader";
import EmployeeTitle from "../../Components/EmployeeTitle";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [departmentFilter, setDepartmentFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Employee & Department state
  const { employeeList, pagination, loading } = useSelector(
    (state) => state.employees
  );
  const { list: departmentList, loading: deptLoading } = useSelector(
    (state) => state.departments
  );

  // Fetch all departments once
  useEffect(() => {
    dispatch(getDepartments());
  }, [dispatch]);

  // Fetch all employees (only once initially or on filter/page change)
  useEffect(() => {
    dispatch(
      getAllEmployees({
        page,
        search: "", // we handle filtering locally
        department_id: departmentFilter,
      })
    );
  }, [dispatch, page, departmentFilter]);

  // Debounce search text input (wait 300ms before applying)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchText), 300);
    return () => clearTimeout(handler);
  }, [searchText]);

  const handleDeleteClick = (id) => {
    setSelectedEmployeeId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await dispatch(deleteEmployeeById(selectedEmployeeId));
    dispatch(
      getAllEmployees({
        page,
        search: "",
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
        search: "",
        department_id: departmentFilter,
      })
    ).then(() => {
      setPage(newPage);
    });
  };

  // Local filtering: matches employee name OR employee ID
  const filteredEmployees = Array.isArray(employeeList)
    ? employeeList.filter(
        (emp) =>
          emp.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          emp.employee_id
            ?.toString()
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase())
      )
    : [];

  return (
    <>
      {loading && <Loader />}
      <Navbar />
      <Container>
        <EmployeeTitle
          iconSrc={EmployeeIcon}
          dropdownOptions={departmentList || []}
          dropdownLoading={deptLoading}
          onAddClick={() => navigate("/basic-details")}
          onSearchChange={setSearchText}
          onDropdownChange={setDepartmentFilter}
          showBackArrow={false}
          showTabs={true}
        />

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
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp, index) => (
                    <tr
                      key={emp.id}
                      onClick={() =>
                        navigate(`/fulldashboard/${emp.id}`, {
                          state: { from: location.pathname },
                        })
                      }
                      style={{
                        cursor: "pointer",
                        transition: "background 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#f9f9ff")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td>{index + 1 + (page - 1) * 20}</td>
                      <td
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        {emp.profile_pic ? (
                          <img
                            src={emp.profile_pic}
                            alt={emp.name}
                            style={{
                              width: "25px",
                              height: "25px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "25px",
                              height: "25px",
                              borderRadius: "50%",
                              backgroundColor: "#f0f0f0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <PiUserCirclePlusThin size={20} color="#999" />
                          </div>
                        )}
                        {emp.name}
                      </td>

                      <td>{emp.employee_id}</td>
                      <td>
                        <TruncatedText title={emp.email}>
                          {emp.email}
                        </TruncatedText>
                      </td>
                      <td>
                        <TruncatedText title={emp.designation}>
                          {emp.designation}
                        </TruncatedText>
                      </td>
                      <td>
                        <TruncatedText title={emp.department}>
                          {emp.department}
                        </TruncatedText>
                      </td>

                      <td
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(emp.id);
                        }}
                      >
                        <FaTrash color="red" style={{ cursor: "pointer" }} />
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
              <span onClick={() => handlePageChange(Math.max(page - 1, 1))}>
                &larr;
              </span>
              {Array.from(
                { length: pagination?.total_pages || 1 },
                (_, i) => i + 1
              ).map((pageNumber) => (
                <span
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={page === pageNumber ? "active" : ""}
                >
                  {pageNumber}
                </span>
              ))}
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
              <ModalText>
                Are you sure you want to delete this employee?
              </ModalText>

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
