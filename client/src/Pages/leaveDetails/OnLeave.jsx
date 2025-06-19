import React, { useEffect, useState } from "react";
import {
  Container, Title, TitleSection, Subtitle, HeaderSection,
  HRManager, TopBar, SearchInput, Table, TableHeader, TableRow,
  TableCell, EmployeeImg, TableTitle, Pagination, ActionArea,
  DateInput, Tab, Tabs
} from "./OnLeave.Style";
import { IoEyeOutline } from "react-icons/io5";
import { useLocation, NavLink,useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getAttendanceList } from "../../Redux/attendanceSlice";
import { LuArrowLeft } from "react-icons/lu";
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
    setPage(1); // Reset to page 1
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setPage(1); // Reset to page 1
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
                    <LuArrowLeft style={{ width: "30px", height: 30 }} />
          <img src="/images/employee.png" alt="Payroll Icon" style={{ height: "50px" }} />
          <div>
            <Title>Employee</Title>
            <Subtitle>Manage your Employee.</Subtitle>
          </div>
        </TitleSection>
        <ActionArea>
          <DateInput type="date" onChange={handleDateChange} value={selectedDate} />
          <SearchInput
            type="text"
            placeholder="Search by employee name"
            value={searchText}
            onChange={handleSearchChange}
          />
        </ActionArea>
      </HeaderSection>

      <Tabs>
             <NavLink to="/employee" style={{ textDecoration: 'none' }}>
               <Tab active={location.pathname === '/employee'}>Employee list</Tab>
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
            <TableRow><TableCell colSpan="6">Loading...</TableCell></TableRow>
          ) : attendanceList.length > 0 ? (
            attendanceList.map((row) => (
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
                <TableCell>
                  {row.sessions?.[0]?.time_in?.slice(0, 5) || '--:--'}
                </TableCell>
                <TableCell>
                  {(() => {
                    const last = [...(row.sessions || [])].reverse().find(s => s.time_out);
                    return last?.time_out?.slice(0, 5) || '--:--';
                  })()}
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => navigate(`/attendance/detail/${row.id}`)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <IoEyeOutline style={{ fontSize: '18px', color: '#5F53A5' }} />
                  </button>
                </TableCell>              </TableRow>
            ))
          ) : (
            <TableRow><TableCell colSpan="6">No records found</TableCell></TableRow>
          )}
        </tbody>
      </Table>

      <Pagination>
        <span onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>&larr;</span>
        {Array.from({ length: pagination.total_pages || 1 }, (_, index) => (
          <span
            key={index}
            className={pagination.current_page === index + 1 ? 'active' : ''}
            onClick={() => setPage(index + 1)}
          >
            {index + 1}
          </span>
        ))}
        <span onClick={() => setPage((prev) => Math.min(prev + 1, pagination.total_pages || 1))}>&rarr;</span>
      </Pagination>
    </Container>
  );
}
