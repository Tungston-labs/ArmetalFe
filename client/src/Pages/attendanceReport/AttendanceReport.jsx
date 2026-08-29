import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
  ReportButton,
} from "./AttendanceReportStyles";

import EmployeeTitle from "../../Components/EmployeeTitle";
import EmployeeIcon from "../../assets/employeeicon.svg";

import { getAttendanceSummary } from "../../Redux/attendanceSlice";
import Pagination from "../../Components/Pagination/Pagination";
import { exportAttendanceExcel } from "../../utils/montlyAttendance";

const AttendanceReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth || {});

  const token = auth?.accessToken || auth?.token || "";

  const attendanceState = useSelector((state) => state.attendance || {});

  const attendanceSummary = attendanceState.attendanceSummary?.results || [];

  const summaryLoading = attendanceState.summaryLoading || false;

  const summaryData = attendanceState.attendanceSummary;

  const currentPage = summaryData?.current_page || 1;

  const totalPages = summaryData?.total_pages || 1;

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [searchTerm, setSearchTerm] = useState("");

  // --------------------------------------------------
  // Month Name
  // --------------------------------------------------

  const getMonthNameFromYYYYMM = (yyyyMM) => {
    if (!yyyyMM) return "";

    const d = new Date(`${yyyyMM}-01T00:00:00`);

    if (isNaN(d.getTime())) {
      return "";
    }

    return d.toLocaleString("default", {
      month: "long",
    });
  };

  const selectedMonthName = useMemo(
    () => getMonthNameFromYYYYMM(selectedMonth),
    [selectedMonth]
  );

  // --------------------------------------------------
  // Fetch summary helper (reused on mount, month change,
  // pagination, and whenever we come back from an edit)
  // --------------------------------------------------

  const fetchSummary = (page = 1) => {
    if (!selectedMonth || !token) {
      return;
    }

    const [year, month] = selectedMonth.split("-");

    dispatch(
      getAttendanceSummary({
        year: Number(year),
        month: Number(month),
        page,
        token,
      })
    );
  };

  // --------------------------------------------------
  // Get Attendance Summary
  // --------------------------------------------------
  // Re-fetches whenever the month changes AND every time
  // this page is focused again (e.g. navigating back from
  // the employee edit page), so we never show stale data.
  // --------------------------------------------------

  useEffect(() => {
    fetchSummary(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, token]);

  useEffect(() => {
    const handleFocus = () => fetchSummary(currentPage);

    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, token, currentPage]);

  // --------------------------------------------------
  // Search + Sort
  // --------------------------------------------------

  const visibleRows = useMemo(() => {
    if (!Array.isArray(attendanceSummary)) {
      return [];
    }

    const q = (searchTerm || "").trim().toLowerCase();

    return attendanceSummary
      .filter((emp) => (emp.employee_name || "").toLowerCase().includes(q))
      .sort((a, b) =>
        (a.employee_name || "").localeCompare(b.employee_name || "")
      );
  }, [attendanceSummary, searchTerm]);

  // --------------------------------------------------
  // Open Employee Attendance Page
  // --------------------------------------------------
  // The month is passed BOTH as router state (fast path,
  // used when navigating normally) AND as a `?month=`
  // query param on the URL itself. Router state disappears
  // on a hard refresh, but the query param survives it —
  // so the detail page can always recover the correct
  // month even after F5 or a direct link / bookmark.
  // --------------------------------------------------

  const handleRowClick = (employee) => {
    navigate(
      `/employee-attendance/${employee.employee_id}?month=${selectedMonth}`,
      {
        state: {
          employee,
          monthName: selectedMonthName,
          selectedMonth,
        },
      }
    );
  };

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const handlePageChange = (page) => {
    fetchSummary(page);
  };

  // --------------------------------------------------
  // Report
  // --------------------------------------------------

  const currentMonth = new Date()
  .toISOString()
  .slice(0, 7);
  const handleReportClick = (type) => {
    if (type === "excel") {
      exportAttendanceExcel(attendanceSummary);
    }

    if (type === "pdf") {
      // exportAttendancePDF(attendanceSummary);
    }
  };

  // --------------------------------------------------
  // Monthly Excel
  // --------------------------------------------------

  const handleDownloadExcel = () => {
    exportAttendanceExcel(summaryData?.results || [], selectedMonth);
  };

  return (
    <Container>
      {/* Employee Header */}

      <EmployeeTitle
        iconSrc={EmployeeIcon}
        showBackArrow={false}
        showTabs={true}
        showDropdown={false}
        showAddButton={false}
        showSearch={true}
        searchValue={searchTerm}
        onSearchChange={(val) => setSearchTerm(val)}
        showReportButton={false}
        reportButtonText="Reports"
        onReportClick={handleReportClick}
      />

      <PageWrapper>
        {/* Top Bar */}

        <TopBar>
       <MonthSelector>
  <input
    type="month"
    value={selectedMonth}
    max={currentMonth}
    onChange={(e) =>
      setSelectedMonth(e.target.value)
    }
  />
</MonthSelector>

          <ReportButton onClick={handleDownloadExcel}>
            📊 Monthly Report (Excel)
          </ReportButton>
        </TopBar>

        {/* Attendance Table */}

        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <Th>Sl No.</Th>

                <Th>Employee Name</Th>

                <Th>Month</Th>

                <Th>Total Working Days</Th>

                <Th>Present</Th>

                <Th>Absent</Th>

                <Th>Loss of Pay</Th>
              </tr>
            </thead>

            <tbody>
              {summaryLoading ? (
                <Tr>
                  <Td colSpan={7} style={{ textAlign: "center" }}>
                    Loading attendance...
                  </Td>
                </Tr>
              ) : visibleRows.length === 0 ? (
                <Tr>
                  <Td colSpan={7} style={{ textAlign: "center" }}>
                    No records for {selectedMonthName || "this month"}
                  </Td>
                </Tr>
              ) : (
                visibleRows.map((emp, index) => (
                  <Tr
                    key={emp.employee_id}
                    $lop={emp.lop_days ?? emp.lop ?? 0}
                    onClick={() => handleRowClick(emp)}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <Td>{index + 1 + (currentPage - 1) * 20}</Td>

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

        {/* Pagination */}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </PageWrapper>
    </Container>
  );
};

export default AttendanceReport;