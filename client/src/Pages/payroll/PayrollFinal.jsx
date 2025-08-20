import React, { useEffect, useState } from 'react';
import {
  Container, Header, TitleSection, Title, Subtitle, SearchInput, Pagination,
  TableWrapper, Table, Th, Td, Select
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
import { Spin } from "antd";
import Swal from "sweetalert2";

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const today = new Date();
const nextMonthDate = new Date(today.getFullYear(), today.getMonth() + 1);
const defaultMonth = nextMonthDate.getMonth() + 1;
const defaultYear = nextMonthDate.getFullYear();
const years = Array.from({ length: 10 }, (_, i) => defaultYear - 2 + i);

const PayrollTable = () => {
  const dispatch = useDispatch();
  const { data, loading, error, totalPages } = useSelector((state) => state.payroll);
  const departmentList = useSelector(state => state.departments.list || []);
  console.log(departmentList);


  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState({});

  // Fetch departments on mount
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
  const handleMonthChange = (e) => { setSelectedMonth(Number(e.target.value)); setPage(1); };
  const handleYearChange = (e) => { setSelectedYear(Number(e.target.value)); setPage(1); };
  const handleDepartmentChange = (e) => { setSelectedDepartment(e.target.value); setPage(1); };

  const toggleEmployeeSelect = (id) => {
    setSelectedEmployees(prev => prev.includes(id) ? prev.filter(empId => empId !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    setSelectedEmployees(selectedEmployees.length === data.length ? [] : data.map(emp => emp.employee));
  };

  const handleBulkStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (!newStatus || selectedEmployees.length === 0) return;

    await dispatch(submitPayrollRecords({
      month: selectedMonth,
      year: selectedYear,
      employee_ids: selectedEmployees,
      status: newStatus,
    }));

    e.target.selectedIndex = 0;
    dispatch(getPayrollData({ page, search: searchTerm, month: selectedMonth, year: selectedYear, department: selectedDepartment }));
  };

  const handleSingleStatusChange = async (empId, newStatus) => {
    await dispatch(updatePayrollStatus({
      employeeId: empId,
      month: selectedMonth,
      year: selectedYear,
      status: newStatus,
    }));
    dispatch(getPayrollData({ page, search: searchTerm, month: selectedMonth, year: selectedYear, department: selectedDepartment }));
  };

  const handleCircleClick = async (e, employee, type) => {
    e.preventDefault();
    try {
      await dispatch(verifyEmployeePayroll({
        employeeId: employee.employee,
        month: selectedMonth,
        year: selectedYear,
      })).unwrap();

      setVerificationStatus(prev => ({
        ...prev,
        [employee.id]: { ...prev[employee.id], [type]: true },
      }));

      Swal.fire({
        icon: "success",
        title: "Verified",
        text: "Payroll verification recorded successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

    } catch (err) {
      let msg = "Something went wrong!";
      if (err?.payload?.error) msg = err.payload.error;
      else if (err?.response?.data?.error) msg = err.response.data.error;
      else if (typeof err === "string") msg = err;

      Swal.fire({ icon: "warning", title: "Verification Failed", text: msg })
        .then(() => dispatch(getPayrollData({ page, search: searchTerm, month: selectedMonth, year: selectedYear, department: selectedDepartment })));
    }
  };

  const handlePageChange = (newPage) => { if (newPage >= 1 && newPage <= totalPages) setPage(newPage); };

  return (
    <>
      <Navbar />
      <Container>
        <Header>
          <TitleSection>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src="/images/payroll.png" alt="Payroll Icon" style={{ height: "51px" }} />
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
          <SearchInput placeholder="Search by Employee name" value={searchTerm} onChange={handleSearch} style={{ width: '250px' }} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <Select value={selectedMonth} onChange={handleMonthChange}>
              <option value="">Month</option>
              {months.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}
            </Select>
            <Select value={selectedYear} onChange={handleYearChange}>
              <option value="">Year</option>
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </Select>
          </div>
        </Header>

        <div style={{ background: '#3352BA', color: '#fff', padding: '10px 20px', margin: '20px 0 10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <input type="checkbox" checked={selectedEmployees.length === data.length} onChange={handleSelectAll} style={{ marginRight: '10px' }} />
            <strong>Selected {selectedEmployees.length} Employees</strong>
          </div>
          <Select style={{ background: '#fff', color: '#000', minWidth: '120px' }} onChange={handleBulkStatusChange}>
            <option>Select</option>
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
                <Th></Th>
                <Th>Sl No</Th>
                <Th>Employee ID</Th>
                <Th>Employee name</Th>
                <Th>Job Position</Th>
                <Th>Joining Date</Th>
                <Th>Email ID</Th>
                <Th>Salary</Th>
                <Th>Info</Th>
                <Th></Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="11" style={{ textAlign: "center", padding: "2rem" }}><Spin size="large" tip="Loading..." /></td></tr>
              ) : error ? (
                <tr><Td colSpan="11">Error: {error}</Td></tr>
              ) : data?.length > 0 ? (
                data.map((emp, index) => (
                  <tr key={emp.id}>
                    <Td><input type="checkbox" checked={selectedEmployees.includes(emp.employee)} onChange={() => toggleEmployeeSelect(emp.employee)} /></Td>
                    <Td>{(page - 1) * 10 + index + 1}</Td>
                    <Td>{emp.employee_id}</Td>
                    <Td>{emp.employee_name}</Td>
                    <Td>{emp.designation}</Td>
                    <Td>{emp.joining_date}</Td>
                    <Td>{emp.email}</Td>
                    <Td>₹{emp.basic_salary ?? 'N/A'}</Td>
                    <Td><Link to={`/payroll/${emp.id}`}><GoInfo style={{ cursor: 'pointer' }} /></Link></Td>
                    <Td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div
                          onClick={(e) => handleCircleClick(e, emp, 'first')}
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: verificationStatus[emp.id]?.first ? '#4caf50' : '#ccc',
                            cursor: verificationStatus[emp.id]?.first ? 'not-allowed' : 'pointer'
                          }}
                        />
                        <div
                          onClick={(e) => handleCircleClick(e, emp, 'second')}
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            backgroundColor: verificationStatus[emp.id]?.second ? '#4caf50' : '#ccc',
                            cursor: verificationStatus[emp.id]?.second ? 'not-allowed' : 'pointer'
                          }}
                        />
                      </div>
                    </Td>
                    <Td>
                      <Select value={emp.status || ''} onChange={(e) => handleSingleStatusChange(emp.employee, e.target.value)}>
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
          <span onClick={() => handlePageChange(page - 1)} style={{ cursor: page > 1 ? 'pointer' : 'not-allowed', opacity: page > 1 ? 1 : 0.5 }}>&larr;</span>
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            return <span key={pageNum} onClick={() => handlePageChange(pageNum)} className={pageNum === page ? "active" : ""}>{pageNum}</span>;
          })}
          <span onClick={() => handlePageChange(page + 1)} style={{ cursor: page < totalPages ? 'pointer' : 'not-allowed', opacity: page < totalPages ? 1 : 0.5 }}>&rarr;</span>
        </Pagination>
      </Container>
    </>
  );
};

export default PayrollTable;
