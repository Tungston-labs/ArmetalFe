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

  const { employeeList, loading, pagination } = useSelector(
    (state) => state.employees
  );

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expiryFilter, setExpiryFilter] = useState("");

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchText]);

  // Fetch employees whenever filter/page/search changes
  useEffect(() => {
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
  }, [dispatch, page, debouncedSearch, expiryFilter]);

  // Prevent going past last page
  useEffect(() => {
    if (pagination?.total_pages && page > pagination.total_pages) {
      setPage(pagination.total_pages);
    }
  }, [pagination?.total_pages]);

  const handleSearch = (value) => {
    setSearchText(value);
    setPage(1);
  };

  const handleDelete = async () => {
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

        {/* TABLE */}

        <Table>
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Employee Name</th>
              <th>Employee ID</th>
              <th>Email</th>
              <th>Expiry Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "1rem" }}>
                  Loading...
                </td>
              </tr>
            ) : employeeList?.length > 0 ? (
              employeeList.map((emp, index) => (
                <tr key={emp.id}>
                  <td>{index + 1 + (currentPage - 1) * 20}</td>

                  <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {emp.profile_pic ? (
                      <ProfileImg src={emp.profile_pic} />
                    ) : (
                      <PiUserCirclePlusThin size={40} color="#888" />
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
                <td colSpan="8" style={{ textAlign: "center", padding: "1rem" }}>
                  No Employees Found
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* PAGINATION */}
        {pagination?.total_pages > 1 && (
          <Pagination>
            {/* Prev */}
            <span
              onClick={() => currentPage > 1 && setPage(currentPage - 1)}
              style={{
                cursor: currentPage > 1 ? "pointer" : "not-allowed",
                opacity: currentPage > 1 ? 1 : 0.3,
              }}
            >
              ←
            </span>

            {/* Page Numbers */}
            {Array.from({ length: pagination.total_pages }, (_, i) => {
              const p = i + 1;
              return (
                <span
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    margin: "0 4px",
                    padding: "4px 8px",
                    backgroundColor: p === currentPage ? "#003366" : "#e0e0e0",
                    color: p === currentPage ? "#fff" : "#000",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: p === currentPage ? "bold" : "normal",
                  }}
                >
                  {p}
                </span>
              );
            })}

            {/* Next */}
            <span
              onClick={() =>
                currentPage < pagination?.total_pages &&
                setPage(currentPage + 1)
              }
              style={{
                cursor:
                  currentPage < pagination?.total_pages
                    ? "pointer"
                    : "not-allowed",
                opacity: currentPage < pagination?.total_pages ? 1 : 0.3,
              }}
            >
              →
            </span>
          </Pagination>
        )}
      </Container>
    </>
  );
};

export default EmployeeList;
