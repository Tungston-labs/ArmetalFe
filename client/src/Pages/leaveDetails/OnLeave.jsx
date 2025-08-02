// EmployeeAttendance.jsx

import React, { useEffect, useState } from "react";
import {
  Container, Title, TitleSection, Subtitle, HeaderSection,
  HRManager, TopBar, SearchInput, Table, TableHeader, TableRow,
  TableCell, EmployeeImg, TableTitle, Pagination, ActionArea,
  DateInput, Tab, Tabs,FilterSection,
    DepartmentSelect,
    SearchWrapper,AddButton
} from "./OnLeave.Style";
import { PiUserCirclePlusThin } from "react-icons/pi";

import { IoEyeOutline } from "react-icons/io5";
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getAttendanceList } from "../../Redux/attendanceSlice";
import SyncLoader from "react-spinners/SyncLoader";
import { FaInfoCircle, FaTrash, FaPlus } from "react-icons/fa";


export default function EmployeeAttendance() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    attendanceList = [],
    loading = false,
    pagination = {}
  } = useSelector((state) => state.attendance);

  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [page, setPage] = useState(1);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const departments = [
    { name: "All", count: null },
    { name: "UI/UX designer", count: 2 },
    { name: "dummy", count: 2 },
    { name: "dummy", count: 2 },
    { name: "dummy", count: null },
    { name: "dummy", count: null },
  ];
  

  useEffect(() => {
    dispatch(getAttendanceList({ search: searchText, date: selectedDate, page }));
  }, [searchText, selectedDate, page, dispatch]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setPage(1);
  };

  const formatTime = (datetimeStr) => {
    if (!datetimeStr || typeof datetimeStr !== 'string') return '---';
    try {
      const date = new Date(datetimeStr.replace(' ', 'T'));
      if (isNaN(date)) return '---';
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (err) {
      return '---';
    }
  };

  return (
    <Container>
      <TopBar>
        <div />
        <HRManager>
          <img src="/images/user.jpg" alt="HR Manager" />
          <span>HR Manager</span>
        </HRManager>
      </TopBar>

      <HeaderSection>
  {/* Top Row: Title + Subtitle + Date */}
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <img src="/images/employee.png" alt="Employee Icon" style={{ height: "50px" }} />
      <div>
        <Title>Employee</Title>
        <Subtitle>Manage your Employee.</Subtitle>
      </div>
    </div>

    {/* Date Picker */}
    <DateInput type="date" onChange={handleDateChange} value={selectedDate} />
  </div>

  {/* Second Row: Search + Department */}
  <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "1rem",
    flexWrap: "wrap",
    width: "100%",
    gap: "1rem"
  }}>
    {/* Search Box */}
    <SearchWrapper>
      <SearchInput
        type="text"
        placeholder="Search by employee name or ID"
        value={searchText}
        onChange={handleSearch}
      />
    </SearchWrapper>

    {/* Departments: Label + Dropdown */}
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      
    <DepartmentSelect
  value={departmentFilter}
  onChange={(e) => setDepartmentFilter(e.target.value)}
>
  {departments.map((dept, index) => (
    <option key={index} value={dept.name}>
      {dept.name}
      {dept.count ? ` ${dept.count}` : ""}
    </option>
  ))}
</DepartmentSelect>

      
    </div>
    
  </div>
  {/* <div style={{ fontWeight: "bold" }}>
        Departments: <span style={{ color: "#555", fontWeight: 400 }}>{departmentFilter || "All"}</span>
      </div> */}
</HeaderSection>


        
        
              <Tabs>
                <NavLink to="/employee" style={{ textDecoration: 'none' }}>
                  <Tab active={location.pathname === '/employee'}>Total Employees</Tab>
                </NavLink>
                <NavLink to="/leave-request" style={{ textDecoration: 'none' }}>
                  <Tab active={location.pathname === '/leave-request'}>Employee leave request</Tab>
                </NavLink>
                <NavLink to="/on-leave" style={{ textDecoration: 'none' }}>
                  <Tab active={location.pathname === '/on-leave'}>Employee Attendance</Tab>
                </NavLink>
                <NavLink to="/employee-visa" style={{ textDecoration: 'none' }}>
                  <Tab active={location.pathname === '/employee-visa'}>Employee Visa</Tab>
                </NavLink>
                <NavLink to="/emp-on-leave" style={{ textDecoration: 'none' }}>
                  <Tab active={location.pathname === '/emp-on-leave'}>Employees on Leave</Tab>
                </NavLink>
              </Tabs>
<hr style={{marginTop:"-18px"}}></hr>
      {/* <TableTitle>{selectedDate || "All Dates"}</TableTitle> */}

      <Table>
        <thead>
          <TableRow $header>
            <TableHeader>Employee name</TableHeader>
            <TableHeader>Employee ID</TableHeader>
            <TableHeader>In Date</TableHeader>
            <TableHeader>In Time</TableHeader>
            <TableHeader>Out Time</TableHeader>
            <TableHeader />
          </TableRow>
        </thead>
        <tbody>
          {loading ? (
            <TableRow>
              <TableCell colSpan="6">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                  <SyncLoader color="#5F53A5" />
                </div>
              </TableCell>
            </TableRow>
          ) : attendanceList.length > 0 ? (
            attendanceList.map((row) => {
              const sessions = row.sessions || [];
              const timeIn = sessions[0]?.time_in || '';
              const timeOut = [...sessions].reverse().find(s => s.time_out)?.time_out || '';

              return (
                <TableRow key={row.id}>
                  <TableCell>
                    <EmployeeImg
                      src={row.profile_pic || `https://ui-avatars.com/api/?name=${encodeURIComponent(row.employee_name)}`}
                      alt={row.employee_name}
                    />
                    {row.employee_name}
                  </TableCell>
                  <TableCell>{row.employee}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{formatTime(timeIn)}</TableCell>
                  <TableCell>{formatTime(timeOut)}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => navigate(`/attendance/detail/${row.id}`)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <IoEyeOutline style={{ fontSize: '18px', color: '#5F53A5' }} />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow><TableCell colSpan="6">No records found</TableCell></TableRow>
          )}
        </tbody>
      </Table>

      <Pagination>
        <span
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          style={{ cursor: 'pointer', marginRight: '8px' }}
        >
          &larr;
        </span>

        {[1, 2].map((pageNumber) => {
          const isActive = pagination?.current_page === pageNumber;
          return (
            <span
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              style={{
                margin: '0 4px',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: isActive ? '#003366' : '#e0e0e0',
                color: isActive ? '#ffffff' : '#000000',
                fontWeight: isActive ? 'bold' : 'normal',
              }}
            >
              {pageNumber}
            </span>
          );
        })}

        <span
          onClick={() => setPage((prev) => Math.min(prev + 1, 2))}
          style={{ cursor: 'pointer', marginLeft: '8px' }}
        >
          &rarr;
        </span>
      </Pagination>
    </Container>
  );
}