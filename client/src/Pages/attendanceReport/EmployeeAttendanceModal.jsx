import React, { useMemo } from "react";
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
  if (!isOpen) return null;

  if (!employee) {
    return (
      <ModalOverlay isOpen={isOpen}>
        <ModalContainer>
          <ModalHeader>
            <ModalTitle>No employee selected</ModalTitle>
            <CloseButton onClick={onClose}>×</CloseButton>
          </ModalHeader>
        </ModalContainer>
      </ModalOverlay>
    );
  }
  const dailyRecords = employee.daily_records || employee.dailyRecords || [];
  const toYMD = (d) => {
    const dt = new Date(d);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  const monthIndex = monthName ? new Date(`${monthName} 1, 2000`).getMonth() : null;
  const yearForMonth = useMemo(() => {
    if (monthIndex === null) return new Date().getFullYear();
    const recordWithMonth = dailyRecords.find((r) => {
      if (!r?.date) return false;
      const d = new Date(r.date);
      return !isNaN(d.getTime()) && d.getMonth() === monthIndex;
    });
    if (recordWithMonth) {
      return new Date(recordWithMonth.date).getFullYear();
    }
    return new Date().getFullYear();
  }, [dailyRecords, monthIndex]);
  const todayYMD = toYMD(new Date());
  const recordsMap = useMemo(() => {
    const map = {};
    dailyRecords.forEach((r) => {
      if (!r?.date) return;
      try {
        const ymd = toYMD(r.date);
        map[ymd] = r;
      } catch {
      }
    });
    return map;
  }, [dailyRecords]);
  const monthRows = useMemo(() => {
    if (monthIndex === null) return [];

    const daysInMonth = new Date(yearForMonth, monthIndex + 1, 0).getDate();
    const rows = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(yearForMonth, monthIndex, d);
      const ymd = toYMD(dt);
      if (ymd > todayYMD) break;

      rows.push({
        date: dt,
        ymd,
        record: recordsMap[ymd] || null,
      });
    }

    return rows;
  }, [monthIndex, yearForMonth, recordsMap, todayYMD]);

  const { workingDays, presentCount, absentCount, lopCount } = useMemo(() => {
    const present = monthRows.filter((r) => (r.record?.status || "").toLowerCase() === "present").length;
    const absent = monthRows.filter((r) => {
      const s = (r.record?.status || "").toLowerCase();
      return r.record && s !== "present" && s !== "holiday";
    }).length;
    const lop = employee.lop_days ?? employee.lop ?? 0;
    const working = employee.working_days ?? employee.workingDays ?? monthRows.length;
    return {
      workingDays: working,
      presentCount: present,
      absentCount: absent,
      lopCount: lop,
    };
  }, [monthRows, employee]);

  const getStatusLabel = (rawStatus) => {
    const s = (rawStatus || "").toLowerCase();
    if (s === "present") return "Present";
    if (s === "holiday") return "Holiday";
    return "Absent";
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

        <CardsWrapper>
          <Card>
            <CardTitle>Employee</CardTitle>
            <CardValue>{employee.employee_name}</CardValue>
          </Card>

          <Card>
            <CardTitle>Month</CardTitle>
            <CardValue>{monthName} {yearForMonth}</CardValue>
          </Card>

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
              {monthRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} style={{ textAlign: "center" }}>
                    No dates to show for {monthName}
                  </TableCell>
                </TableRow>
              ) : (
                monthRows.map(({ date, ymd, record }) => {
                  const statusLabel = record ? getStatusLabel(record.status) : "";

                  return (
                    <TableRow key={ymd}>
                      <TableCell>
                        <span style={{ fontWeight: 600, color: "#1034ad" }}>
                          {date.toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </TableCell>

                      <TableCell>
                        {record ? (
                          <StatusBadge status={statusLabel.toLowerCase()}>
                            {statusLabel === "Present"
                              ? "✔ Present"
                              : statusLabel === "Holiday"
                              ? "★ Holiday"
                              : "✖ Absent"}
                          </StatusBadge>
                        ) : (
                          <span />
                        )}
                      </TableCell>

                      <TableCell>
                        {record && (typeof record.total_hours !== "undefined"
                          ? `${Number(record.total_hours).toFixed(2)} hrs`
                          : record.hours
                          ? `${record.hours} hrs`
                          : "0.00 hrs")}
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
