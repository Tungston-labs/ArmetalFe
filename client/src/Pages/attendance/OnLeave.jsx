
import React, { useEffect, useState } from "react";
import {
  Container, Title, Subtitle, HeaderSection,
  HRManager, TopBar, SearchInput, Table, TableHeader, TableRow,
  TableCell, EmployeeImg, Pagination, DateInput, Tab, Tabs,
  DepartmentSelect, DropdownMenu, DropdownWrapper,
  SearchWrapper,
  SearchIcon,
  ViewButton,
  ViewIcon
} from "./OnLeave.Style";
import { IoIosArrowDown } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import { useLocation, NavLink, useNavigate,useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getAttendanceList } from "../../Redux/attendanceSlice";
import { HiArrowLeft } from "react-icons/hi";
import { getDepartments } from "../../Redux/departmentSlice";
import Navbar from "../../Components/Navbar";
import EmployeeIcon from "../../assets/employeeicon.svg";
import Loader from "../../Components/Loader";
import { EmployeeImage } from "../leaveDetails/EmployeeList.styles";
export default function EmployeeAttendance() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialDeptId = searchParams.get("department_id");

  const {
    attendanceList = [],
    loading = false,
    pagination = {}
  } = useSelector((state) => state.attendance);

  const { list: departmentList = [] } = useSelector((state) => state.departments);

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [page, setPage] = useState(1);
  const [departmentFilter, setDepartmentFilter] = useState("");

  useEffect(() => {
    dispatch(getAttendanceList({
      search: searchText || undefined,
      date: selectedDate || undefined,
      page,
      department_id: departmentFilter || undefined
    }));
  }, [searchText, selectedDate, page, departmentFilter, dispatch]);

  useEffect(() => {
    dispatch(getDepartments());
  }, [dispatch]);


  useEffect(() => {
    if (initialDeptId) {
      setDepartmentFilter(initialDeptId);  // already a string, fine
      setPage(1);
    }
  }, [initialDeptId]);
  
  

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
    } catch {
      return '---';
    }
  };
const getEarliestTimeIn = (sessions) => {
  if (!sessions?.length) return null;
  return sessions
    .filter((s) => s.time_in)
    .reduce((earliest, s) => (!earliest || s.time_in < earliest ? s.time_in : earliest), null);
};

const getLatestTimeOut = (sessions) => {
  if (!sessions?.length) return null;

  // Sort sessions by time_in
  const sorted = [...sessions].sort((a, b) => new Date(a.time_in) - new Date(b.time_in));

  // Get last session
  const lastSession = sorted[sorted.length - 1];

  // If last session has no time_out → still inside
  if (!lastSession.time_out) return null;

  // Otherwise, return the latest valid time_out overall
  return sorted
    .filter((s) => s.time_out)
    .reduce((latest, s) => (!latest || s.time_out > latest ? s.time_out : latest), null);
};


  return (
    <>
      {loading && <Loader />}
    <Navbar/>
    <Container>

      <HeaderSection>
        {/* Title & Date */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0rem" }}>

           <div style={{ display: "flex", alignItems: "center", gap: "10px",color:"#3250B5" }}>
           <HiArrowLeft
  onClick={() => navigate("/employee-attendance")}
  style={{
    cursor: "pointer",
    width: "clamp(24px, 3vw, 50px)",
    height: "clamp(24px, 3vw, 50px)"
  }}
/>

  <EmployeeImage  src={EmployeeIcon} alt="employeeIcon" />
  <div>
    <Title>Employee</Title>
    <Subtitle>Manage your Employee.</Subtitle>
  </div>
</div>
          </div>
          <DateInput type="date" onChange={handleDateChange} value={selectedDate} />
        </div>

        {/* Search & Department Filter */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
          flexWrap: "wrap",
          width: "100%",
          gap: "1rem"
        }}>
         <SearchWrapper>
  {/* <SearchIcon /> */}
  <SearchInput
    type="text"
    placeholder="Enter employee name or ID"
    value={searchText}
    onChange={handleSearch}
  />
</SearchWrapper>

        </div>
      </HeaderSection>

     <Tabs>
             <NavLink to="/employee" style={{ textDecoration: 'none' }}>
               <Tab active={location.pathname === '/employee'}>Total Employee</Tab>
             </NavLink>
             <NavLink to="/employee-leave-request" style={{ textDecoration: 'none' }}>
               <Tab active={location.pathname === '/employee-leave-request'}>Employee leave request</Tab>
             </NavLink>
             <NavLink to="/employee-attendance" style={{ textDecoration: 'none' }}>
                 <Tab
                   active={
                     location.pathname.startsWith("/employee-attendance") ||
                     location.pathname.startsWith("/employee-on-present")
                   }
                 >
           Employee Attendance
                 </Tab>
               </NavLink>

             <NavLink to="/employee-Contract-Visa-Expiry" style={{ textDecoration: 'none' }}>
               <Tab active={location.pathname === '/employee-Contract-Visa-Expiry'}>
                 Employee Contract & Visa Expiry
               </Tab>
             </NavLink>
             <NavLink to="/employee-on-leave" style={{ textDecoration: 'none' }}>
               <Tab active={location.pathname === '/employee-on-leave'}>Employees on Leave</Tab>
             </NavLink>
           </Tabs>
      <hr style={{ marginTop: "-18px" }} />

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
          Loading...
        </div>
      </TableCell>
    </TableRow>
  ) : attendanceList.length > 0 ? (
    attendanceList.map((row) => {
      const sessions = row.sessions || [];
      const timeIn = getEarliestTimeIn(sessions);
      const timeOut = getLatestTimeOut(sessions);

      return (
        <TableRow
          key={row.employee_id}
          onClick={() => navigate(`/attendance/detail/${row.id}`)}
          style={{
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f4ff")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <TableCell>
            <EmployeeImg
              src={
                row.profile_pic ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(row.employee_name)}`
              }
              alt={row.employee_name}
              style={{ marginRight: "10px", verticalAlign: "middle" }}
            />
            {row.employee_name}
          </TableCell>
          <TableCell>{row.employee_id}</TableCell>
          <TableCell>{row.date}</TableCell>
          <TableCell>{formatTime(timeIn)}</TableCell>
          <TableCell>{formatTime(timeOut)}</TableCell>
          <TableCell>
            <ViewButton>
              <ViewIcon />
            </ViewButton>
          </TableCell>
        </TableRow>
      );
    })
  ) : (
    <TableRow>
      <TableCell colSpan="6">No records found</TableCell>
    </TableRow>
  )}
</tbody>

      </Table>

      {/* Dynamic Pagination */}
      <Pagination>
        <span
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          style={{ cursor: 'pointer', marginRight: '8px' }}
        >
          &larr;
        </span>

        {Array.from({ length: pagination?.total_pages || 1 }, (_, i) => i + 1).map((pageNumber) => {
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
          onClick={() => setPage((prev) => Math.min(prev + 1, pagination?.total_pages || 1))}
          style={{ cursor: 'pointer', marginLeft: '8px' }}
        >
          &rarr;
        </span>
      </Pagination>
    </Container>
    </>
  );
}
