// EmployeeAttendance.jsx

import React, { useEffect, useState } from "react";
import {
  Container, Title, TitleSection, Subtitle, HeaderSection,
  HRManager, TopBar, SearchInput, Table, TableHeader, TableRow,
  TableCell, EmployeeImg, TableTitle, Pagination, ActionArea,
  DateInput, Tab, Tabs,LeftSide,DepartmentSelect,
} from "./OnLeave.Style";
import { PiUserCirclePlusThin } from "react-icons/pi";

import { IoEyeOutline } from "react-icons/io5";
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getAttendanceList } from "../../Redux/attendanceSlice";
import SyncLoader from "react-spinners/SyncLoader";

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

  useEffect(() => {
    dispatch(getAttendanceList({ search: searchText, date: selectedDate, page }));
  }, [searchText, selectedDate, page, dispatch]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value.toLowerCase());
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
        <TitleSection>
          <img src="/images/employee.png" alt="Employee Icon" style={{ height: "50px" }} />
          <div>
            <Title>Employee</Title>
            <Subtitle>Manage your Employee.</Subtitle>
          </div>
        </TitleSection>
      <ActionArea>
  {/* Left: Search + Department */}
  <LeftSide>
    <SearchInput
      type="text"
      placeholder="Search by employee name"
      value={searchText}
      onChange={handleSearchChange}
    />
    <DepartmentSelect>
    {/* //  onChange={handleDepartmentChange}
    //   value={selectedDepartment} */}
      <option value="">All Departments</option>
      <option value="hr">HR</option>
      <option value="sales">Sales</option>
      <option value="engineering">Engineering</option>
    </DepartmentSelect>
  </LeftSide>

  {/* Right: Date */}
  <DateInput
    type="date"
    onChange={handleDateChange}
    value={selectedDate}
  />
</ActionArea>

      </HeaderSection>

      <Tabs>
        <NavLink to="/employee" style={{ textDecoration: 'none' }}>
          <Tab active={location.pathname === '/employee'}>Total Employee </Tab>
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
      </Tabs>

      <TableTitle>{selectedDate || "All Dates"}</TableTitle>

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
