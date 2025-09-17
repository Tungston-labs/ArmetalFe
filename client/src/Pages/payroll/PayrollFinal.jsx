import React, { useEffect, useState } from 'react';
import {
  Container, Header, TitleSection, Title, Subtitle, SearchInput, Pagination,
  TableWrapper, Table, Th, Td, Select, Icon
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
  const departmentList = useSelector(state => state.departments.list || []);

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState({});
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

  const handleSingleStatusChange = async (empId, newStatus) => {
    const empStatus = verificationStatus[empId];

    if (!empStatus?.first || !empStatus?.second) {
      Swal.fire({
        icon: "warning",
        title: "Verification Pending",
        text: "Payroll cannot be updated until both admins verify.",
      });
      return;
    }

    await dispatch(updatePayrollStatus({
      employeeId: empId,
      month: selectedMonth,
      year: selectedYear,
      status: newStatus,
    }))
      .unwrap()
      .then(() => {
        dispatch(getPayrollData({ page, search: searchTerm, month: selectedMonth, year: selectedYear, department: selectedDepartment }));
      })
      .catch(err => {
        Swal.fire({ icon: "error", title: "Update Failed", text: err?.message || "Something went wrong!" });
      });
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

    await dispatch(submitPayrollRecords({
      month: selectedMonth,
      year: selectedYear,
      employee_ids: selectedEmployees,
      status: newStatus,
    }))
      .unwrap()
      .then(() => {
        setBulkStatus('');
        dispatch(getPayrollData({ page, search: searchTerm, month: selectedMonth, year: selectedYear, department: selectedDepartment }));
      })
      .catch(err => {
        Swal.fire({ icon: "error", title: "Bulk Update Failed", text: err?.message || "Something went wrong!" });
        setBulkStatus('');
      });
  };

  const handleCircleClick = async (e, employee, type) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const empStatus = verificationStatus[employee.id];

    if (empStatus?.[type]) {
      Swal.fire({ icon: "info", title: "Already Verified", text: "This was already verified." });
      return;
    }

    if (employee.hr1_verified_by === user.username || employee.hr2_verified_by === user.username) {
      Swal.fire({
        icon: "warning",
        title: "Not Allowed",
        text: "One admin can verify only once.",
      });
      return;
    }

    try {
      await dispatch(verifyEmployeePayroll({
        employeeId: employee.id,
        month: selectedMonth,
        year: selectedYear,
      })).unwrap();

      setVerificationStatus(prev => ({
        ...prev,
        [employee.id]: { ...prev[employee.id], [type]: true },
      }));

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
      let msg = err?.payload?.error || err?.response?.data?.error || err?.message || "Something went wrong!";
      Swal.fire({ icon: "error", title: "Verification Failed", text: msg });
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Icon src={HolidayIcon} alt="holiday" />
              <div>
                <Title>Payroll</Title>
                <Subtitle>Unifying Teams. Simplifying Operations</Subtitle>
              </div>
            </div>
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
          <SearchInput
            placeholder=" Enter employee ID"
            value={searchTerm}
            onChange={handleSearch}
            style={{ width: '250px' }}
          />
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

        <div style={{ background: '#3352BA', color: '#fff', padding: '10px 20px', margin: '20px 0 10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <input
              type="checkbox"
              checked={selectedEmployees.length === data.length && data.length > 0}
              onChange={handleSelectAll}
              style={{ marginRight: '10px' }}
            />
            <strong>Selected {selectedEmployees.length} Employees</strong>
          </div>
          <Select
            style={{ background: '#fff', color: '#000', minWidth: '120px' }}
            value={bulkStatus}
            onChange={handleBulkStatusChange}
          >
            <option value="">Select</option>
            <option value="OnHold">OnHold</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </Select>
        </div>

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
                        onChange={(e) => handleSingleStatusChange(emp.id, e.target.value)}
                        style={{
                          backgroundColor: getStatusColor(emp.status),
                          color: emp.status === 'Pending' ? 'black' : 'white',
                        }}
                      >
                        <option value="">Select</option>
                        <option value="OnHold">OnHold</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
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
