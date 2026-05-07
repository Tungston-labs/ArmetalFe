import React, { useState } from "react";
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
  if (!isOpen || !employee) return null;

  const [records] = useState(employee.daily_records || []);

  const workingDays = employee.working_days ?? 0;
  const presentCount = records.filter((r) => r.status === "present").length;
  const absentCount = records.filter((r) => r.status === "absent").length;
  const lopCount = employee.lop_days ?? 0;

const getStatusLabel = (status) => {
  switch ((status || "").toLowerCase()) {
    case "present":
      return { text: "Present", key: "present" };
    case "half_day":
      return { text: "Half Day", key: "half_day" };
    case "leave":
      return { text: "Leave", key: "leave" };
    case "holiday":
      return { text: "Holiday", key: "holiday" };
    case "off":  
      return { text: "Off Day", key: "off" };
    default:
      return { text: "Absent", key: "absent" };
  }
};

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleString("en-GB", { month: "short" });
    return `${day} ${month}`;
  };

  const cards = [
    { label: "Working Days", value: workingDays, type: "default" },
    { label: "Present", value: presentCount, type: "present" },
    { label: "Absent", value: absentCount, type: "absent" },
    { label: "LOP", value: lopCount, type: "lop" },
  ];

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <ModalHeader>
          <div>
            <ModalTitle>{employee.employee_name}</ModalTitle>
            <span style={{ fontSize: "13px", color: "#6b7280" }}>
              {monthName} — Attendance Summary
            </span>
          </div>
          <CloseButton onClick={onClose} aria-label="Close">
            &#x2715;
          </CloseButton>
        </ModalHeader>

        {/* Summary Cards */}
        <CardsWrapper>
          {cards.map((c) => (
            <Card key={c.label} type={c.type}>
              <CardTitle>{c.label}</CardTitle>
              <CardValue type={c.type}>{c.value}</CardValue>
            </Card>
          ))}
        </CardsWrapper>

        {/* Table */}
        <AttendanceTableWrapper>
          <AttendanceTable>
            <thead>
              <tr>
                <TableHeader style={{ width: "30%" }}>Date</TableHeader>
                <TableHeader style={{ width: "40%" }}>Status</TableHeader>
                <TableHeader style={{ width: "30%", textAlign: "right" }}>
                  Hours
                </TableHeader>
              </tr>
            </thead>

            <tbody>
              {records.length === 0 ? (
                <tr>
                  <TableCell
                    colSpan={3}
                    style={{
                      textAlign: "center",
                      color: "#6b7280",
                      padding: "2rem",
                    }}
                  >
                    No records available
                  </TableCell>
                </tr>
              ) : (
                records.map((rec, idx) => {
                  const label = getStatusLabel(rec.status);

                  return (
                    <TableRow key={idx}>
                      {/* Date */}
                      <TableCell
                        style={{ fontWeight: "500", color: "#1a1a1a" }}
                      >
                        {formatDate(rec.date)}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge status={label.key}>
                          {label.text}
                        </StatusBadge>
                      </TableCell>

                      {/* Hours */}
                      <TableCell style={{ textAlign: "right" }}>
                        <span
                          style={{
                            color: "#6b7280",
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {Number(rec.total_hours || 0).toFixed(2)}h
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </tbody>
          </AttendanceTable>
        </AttendanceTableWrapper>

      </ModalContainer>
    </ModalOverlay>
  );
};

export default EmployeeAttendanceModal;