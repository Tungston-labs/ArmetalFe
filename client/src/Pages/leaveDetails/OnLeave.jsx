// EmployeeAttendance.jsx
import React from "react";
import {
  Container,
  Title,
  TitleSection,
  Subtitle,
  HeaderSection,
  HRManager,
  TopBar,
  SearchInput,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  EmployeeImg,
  TableTitle,
  ActionArea,
  DateInput ,
  Tab,
  Tabs
} from "./OnLeave.Style";
// import{FaPlus} from 'react-icons/fa';
import { IoEyeOutline } from "react-icons/io5";
import { useLocation, NavLink } from 'react-router-dom';
const mockData = new Array(10).fill({
  name: "Employee name",
  id: "12545166",
  date: "12/12/2025",
  type: "Paid Leave",
});

export default function EmployeeAttendance() {
     const location = useLocation();
   
  return (
    <Container>
      <TopBar>
        <div />
        <HRManager>
          <img src="https://i.pravatar.cc/40?img=5" alt="HR Manager" />
          <span>HR Manager</span>
        </HRManager>
      </TopBar>

      <HeaderSection>
        <TitleSection>
          {/* <LuArrowLeft style={{width:"30px", height:30}} /> */}
          <img src="/images/employee.png" alt="Payroll Icon" style={{ height: "50px" }} />
          <div>
            <Title>Employee</Title>
            <Subtitle>Manage your Employee.</Subtitle>
          </div>
        </TitleSection>
        <ActionArea>
          <DateInput  type="date" />
          <SearchInput type="text" placeholder="Search by Department name" />
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
     

      <TableTitle>12 March 2025</TableTitle>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <span><b>Employee Attendance Log</b> ▼</span>
      </div>

      <Table>
        <thead>
          <TableRow header>
            <TableHeader>Employee name</TableHeader>
            <TableHeader>Employee ID</TableHeader>
            <TableHeader> Date</TableHeader>
            <TableHeader>Leave Type</TableHeader>
            <TableHeader></TableHeader>

          </TableRow>
        </thead>
        <tbody>
          {mockData.map((row, i) => (
            <TableRow key={i}>
              <TableCell>
                <EmployeeImg src="https://i.pravatar.cc/100?img=2" alt="profile" />
                {row.name}
              </TableCell>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.type}</TableCell>
  <TableCell>
     <IoEyeOutline style={{ fontSize: '18px', color: '#5F53A5' }} />
   </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
