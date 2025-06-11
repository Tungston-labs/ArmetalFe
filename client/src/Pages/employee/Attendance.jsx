// EmployeeAttendance.jsx
import React from "react";
import {
  Container,
  Header,
  TitleSection,
  RoleBadge,
  TopRightBox,
  TabBar,
  Tab,
  SearchInput,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  EmployeeImg,
  TableTitle
} from "./Attendance.Style";

const mockData = new Array(10).fill({
  name: "Employee name",
  id: "12545166",
  date: "12/12/2025",
  inTime: "07:30 am",
  outDate: "12/12/2025",
  outTime: "05:30 pm",
});

export default function EmployeeAttendance() {
  return (
    <Container>
      <Header>
        <TitleSection>
          <h2>👨‍💼 Employee</h2>
          <p>Manage your Employee</p>
        </TitleSection>
        <TopRightBox>
          <RoleBadge>HR Manager</RoleBadge>
          <input type="date" />
        </TopRightBox>
      </Header>

      <TabBar>
        <Tab>Employee list</Tab>
        <Tab>Employee leave request</Tab>
        <Tab active>Employee Attendance</Tab>
        <Tab>Employee Visa</Tab>
        <SearchInput placeholder="Search by employee name or ID" />
      </TabBar>

      <TableTitle>12 March 2025</TableTitle>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <span><b>Employee Attendance Log</b> ▼</span>
      </div>

      <Table>
        <thead>
          <TableRow header>
            <TableHeader>Employee name</TableHeader>
            <TableHeader>Employee ID</TableHeader>
            <TableHeader>In Date</TableHeader>
            <TableHeader>In Time</TableHeader>
            <TableHeader>Out Date</TableHeader>
            <TableHeader>Out Time</TableHeader>
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
              <TableCell>{row.inTime}</TableCell>
              <TableCell>{row.outDate}</TableCell>
              <TableCell>{row.outTime}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
