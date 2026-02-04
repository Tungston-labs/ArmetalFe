import React from "react";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  CardsWrapper,
  Card,
  CardTitle,
  CardValue,
  AttendanceTableWrapper,
  AttendanceTable,
  TableHeader,
  TableRow,
  TableCell,
  StatusBadge,
} from "./EmployeeAttendanceModal.styles";

const EmployeeAttendanceModal = ({ employee, monthName, isOpen, onClose }) => {
  if (!employee) return null;

  // Map months to daily data
  const attendanceData = employee.months.map((m) => {
    const days = [];
    for (let i = 1; i <= m.workingDays; i++) {
      const status = i <= m.present ? "Present" : "Absent";
      days.push({ date: i, status, hours: status === "Present" ? 8 : 0 });
    }
    return { month: m.month, days };
  });

  // Select only the month passed from parent
  const monthData = attendanceData.find((m) => m.month === monthName);

  if (!monthData) return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>No data for {monthName}</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
      </ModalContainer>
    </ModalOverlay>
  );

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{employee.name} Attendance</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        {/* Top Cards */}
        <CardsWrapper>
          <Card>
            <CardTitle>Employee Name</CardTitle>
            <CardValue>{employee.name}</CardValue>
          </Card>
          <Card>
            <CardTitle>Month</CardTitle>
            <CardValue>{monthData.month}</CardValue>
          </Card>
          <Card>
            <CardTitle>Working Days</CardTitle>
            <CardValue>{monthData.days.length}</CardValue>
          </Card>
          <Card>
            <CardTitle>Present</CardTitle>
            <CardValue>{monthData.days.filter(d => d.status === "Present").length}</CardValue>
          </Card>
          <Card>
            <CardTitle>Absent</CardTitle>
            <CardValue>{monthData.days.filter(d => d.status === "Absent").length}</CardValue>
          </Card>
        </CardsWrapper>

        {/* Attendance Table */}
        <AttendanceTableWrapper>
          <AttendanceTable>
            <thead>
              <tr>
                <TableHeader>Date</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Working Hours</TableHeader>
              </tr>
            </thead>
            <tbody>
              {monthData.days.map(day => (
                <TableRow key={day.date}>
                  <TableCell>
                    <span style={{ fontWeight: 600, color: "#1034ad" }}>
                      {`${monthData.month} ${day.date}`}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={day.status}>
                      {day.status === "Present" ? "✔ Present" :
                       day.status === "Leave" ? "✖ Leave" : "❌ Absent"}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <span style={{ fontWeight: 500, color: "#555" }}>
                      {day.hours}:00hrs
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </AttendanceTable>
        </AttendanceTableWrapper>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EmployeeAttendanceModal;



