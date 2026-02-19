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
  if (!isOpen || !employee) return null;

  const dailyRecords = employee.daily_records || [];

  /* ---------- USE BACKEND VALUES (NO RECALCULATION) ---------- */

  const workingDays = employee.working_days ?? 0;
  const presentCount = employee.present_days ?? 0;
  const absentCount = employee.absent_days ?? 0;
  const lopCount = employee.lop_days ?? 0;

  /* ---------- STATUS LABEL ---------- */

  const getStatusLabel = (status) => {
    switch ((status || "").toLowerCase()) {
      case "present":
        return { text: "✔ Present", key: "present" };
      case "half_day":
        return { text: "- Half Day", key: "half_day" };
      case "leave":
        return { text: "Leave", key: "leave" };
      case "holiday":
        return { text: "★ Holiday", key: "holiday" };
      default:
        return { text: "✖ Absent", key: "absent" };
    }
  };

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>
            {employee.employee_name} — {monthName}
          </ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        {/* ---------- SUMMARY CARDS ---------- */}

        <CardsWrapper>
          <Card>
            <CardTitle>Working Days</CardTitle>
            <CardValue>{workingDays}</CardValue>
          </Card>

          <Card>
            <CardTitle>Present</CardTitle>
            <CardValue>{presentCount}</CardValue>
          </Card>

          <Card>
            <CardTitle>Absent</CardTitle>
            <CardValue>{absentCount}</CardValue>
          </Card>

          <Card>
            <CardTitle>LOP</CardTitle>
            <CardValue>{lopCount}</CardValue>
          </Card>
        </CardsWrapper>

        {/* ---------- DAILY TABLE ---------- */}

        <AttendanceTableWrapper>
          <AttendanceTable>
            <thead>
              <tr>
                <TableHeader>Date</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Hours</TableHeader>
              </tr>
            </thead>

            <tbody>
              {dailyRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} style={{ textAlign: "center" }}>
                    No records
                  </TableCell>
                </TableRow>
              ) : (
                dailyRecords.map((rec, idx) => {
                  const label = getStatusLabel(rec.status);

                  return (
                    <TableRow key={idx}>
                      <TableCell>
                        {new Date(rec.date).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                        })}
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={label.key}>
                          {label.text}
                        </StatusBadge>
                      </TableCell>

                      <TableCell>
                        {Number(rec.total_hours || 0).toFixed(2)} hrs
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
