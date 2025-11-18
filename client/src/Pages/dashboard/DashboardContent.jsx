import React from "react";
import {
  Wrapper,
  GridContainer,
  Card,
  SectionTitle,
  ChartWrapper,
  TableWrapper,
  TableRow,
  Avatar,
  CalendarWrapper,
  HolidayItem,
  HolidayIcon
} from "./DashboardContent.Styles";

export default function DashboardContent() {
  const employees = [
    { name: "Employee", empId: "1254125", email: "dummy@gmail.com" },
    { name: "Employee", empId: "1254125", email: "dummy@gmail.com" },
    { name: "Employee", empId: "1254125", email: "dummy@gmail.com" },
    { name: "Employee", empId: "1254125", email: "dummy@gmail.com" }
  ];

  const holidays = [
    { title: "Dummy Holiday", date: "24 October" },
    { title: "Dummy Holiday", date: "24 October" },
    { title: "Dummy Holiday", date: "24 October" },
    { title: "Dummy Holiday", date: "24 October" }
  ];

  return (
    <Wrapper>
      <GridContainer>
        {/* Left Chart Section */}
        <Card>
          <SectionTitle>Employee Presence</SectionTitle>

          <ChartWrapper>
            <div className="big-number">251</div>
            <p>Total Employees</p>

            <div className="legend">
              <span className="blue-dot" /> Active Employees
              <span className="red-dot" /> On Leave Today
            </div>
          </ChartWrapper>
        </Card>

        {/* Middle Table Section */}
        <Card>
          <SectionTitle>Employee Contract Expiry</SectionTitle>

          <TableWrapper>
            {employees.map((emp, idx) => (
              <TableRow key={idx}>
                <Avatar src="https://i.pravatar.cc/40" />

                <div className="info">
                  <p>{emp.name}</p>
                </div>

                <div className="id">{emp.empId}</div>

                <div className="email">{emp.email}</div>
              </TableRow>
            ))}
          </TableWrapper>
        </Card>

        {/* Right Calendar + Holidays Section */}
        <Card>
          <CalendarWrapper>
            <SectionTitle>Upcoming Holidays</SectionTitle>

            {holidays.map((h, i) => (
              <HolidayItem key={i}>
                <HolidayIcon>📅</HolidayIcon>
                <div className="details">
                  <p className="title">{h.title}</p>
                  <p className="subtitle">Dummy holiday</p>
                </div>

                <div className="date">{h.date}</div>
              </HolidayItem>
            ))}
          </CalendarWrapper>
        </Card>
      </GridContainer>
    </Wrapper>
  );
}
