import React, { useState } from "react";
import * as XLSX from "xlsx";

import EmployeeTitle from "../../Components/EmployeeTitle";
import EmployeeIcon from "../../assets/employeeicon.svg";

import {
  Container,
  Title,
  TableWrapper,
  Table,
  Th,
  Td,
  Tr,
  StatusBadge,
  FilterRow,
  MonthInput,
  HeaderSection,
} from "./AttendanceReport.styles";

const attendanceData = [
  {
    id: 1,
    name: "John Doe",
    department: "HR",
    attendance: {
      1: "P",
      2: "P",
      3: "A",
      4: "P",
      5: "L",
      6: "P",
      7: "P",
      8: "P",
      9: "P",
      10: "P",
      11: "P",
      12: "P",
    },
    present: 10,
    absent: 1,
    leave: 1,
  },
  {
    id: 2,
    name: "Jane Smith",
    department: "IT",
    attendance: {
      1: "P",
      2: "P",
      3: "P",
      4: "P",
      5: "P",
      6: "A",
      7: "L",
      8: "P",
      9: "P",
      10: "P",
      11: "P",
      12: "P",
    },
    present: 10,
    absent: 1,
    leave: 1,
  },
];

const ReportAttendance = () => {
  const today = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}`
  );

  const [year, month] = selectedMonth.split("-").map(Number);

  const isCurrentMonth =
    year === today.getFullYear() &&
    month === today.getMonth() + 1;

  const daysInMonth = new Date(year, month, 0).getDate();

  const maxDays = isCurrentMonth
    ? today.getDate()
    : daysInMonth;

  const days = Array.from(
    { length: maxDays },
    (_, i) => i + 1
  );

  const monthName = new Date(
    year,
    month - 1
  ).toLocaleString("default", {
    month: "long",
  });

  const handleExportExcel = () => {
    const excelData = attendanceData.map((emp) => {
      const row = {
        Employee: emp.name,
        Department: emp.department,
      };

      days.forEach((day) => {
        row[`Day ${day}`] = emp.attendance[day] || "-";
      });

      row.Present = emp.present;
      row.Absent = emp.absent;
      row.Leave = emp.leave;

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Attendance Report"
    );

    XLSX.writeFile(
      workbook,
      `Attendance_Report_${monthName}_${year}.xlsx`
    );
  };

  return (
    <Container>
      <EmployeeTitle
        iconSrc={EmployeeIcon}
        showAddButton={false}
        showDropdown={false}
        showTabs={false}
        showBackArrow={false}
        showReportButton={true}
        reportButtonText="Export Excel"
        onReportClick={handleExportExcel}
      />

      <HeaderSection>
        <Title>
          Attendance Register - {monthName} {year}
        </Title>

        <FilterRow>
          <MonthInput
            type="month"
            value={selectedMonth}
            max={`${today.getFullYear()}-${String(
              today.getMonth() + 1
            ).padStart(2, "0")}`}
            onChange={(e) =>
              setSelectedMonth(e.target.value)
            }
          />
        </FilterRow>
      </HeaderSection>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th $sticky left="0px">
                Employee
              </Th>

              <Th $sticky left="180px">
                Department
              </Th>

              {days.map((day) => (
                <Th key={day}>{day}</Th>
              ))}

              <Th>Present</Th>
              <Th>Absent</Th>
              <Th>Leave</Th>
            </tr>
          </thead>

          <tbody>
            {attendanceData.map((emp) => (
              <Tr key={emp.id}>
                <Td $sticky left="0px">
                  {emp.name}
                </Td>

                <Td $sticky left="180px">
                  {emp.department}
                </Td>

                {days.map((day) => (
                  <Td key={day}>
                    <StatusBadge
                      status={emp.attendance[day]}
                    >
                      {emp.attendance[day] || "-"}
                    </StatusBadge>
                  </Td>
                ))}

                <Td>{emp.present}</Td>
                <Td>{emp.absent}</Td>
                <Td>{emp.leave}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export default ReportAttendance;