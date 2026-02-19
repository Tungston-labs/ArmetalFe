// src/screens/AttendanceReport.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  PageWrapper,
  TableWrapper,
  StyledTable,
  Th,
  Td,
  Tr,
  LopTd,
  TopBar,
  MonthSelector,
} from "./AttendanceReportStyles";
import EmployeeTitle from "../../Components/EmployeeTitle";
import EmployeeIcon from "../../assets/employeeicon.svg";
import EmployeeAttendanceModal from "./EmployeeAttendanceModal";
import { getAttendanceSummary } from "../../Redux/attendanceSlice";

const AttendanceReport = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth || {});
  const token = auth?.accessToken || auth?.token || "";
  const attendanceState = useSelector((state) => state.attendance || {});
  const attendanceSummary = attendanceState.attendanceSummary || [];
  const summaryLoading = attendanceState.summaryLoading || false;
    const getPreviousMonth = () => {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    return now.toISOString().slice(0, 7);
  };

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(getPreviousMonth());

  const [searchTerm, setSearchTerm] = useState("");

  const getMonthNameFromYYYYMM = (yyyyMM) => {
    if (!yyyyMM) return "";
    const d = new Date(`${yyyyMM}-01T00:00:00`);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString("default", { month: "long" });
  };

  const selectedMonthName = useMemo(
    () => getMonthNameFromYYYYMM(selectedMonth),
    [selectedMonth]
  );



  useEffect(() => {
    if (!selectedMonth) return;
    const [year, month] = selectedMonth.split("-");
    dispatch(getAttendanceSummary({ year: Number(year), month: Number(month), token }));
  }, [selectedMonth, dispatch, token]);

  const visibleRows = useMemo(() => {
    if (!Array.isArray(attendanceSummary)) return [];
    const q = (searchTerm || "").trim().toLowerCase();
    return attendanceSummary.filter((emp) =>
      emp.employee_name.toLowerCase().includes(q)
    );
  }, [attendanceSummary, searchTerm]);

  const handleRowClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  return (
    <Container>
      <EmployeeTitle
        iconSrc={EmployeeIcon}
        showBackArrow={false}
        showTabs={true}
        showDropdown={false}
        showAddButton={false}
        showSearch={true}
        searchValue={searchTerm}
        onSearchChange={(val) => setSearchTerm(val)}
      />

      <PageWrapper>
        <TopBar>
          <MonthSelector>
            <input
              type="month"
              value={selectedMonth}
              max={getPreviousMonth()}   // ⬅️ restrict to previous months only
              onChange={(e) => setSelectedMonth(e.target.value)}
            />

          </MonthSelector>
        </TopBar>

        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <Th>Employee Name</Th>
                <Th>Month</Th>
                <Th>Working Days</Th>
                <Th>Present</Th>
                <Th>Absent</Th>
                <Th>Loss of Pay</Th>
              </tr>
            </thead>

            <tbody>
              {summaryLoading ? (
                <Tr>
                  <Td colSpan={6} style={{ textAlign: "center" }}>
                    Loading attendance...
                  </Td>
                </Tr>
              ) : visibleRows.length === 0 ? (
                <Tr>
                  <Td colSpan={6} style={{ textAlign: "center" }}>
                    No records for {selectedMonthName || "this month"}
                  </Td>
                </Tr>
              ) : (
                visibleRows.map((emp) => (
                  <Tr
                    key={emp.employee_id}
                    $lop={emp.lop_days ?? emp.lop ?? 0}
                    onClick={() => handleRowClick(emp)}
                    style={{ cursor: "pointer" }}
                  >
                    <Td>{emp.employee_name}</Td>
                    <Td>{selectedMonthName}</Td>
                    <Td>{emp.working_days ?? emp.workingDays ?? "-"}</Td>
                    <Td>{emp.present_days ?? emp.present ?? "-"}</Td>
                    <Td>{emp.absent_days ?? emp.absent ?? "-"}</Td>
                    <LopTd $lop={emp.lop_days ?? emp.lop ?? 0}>
                      {emp.lop_days ?? emp.lop ?? 0}
                    </LopTd>
                  </Tr>
                ))
              )}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </PageWrapper>

      <EmployeeAttendanceModal
        employee={selectedEmployee}
        monthName={selectedMonthName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Container>
  );
};

export default AttendanceReport;
