import React, { useEffect, useState } from 'react';
import {
  Container, Header, TitleSection, Title, Subtitle, SearchInput, Pagination,
  TableWrapper, Table, Th, Td, Select,
  Icon,
  BulkActionBar,
  TextBlock,
  EmployeeImage,
  LeftBlock,
  LeftGroup
} from './Final.Styles';
import { Link } from 'react-router-dom';
import { GoInfo } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import {
  getPayrollData,
  submitPayrollRecords,
  updatePayrollStatus,
  verifyEmployeePayroll
} from '../../Redux/payrollSlice';
import { getDepartments } from '../../Redux/departmentSlice';
import Navbar from '../../Components/Navbar';
import Loader from "../../Components/Loader";
import Swal from "sweetalert2";
import { FaCheck } from "react-icons/fa";
import HolidayIcon from "../../assets/payroll.svg";

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const today = new Date();
const nextMonthDate = new Date(today.getFullYear(), today.getMonth() - 1);
const defaultMonth = nextMonthDate.getMonth() + 1;
const defaultYear = nextMonthDate.getFullYear();
const years = Array.from({ length: 10 }, (_, i) => defaultYear - 2 + i);

const PayrollTable = () => {
  const dispatch = useDispatch();
  const { data, loading, error, totalPages } = useSelector((state) => state.payroll);
  console.log({ data });

  const departmentList = useSelector(state => state.departments.list || []);

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState({});
  console.log({ verificationStatus });

  const [bulkStatus, setBulkStatus] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'green';
      case 'OnHold': return 'orange';
      case 'Pending': return 'yellow';
      case 'Cancelled': return 'red';
      default: return '#000';
    }
  };

  // Fetch departments
  useEffect(() => {
    dispatch(getDepartments({ page: 1, search: '' }));
  }, [dispatch]);

  // Fetch payroll data
  useEffect(() => {
    dispatch(getPayrollData({
      page,
      search: searchTerm,
      month: selectedMonth,
      year: selectedYear,
      department: selectedDepartment
    })).unwrap().catch(err => console.error("Error fetching payroll data:", err));
  }, [dispatch, page, searchTerm, selectedMonth, selectedYear, selectedDepartment]);

  // Persist verification status
  useEffect(() => {
    if (data?.length) {
      const initialStatus = {};
      data.forEach(emp => {
        initialStatus[emp.id] = {
          first: emp.hr1_verified,
          second: emp.hr2_verified,
        };
      });
      setVerificationStatus(initialStatus);
    }
  }, [data]);

  const handleSearch = (e) => { setSearchTerm(e.target.value); setPage(1); };
  const handleMonthChange = (e) => { setSelectedMonth(Number(e.target.value)); };
  const handleYearChange = (e) => { setSelectedYear(Number(e.target.value)); setPage(1); };
  const handleDepartmentChange = (e) => { setSelectedDepartment(e.target.value); setPage(1); };

  const toggleEmployeeSelect = (id) => {
    setSelectedEmployees(prev =>
      prev.includes(id) ? prev.filter(empId => empId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedEmployees(
      selectedEmployees.length === data.length ? [] : data.map(emp => emp.id)
    );
  };
  const handleSingleStatusChange = async (employeeId, newStatus) => {
    console.log({ employeeId });

    const empStatus = verificationStatus[employeeId.id];

    console.log({ empStatus });


    if (!empStatus?.first || !empStatus?.second) {
      Swal.fire({
        icon: "warning",
        title: "Verification Pending",
        text: "Payroll cannot be updated until both admins verify.",
      });
      return;
    }

    try {
      await dispatch(updatePayrollStatus({
        employeeId: employeeId.employee, // already employee_id
        month: selectedMonth,
        year: selectedYear,
        status: newStatus,
      })).unwrap();

      dispatch(getPayrollData({
        page,
        search: searchTerm,
        month: selectedMonth,
        year: selectedYear,
        department: selectedDepartment,
      }));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err?.message || "Something went wrong!",
      });
    }
  };


  const handleBulkStatusChange = async (e) => {
    const newStatus = e.target.value;
    setBulkStatus(newStatus);

    if (!newStatus || selectedEmployees.length === 0) return;

    const unverified = data.filter(emp =>
      selectedEmployees.includes(emp.id) &&
      (!verificationStatus[emp.id]?.first || !verificationStatus[emp.id]?.second)
    );

    if (unverified.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "Verification Pending",
        text: "Some selected employees are not verified by both admins.",
      });
      setBulkStatus('');
      return;
    }

    const employee_ids = selectedEmployees.map(id => data.find(e => e.id === id).employee);

    try {
      await dispatch(submitPayrollRecords({ month: selectedMonth, year: selectedYear, employee_ids, status: newStatus })).unwrap();

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Payroll status updated for selected employees.",
        timer: 1500,
        showConfirmButton: false,
      });

      setBulkStatus('');
      setSelectedEmployees([]); // reset selection
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Bulk Update Failed",
        text: err?.message || "Something went wrong!"
      });
      setBulkStatus('');
    }
  };


  const handleCircleClick = async (e, employee, type) => {
    console.log({ employee });

    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
    if (!user) return;

    // Already verified by this type
    if (verificationStatus[employee.id]?.[type]) {
      Swal.fire({ icon: "info", title: "Already Verified", text: "This was already verified." });
      return;
    }

    // Same HR cannot verify twice
    if (employee.hr1_verified_by === user.username || employee.hr2_verified_by === user.username) {
      Swal.fire({ icon: "warning", title: "Cannot Verify", text: "You cannot verify the same payroll twice." });
      return;
    }

    try {
      await dispatch(verifyEmployeePayroll({
        employeeId: employee.employee,
        month: selectedMonth,
        year: selectedYear,
      })).unwrap();

      // Update verificationStatus locally
      setVerificationStatus(prev => ({
        ...prev,
        [employee.id]: { ...prev[employee.id], [type]: true },
      }));

      // Refresh payroll data
      await dispatch(getPayrollData({
        page,
        search: searchTerm,
        month: selectedMonth,
        year: selectedYear,
        department: selectedDepartment,
      }));

      Swal.fire({
        icon: "success",
        title: "Verified",
        text: "Payroll verification recorded.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Verify payroll error:", err);

      // Show friendly alert
      Swal.fire({
        icon: "warning",
        title: "Verification Failed",
        text: "Cannot verify payroll: Same HR cannot verify twice.",
      }).then(() => {
        // Refresh payroll listing
        dispatch(getPayrollData({
          page,
          search: searchTerm,
          month: selectedMonth,
          year: selectedYear,
          department: selectedDepartment,
        }));
      });
    }
  };


  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <>
      <Navbar />
      <Container>
        <Header>
          <TitleSection>
  <LeftGroup>
    <EmployeeImage src={HolidayIcon} alt="employeeIcon" />
    <div>
      <Title>Payroll</Title>
      <Subtitle>Unifying Teams. Simplifying Operations</Subtitle>
    </div>
  </LeftGroup>

  <Select value={selectedDepartment} onChange={handleDepartmentChange}>
    <option value="">Select Department</option>
    {departmentList.map(dept => (
      <option key={dept.id} value={String(dept.id).split(":")[0]}>
        {dept.name}
      </option>
    ))}
  </Select>
</TitleSection>

        </Header>

        <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SearchInput placeholder=" Enter employee ID" value={searchTerm} onChange={handleSearch} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <Select value={selectedMonth} onChange={handleMonthChange}>
              {months.map((month, index) => (
                <option key={month} value={index + 1}>{month}</option>
              ))}
            </Select>
            <Select value={selectedYear} onChange={handleYearChange}>
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </Select>
          </div>
        </Header>

        <BulkActionBar>
          <div>
            <input
              type="checkbox"
              checked={selectedEmployees.length === data.length}
              onChange={handleSelectAll}
            />
            <strong>Selected {selectedEmployees.length} Employees</strong>
          </div>

          <select onChange={handleBulkStatusChange}>
            <option>Select</option>
            <option value="OnHold">OnHold</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </BulkActionBar>


        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>
                  <input
                    type="checkbox"
                    checked={selectedEmployees.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                  />
                </Th>
                <Th>Sl No</Th>
                <Th>Employee ID</Th>
                <Th>Job Position</Th>
                <Th>Joining Date</Th>
                <Th>Email ID</Th>
                <Th>Salary</Th>
                <Th>Info</Th>
                <Th>Verification</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="11" style={{ textAlign: "center", padding: "2rem" }}><Loader size="large" tip="Loading..." /></td></tr>
              ) : error ? (
                <tr><Td colSpan="11">Error: {error}</Td></tr>
              ) : data?.length > 0 ? (
                data.map((emp, index) => (
                  <tr key={emp.id}>
                    <Td>
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(emp.id)}
                        onChange={() => toggleEmployeeSelect(emp.id)}
                      />
                    </Td>
                    <Td>{(page - 1) * 10 + index + 1}</Td>
                    <Td>{emp.employee_id}</Td>
                    <Td
                      style={{
                        maxWidth: "100px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                      title={emp.designation}
                    >
                      {emp.designation}
                    </Td>
                    <Td>{emp.joining_date}</Td>
                    <Td
                      style={{
                        maxWidth: "150px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                      title={emp.email}
                    >
                      {emp.email}
                    </Td>
                    <Td>₹{emp.basic_salary ?? 'N/A'}</Td>
                    <Td>
                      <Link to={`/payrolldetails/${emp.id}`}>
                        <GoInfo style={{ cursor: 'pointer', color: "black" }} />
                      </Link>
                    </Td>
                    <Td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div
                          onClick={(e) => handleCircleClick(e, emp, 'first')}
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: '2px solid #ccc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: verificationStatus[emp.id]?.first ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {verificationStatus[emp.id]?.first && (
                            <FaCheck style={{ color: 'blue', fontSize: '10px' }} />
                          )}
                        </div>
                        <div
                          onClick={(e) => handleCircleClick(e, emp, 'second')}
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: '2px solid #ccc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: verificationStatus[emp.id]?.second ? 'not-allowed' : 'pointer'
                          }}
                        >
                          {verificationStatus[emp.id]?.second && (
                            <FaCheck style={{ color: 'blue', fontSize: '10px' }} />
                          )}
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <Select
                        value={emp.status || ''}
                        onChange={(e) => handleSingleStatusChange(emp, e.target.value)}
                        style={{
                          backgroundColor: getStatusColor(emp.status),
                          color: emp.status === 'Pending' ? 'black' : 'white',
                        }}
                      >
                        <option value="">Select</option>
                        <option
                          value="OnHold"
                          style={{ backgroundColor: "orange", color: "white" }}
                        >
                          OnHold
                        </option>
                        <option
                          value="Cancelled"
                          style={{ backgroundColor: "red", color: "white" }}
                        >
                          Cancelled
                        </option>
                        <option
                          value="Pending"
                          style={{ backgroundColor: "yellow", color: "black" }}
                        >
                          Pending
                        </option>
                        <option
                          value="Paid"
                          style={{ backgroundColor: "green", color: "white" }}
                        >
                          Paid
                        </option>
                      </Select>

                    </Td>
                  </tr>
                ))
              ) : (
                <tr><Td colSpan="11">No data found</Td></tr>
              )}
            </tbody>
          </Table>
        </TableWrapper>

        <Pagination>
          <span
            onClick={() => handlePageChange(page - 1)}
            style={{ cursor: page > 1 ? 'pointer' : 'not-allowed', opacity: page > 1 ? 1 : 0.5 }}
          >
            &larr;
          </span>
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            return (
              <span
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={pageNum === page ? "active" : ""}
              >
                {pageNum}
              </span>
            );
          })}
          <span
            onClick={() => handlePageChange(page + 1)}
            style={{ cursor: page < totalPages ? 'pointer' : 'not-allowed', opacity: page < totalPages ? 1 : 0.5 }}
          >
            &rarr;
          </span>
        </Pagination>
      </Container>
    </>
  );
};

export default PayrollTable;