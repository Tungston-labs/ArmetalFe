import React, { useEffect, useState } from 'react';
import {
  Container, Header, TitleSection, Title, Subtitle, SearchInput,Pagination,
  TableWrapper, Table, Th, Td, Select, TopBar, HRManager
} from './Final.Styles';
import { LuArrowLeft } from "react-icons/lu";
import { Link } from 'react-router-dom';
import { GoInfo } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import {
  getPayrollData,
  submitPayrollRecords,
  updatePayrollStatus
} from '../../Redux/payrollSlice';
import SyncLoader from 'react-spinners/SyncLoader';

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

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      dispatch(getPayrollData({
        page,
        search: searchTerm,
        month: selectedMonth,
        year: selectedYear
      }));
    }
    console.log("payroll data:",data)
  }, [dispatch, page, searchTerm, selectedMonth, selectedYear]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(Number(e.target.value));
    setPage(1);
  };

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
    setPage(1);
  };

  const toggleEmployeeSelect = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter(empId => empId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === data.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(data.map(emp => emp.employee));
    }
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

    dispatch(getPayrollData({
      page,
      search: searchTerm,
      month: selectedMonth,
      year: selectedYear,
    }));
  };

  const handleSingleStatusChange = async (empId, newStatus) => {
    await dispatch(updatePayrollStatus({
      employeeId: empId,
      month: selectedMonth,
      year: selectedYear,
      status: newStatus,
    }));

    dispatch(getPayrollData({
      page,
      search: searchTerm,
      month: selectedMonth,
      year: selectedYear,
    }));
  };
const handlePageChange = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages) {
    setPage(newPage);
  }
};
  return (
    <Container>
      <Header style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <HRManager>
          <img src="/images/user.jpg" alt="HR Manager" />
          <span>HR Manager</span>
        </HRManager>
      </Header>

      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
        <SearchInput
          placeholder="Search by Employee name"
          value={searchTerm}
          onChange={handleSearch}
          style={{ width: '250px' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <Select value={selectedMonth} onChange={handleMonthChange}>
            <option value="">Month</option>
            {months.map((month, index) => (
              <option key={month} value={index + 1}>{month}</option>
            ))}
          </Select>
          <Select value={selectedYear} onChange={handleYearChange}>
            <option value="">Year</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Select>
        </div>
      </Header>

      <Header>
        <TitleSection>
          <LuArrowLeft style={{ width: "30px", height: 30 }} />
          <img src="/images/payroll.png" alt="Payroll Icon" style={{ height: "51px" }} />
          <div>
            <Title>Payroll</Title>
            <Subtitle>Unifying Teams. Simplifying Operations</Subtitle>
          </div>
        </TitleSection>
      </Header>

      <div style={{
        background: '#0546A0',
        color: '#fff',
        padding: '10px 20px',
        margin: '20px 0 10px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: '8px'
      }}>
        <div>
          <input
            type="checkbox"
            checked={selectedEmployees.length === data.length}
            onChange={handleSelectAll}
            style={{ marginRight: '10px' }}
          />
          <strong>Selected {selectedEmployees.length} Employees</strong>
        </div>
        <Select
          style={{ background: '#fff', color: '#000', minWidth: '120px' }}
          onChange={handleBulkStatusChange}
        >
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
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr> <Td colSpan="10" style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading...</p>
    </Td></tr>
            ) : error ? (
              <tr><Td colSpan="10">Error: {error}</Td></tr>
            ) : data?.length > 0 ? (
              data.map((emp, index) => {
                console.log("employee",emp)
                return(
                <tr key={emp.id}>
                  <Td>
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(emp.employee)}
                      onChange={() => toggleEmployeeSelect(emp.employee)}
                    />
                  </Td>
                  <Td>{(page - 1) * 10 + index + 1}</Td>
                  <Td>{emp.employee_id}</Td>
                  <Td>{emp.employee_name}</Td>
                  <Td>{emp.designation}</Td>
                  <Td>{emp.joining_date}</Td>
                  <Td>{emp.email}</Td>
                  <Td>₹{emp.basic_salary ?? 'N/A'}</Td>
                  <Td>
                    <Link to={`/payroll/${emp.id}`}>
                      <GoInfo style={{ cursor: 'pointer' }} />
                    </Link>
                  </Td>

                  <Td>
                    <Select
                      value={emp.status || ''}
                      onChange={(e) => handleSingleStatusChange(emp.employee, e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="OnHold">OnHold</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                    </Select>
                  </Td>
                </tr>
                )
              })
            
            ) : (
              <tr><Td colSpan="10">No data found</Td></tr>
            )}
          </tbody>
        </Table>
      </TableWrapper>

     <Pagination>
  <span
    onClick={() => handlePageChange(page - 1)}
    style={{
      cursor: page > 1 ? 'pointer' : 'not-allowed',
      opacity: page > 1 ? 1 : 0.5,
    }}
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
    style={{
      cursor: page < totalPages ? 'pointer' : 'not-allowed',
      opacity: page < totalPages ? 1 : 0.5,
    }}
  >
    &rarr;
  </span>
</Pagination>

    </Container>
  );
};

export default PayrollTable;
