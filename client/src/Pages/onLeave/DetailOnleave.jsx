import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";
import {
  getAllEmployees,
  getOnLeaveEmployees,
} from "../../Redux/employeeSlice"; // Adjust path according to your structure

const DetailOnleave = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const departmentId = searchParams.get("departmentId");

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    employeeList = [],
    onLeaveEmployees = [],
    loading,
    leaveLoading,
    totalPages = 1,
    departmentsList = [],
  } = useSelector((state) => state.employee || {});

  // Handle debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch employees on department or search change
  useEffect(() => {
    if (departmentId) {
      dispatch(getOnLeaveEmployees({ departmentId, search: debouncedSearch, date: selectedDate }));
    } else {
      dispatch(getAllEmployees({ page: currentPage, search: debouncedSearch, date: selectedDate }));
    }
  }, [dispatch, departmentId, currentPage, debouncedSearch, selectedDate]);

  const employeesToDisplay = departmentId ? onLeaveEmployees : employeeList;

  const handleBack = () => {
    navigate(-1);
  };

  const handleRowClick = (employeeId) => {
    if (departmentId) {
      navigate(`/employee-dashboard/${employeeId}?departmentId=${departmentId}`);
    } else {
      navigate(`/employee-dashboard/${employeeId}`);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      {loading && <div data-testid="loader">Loading...</div>}

      <div>
        <div>
          <div>
            <HiOutlineArrowLeft
              style={{ color: "rgb(50, 80, 181)", cursor: "pointer" }}
              onClick={handleBack}
            />
            <img src="employee-icon.svg" alt="employeeIcon" />
            <div>
              <h2>Employee</h2>
              <p>Manage your Employee.</p>
              {departmentId && <h3>Employees On Leave</h3>}
            </div>
          </div>

          <div>
            <div>
              <input
                type="text"
                placeholder="Enter employee name or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: "2.5rem" }}
              />
            </div>
            <div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: "0.6rem",
                  borderRadius: "6px",
                  border: "1px solid rgb(204, 204, 204)",
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <Link to="/employee">
            <div>Total Employee</div>
          </Link>
          <Link to="/employee-leave-request">
            <div>Employee leave request</div>
          </Link>
          <Link to="/employee-attendance">
            <div>Employee Attendance</div>
          </Link>
          <Link to="/employee-Contract-Visa-Expiry">
            <div>Employee Contract & Visa Expiry</div>
          </Link>
          <Link to="/employee-on-leave">
            <div>Employees on Leave</div>
          </Link>
        </div>

        <hr style={{ marginTop: "-18px" }} />

        <table>
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Employee name</th>
              <th>Employee ID</th>
              <th>Email ID</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {leaveLoading || loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "2rem" }}>
                  Loading...
                </td>
              </tr>
            ) : employeesToDisplay && employeesToDisplay.length > 0 ? (
              employeesToDisplay.map((emp, index) => {
                const serialNum = (currentPage - 1) * itemsPerPage + index + 1;
                return (
                  <tr
                    key={emp.id || index}
                    onClick={() => handleRowClick(emp.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{serialNum}</td>
                    <td>
                      <img
                        src={emp.profileImage || "default-user.png"}
                        alt="profile"
                      />
                      {emp.name}
                    </td>
                    <td>{emp.employeeId || emp.id}</td>
                    <td>{emp.email}</td>
                    <td>{emp.department}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5}>
                  <NoEmployeeFound searchTerm={debouncedSearch} />
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {!departmentId && totalPages > 1 && (
          <div>
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                style={{ fontWeight: currentPage === page ? "bold" : "normal" }}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const NoEmployeeFound = ({ searchTerm }) => {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      No employees found {searchTerm ? `for "${searchTerm}"` : ""}.
    </div>
  );
};

export default DetailOnleave;