import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  ProfileImg,
  Pagination,
  LoaderOverlay,
} from "./Visa.Styles";
import EmployeeIcon from "../../assets/employeeicon.svg";
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
import EmployeeTitle from "../../Components/EmployeeTitle";

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { employeeList, loading, pagination } = useSelector(
    (state) => state.employees
  );

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expiryFilter, setExpiryFilter] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ✅ Debounce search: wait 500ms after user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchText]);

  // ✅ Fetch employees on page, expiry filter, or debounced search change
  useEffect(() => {
    const fetchEmployees = () => {
      if (expiryFilter) {
        dispatch(
          getUpcomingExpiryEmployees({
            expiryType: expiryFilter,
            page,
            search: debouncedSearch,
          })
        );
      } else {
        dispatch(getAllEmployees({ page, search: debouncedSearch }));
      }
    };
    fetchEmployees();
  }, [dispatch, page, debouncedSearch, expiryFilter]);

  // ✅ Prevent page overflow
  useEffect(() => {
    if (pagination?.total_pages && page > pagination.total_pages) {
      setPage(pagination.total_pages);
    }
  }, [pagination.total_pages]);

  const handleSearch = (value) => {
    setSearchText(value);
    setPage(1);
  };

  const handleDeleteClick = (id) => {
    setSelectedEmployeeId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await dispatch(deleteEmployeeById(selectedEmployeeId));
    if (expiryFilter) {
      dispatch(
        getUpcomingExpiryEmployees({
          expiryType: expiryFilter,
          page,
          search: debouncedSearch,
        })
      );
    } else {
      dispatch(getAllEmployees({ page, search: debouncedSearch }));
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
      <Navbar />
      <Container>
        {loading && (
          <LoaderOverlay>
            <Loader />
          </LoaderOverlay>
        )}

        <EmployeeTitle
          iconSrc={EmployeeIcon}
          showAddButton={false}
          showSearch={true}
          showDropdown={true}
          showBackArrow={false}
          dropdownOptions={[
            { id: "visa", name: "Visa Expiry (next 30 days)" },
            { id: "contract", name: "Contract Expiry (next 30 days)" },
          ]}
          onDropdownChange={(value) => {
            setExpiryFilter(value);
            setPage(1);
          }}
          onSearchChange={(value) => handleSearch(value)}
        />

        <Table>
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Employee Name</th>
              <th>Employee ID</th>
              <th>Email ID</th>
              <th>Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "2rem",
                    }}
                  >
                    <p>Loading...</p>
                  </div>
                </td>
              </tr>
            ) : employeeList && employeeList.length > 0 ? (
              employeeList.map((emp, index) => (
                <tr
                  key={emp.id}
                  style={{
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f0f4ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td>{index + 1 + (currentPage - 1) * 20}</td>
                  <td
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {emp.profile_pic ? (
                      <ProfileImg src={emp.profile_pic} alt="profile" />
                    ) : (
                      <PiUserCirclePlusThin size={40} color="#999" />
                    )}
                    {emp.name}
                  </td>
                  <td>{emp.employee_id}</td>
                  <td>{emp.email}</td>
                  <td>
                    {expiryFilter === "contract"
                      ? emp.contract_expiry_date || "----"
                      : emp.visa_expiry_date || "----"}
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

        {/* Pagination */}
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
                currentPage < pagination.total_pages &&
                setPage(currentPage + 1)
              }
              style={{ cursor: "pointer", marginLeft: "8px" }}
            >
              &rarr;
            </span>
          </Pagination>
        )}

        {/* Delete Modal */}
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
