import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  updateAttendanceThunk,
  clearAttendanceUpdate,
  getAttendanceSummary, // reused from AttendanceReport — no new endpoint needed
} from "../../Redux/attendanceSlice";
import { exportAttendanceExcel } from "../../utils/montlyAttendance";
import {
  AttendancePage,
  AttendanceContainer,
  PageHeader,
  HeaderLeft,
  HeaderRight,
  PageTitle,
  PageSubtitle,
  BackButton,
  PrintButton,
  CardsWrapper,
  Card,
  CardTitle,
  CardValue,
  AttendanceTableWrapper,
  AttendanceTable,
  TableHeader,
  TableRow,
  TableCell,
  EmptyMessage,

  EditButton,
  EditModalOverlay,
  EditModal,
  ModalHeader,
  ModalTitle,
  CloseButton,
  FormGroup,
  FormLabel,
  FormTextarea,
  ModalActions,
  CancelButton,
  SaveButton,
  AuditInfo,
  AuditTitle,
  AuditText,
  NoteCell,
  NoteTooltip,
  NoNote,
  NoteText,
  TooltipLabel,
  TooltipContent,
} from "./EmployeeAttendanceModal.styles";

// This is the route to go back to. Keep this in sync with your router config.
const ATTENDANCE_REPORT_ROUTE = "/employee-attendance-report";

const EmployeeAttendance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // employeeId comes from the URL, so this page works on refresh / direct
  // links too, not only when navigated to with router state.
  const { employeeId: routeEmployeeId } = useParams();

  const {
    employee: stateEmployee,
    monthName: stateMonthName,
    selectedMonth: stateSelectedMonth,
  } = location.state || {};

  // ==================================================
  // REDUX STATE
  // ==================================================

  const auth = useSelector((state) => state.auth || {});
  const token = auth?.accessToken || auth?.token || "";

  const { updateLoading, updateSuccess, updateError } = useSelector(
    (state) => state.attendance || {}
  );

  // Same summary slice AttendanceReport uses.
  const attendanceSummary = useSelector(
    (state) => state.attendance?.attendanceSummary
  );
  const summaryLoading = useSelector(
    (state) => state.attendance?.summaryLoading
  );

  // ==================================================
  // MONTH
  // ==================================================
  // Falls back to the month passed via router state, or
  // the current month if the page was opened directly.
  // ==================================================

  const [selectedMonth] = useState(
    stateSelectedMonth || new Date().toISOString().slice(0, 7)
  );

  const monthName =
    stateMonthName ||
    new Date(`${selectedMonth}-01T00:00:00`).toLocaleString("default", {
      month: "long",
    });

  // ==================================================
  // FETCH THE SUMMARY, PAGE BY PAGE, UNTIL WE FIND
  // THE EMPLOYEE WE CARE ABOUT
  // ==================================================
  // The summary endpoint is paginated (same one used by
  // AttendanceReport), so the employee we want may not be
  // on page 1. We walk forward until found or we run out
  // of pages.
  // ==================================================

  const [searchPage, setSearchPage] = useState(1);
  const [searchExhausted, setSearchExhausted] = useState(false);

  const fetchSummaryPage = (page) => {
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

  // Kick off the search whenever we land on this page for a
  // (possibly) different employee/month.
  useEffect(() => {
    setSearchPage(1);
    setSearchExhausted(false);
    fetchSummaryPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeEmployeeId, selectedMonth, token]);

  const employeeFromSummary = useMemo(() => {
    if (!attendanceSummary?.results || !routeEmployeeId) {
      return null;
    }

    return (
      attendanceSummary.results.find(
        (emp) => String(emp.employee_id) === String(routeEmployeeId)
      ) || null
    );
  }, [attendanceSummary, routeEmployeeId]);

  // If the employee wasn't on the page we just fetched, and there
  // are more pages, fetch the next one automatically.
  useEffect(() => {
    if (!attendanceSummary || employeeFromSummary || summaryLoading) {
      return;
    }

    const currentPage = attendanceSummary.current_page || searchPage;
    const totalPages = attendanceSummary.total_pages || 1;

    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setSearchPage(nextPage);
      fetchSummaryPage(nextPage);
    } else {
      setSearchExhausted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendanceSummary, employeeFromSummary, summaryLoading]);

  // Server data wins once found; state data is only the fallback
  // for the very first paint (or if the employee genuinely can't
  // be found in the summary for some reason).
  const employee = employeeFromSummary || stateEmployee;

  const stillSearching = !employeeFromSummary && !searchExhausted;

  // ==================================================
  // RECORDS
  // ==================================================
  // Re-synced any time `employee` changes (fresh fetch,
  // navigation back to this page, etc.) instead of only
  // being set once on mount.
  // ==================================================

  const [records, setRecords] = useState(employee?.daily_records || []);

  useEffect(() => {
    setRecords(employee?.daily_records || []);
  }, [employee]);

  // ==================================================
  // EDIT MODAL STATE
  // ==================================================

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState(null);

  // ==================================================
  // ATTENDANCE TYPE
  // paid / unpaid
  // ==================================================

  const [attendanceType, setAttendanceType] = useState("unpaid");

  // ==================================================
  // NOTE
  // ==================================================

  const [editNote, setEditNote] = useState("");

  // ==================================================
  // CURRENT USER
  // ==================================================

  const currentUser =
    localStorage.getItem("userName") ||
    localStorage.getItem("username") ||
    "HR Admin";

  // ==================================================
  // PRINT
  // ==================================================

 const handlePrint = () => {
  if (!employee) {
    console.error("Employee data is not available");
    return;
  }

  exportAttendanceExcel(
    [employee],
    selectedMonth
  );
};

  // ==================================================
  // REFETCH HELPER (after a save)
  // ==================================================

  const refetchEmployee = () => {
    setSearchPage(1);
    setSearchExhausted(false);
    fetchSummaryPage(1);
  };

  // ==================================================
  // NO EMPLOYEE (still searching, or genuinely not found)
  // ==================================================

  if (!employee) {
    return (
      <AttendancePage>
        <AttendanceContainer>
          <PageHeader>
            <HeaderLeft>
              <BackButton
                type="button"
                onClick={() => navigate(ATTENDANCE_REPORT_ROUTE)}
              >
                ← Back
              </BackButton>

              <PageTitle>Employee Attendance</PageTitle>

              <PageSubtitle>
                {stillSearching
                  ? "Loading employee attendance data..."
                  : "Employee attendance data not available."}
              </PageSubtitle>
            </HeaderLeft>
          </PageHeader>

          <EmptyMessage>
            {stillSearching
              ? "Please wait..."
              : "Please open the attendance details from the attendance report."}
          </EmptyMessage>
        </AttendanceContainer>
      </AttendancePage>
    );
  }

  // ==================================================
  // SUMMARY
  // ==================================================

  const workingDays = employee.working_days ?? 0;

  const presentCount = employee.present_days ?? 0;

  const absentCount = employee.absent_days ?? 0;

  const lopCount = employee.lop_days ?? 0;

  // ==================================================
  // DATE
  // ==================================================

  const formatDate = (dateStr) => {
    if (!dateStr) {
      return "—";
    }

    const d = new Date(dateStr);

    if (isNaN(d.getTime())) {
      return "—";
    }

    const day = d.getDate().toString().padStart(2, "0");

    const month = d.toLocaleString("en-GB", {
      month: "short",
    });

    return `${day} ${month}`;
  };

  // ==================================================
  // TIME
  // ==================================================

  const formatTime = (timeStr) => {
    if (!timeStr || timeStr === "null" || timeStr === "undefined") {
      return "—";
    }

    return String(timeStr).trim();
  };

  // ==================================================
  // OPEN EDIT MODAL
  // ==================================================

  const handleEdit = (record, index) => {
    setSelectedRecord({
      ...record,
      index,
    });

    // -----------------------------------------------
    // ATTENDANCE TYPE
    // -----------------------------------------------
    // Unpaid is selected by default.
    // If the existing record is Paid, show Paid.
    // Otherwise show Unpaid.
    // -----------------------------------------------

    const existingAttendanceType = String(
      record.attendance_type ||
        record.payment_type ||
        record.day_limit ||
        "unpaid"
    )
      .toLowerCase()
      .trim();

    if (existingAttendanceType === "paid") {
      setAttendanceType("paid");
    } else {
      setAttendanceType("unpaid");
    }

    // -----------------------------------------------
    // EXISTING NOTE
    // -----------------------------------------------

    setEditNote(record.remark || record.note || "");

    // -----------------------------------------------
    // CLEAR PREVIOUS UPDATE STATE
    // -----------------------------------------------

    dispatch(clearAttendanceUpdate());

    setIsEditModalOpen(true);
  };

  // ==================================================
  // CLOSE EDIT MODAL
  // ==================================================

  const handleCloseEdit = () => {
    if (updateLoading) {
      return;
    }

    setIsEditModalOpen(false);

    setSelectedRecord(null);

    setAttendanceType("unpaid");

    setEditNote("");

    dispatch(clearAttendanceUpdate());
  };

  // ==================================================
  // SAVE ATTENDANCE
  // ==================================================

  const handleSaveAttendance = async () => {
    if (!selectedRecord) {
      return;
    }

    // ---------------------------------------------
    // EMPLOYEE ID
    // ---------------------------------------------

    const employeeId =
      selectedRecord?.employee ||
      selectedRecord?.employee_id ||
      employee?.employee_id ||
      employee?.employee_pk ||
      employee?.employee;

    // ---------------------------------------------
    // VALIDATE EMPLOYEE
    // ---------------------------------------------

    if (!employeeId) {
      console.error("❌ Employee ID is missing");

      return;
    }

    // ---------------------------------------------
    // VALIDATE DATE
    // ---------------------------------------------

    if (!selectedRecord.date) {
      console.error("❌ Attendance date is missing");

      return;
    }

    // ---------------------------------------------
    // ATTENDANCE TYPE
    // ---------------------------------------------

    const dayLimit = attendanceType === "unpaid" ? "unpaid" : "paid";

    // ---------------------------------------------
    // API PAYLOAD
    // ---------------------------------------------

    const payload = {
      employee: employeeId,

      date: selectedRecord.date,

      day_limit: dayLimit,

      attendance_type: attendanceType,

      remark: editNote.trim(),
    };

    try {
      // -------------------------------------------
      // CALL REDUX THUNK
      // -------------------------------------------
      // The API now responds with:
      // {
      //   message: "Attendance record created successfully.",
      //   created: true,
      //   data: { id, employee, date, attendance_type, remark,
      //           total_hours, updated_by, updated_by_role,
      //           created_at, updated_at }
      // }
      // (created: false on a plain update, but the shape is the same)
      // -------------------------------------------

      const response = await dispatch(
        updateAttendanceThunk(payload)
      ).unwrap();

      // -------------------------------------------
      // INSTANT LOCAL UPDATE
      // -------------------------------------------
      // updateAttendanceThunk.fulfilled only patches
      // state.attendanceList in the slice — it never
      // touches state.attendanceSummary, which is what
      // this page actually reads from. So without this,
      // the table only updates once the refetch below
      // resolves, which can take a moment (or several
      // sequential requests if this employee isn't on
      // page 1). Patching from the save response makes
      // the change visible immediately, every time.
      //
      // The record fields live under `response.data`, not
      // at the top level of `response` (top level is just
      // { message, created, data }), so unwrap that first.
      // -------------------------------------------

      const updatedRecord = response?.data || {};

      const now = new Date().toISOString();

      setRecords((prevRecords) => {
        const recordExists = prevRecords.some(
          (record) => record.date === selectedRecord.date
        );

        // ---------------------------------------
        // UPDATE EXISTING ROW
        // ---------------------------------------

        if (recordExists) {
          return prevRecords.map((record) =>
            record.date === selectedRecord.date
              ? {
                  ...record,
                  ...updatedRecord,
                  attendance_type:
                    updatedRecord.attendance_type || attendanceType,
                  day_limit: dayLimit,
                  note: updatedRecord.remark ?? editNote,
                  remark: updatedRecord.remark ?? editNote,
                  updated_by: updatedRecord.updated_by || currentUser,
                  updated_by_role:
                    updatedRecord.updated_by_role ||
                    record.updated_by_role,
                  updated_at: updatedRecord.updated_at || now,
                }
              : record
          );
        }

        // ---------------------------------------
        // INSERT NEW ROW
        // ---------------------------------------
        // Covers the `created: true` case — the date didn't
        // have a record before this save, so there's nothing
        // to map over. Add it and keep the table sorted by date.
        // ---------------------------------------

        const newRecord = {
          date: selectedRecord.date,
          first_punch_in: null,
          last_punch_out: null,
          total_hours: "0.00",
          ...updatedRecord,
          attendance_type: updatedRecord.attendance_type || attendanceType,
          day_limit: dayLimit,
          note: updatedRecord.remark ?? editNote,
          remark: updatedRecord.remark ?? editNote,
          updated_by: updatedRecord.updated_by || currentUser,
          updated_by_role: updatedRecord.updated_by_role,
          updated_at: updatedRecord.updated_at || now,
        };

        return [...prevRecords, newRecord].sort((a, b) =>
          a.date < b.date ? -1 : a.date > b.date ? 1 : 0
        );
      });

      // -------------------------------------------
      // RE-FETCH FROM SERVER (background sync)
      // -------------------------------------------
      // Keeps Redux (and the report page's summary)
      // in sync with the server. The screen has already
      // been updated above, so this just confirms it.
      // -------------------------------------------

      refetchEmployee();

      // -------------------------------------------
      // CLOSE MODAL
      // -------------------------------------------

      setIsEditModalOpen(false);

      setSelectedRecord(null);

      setAttendanceType("unpaid");

      setEditNote("");

      dispatch(clearAttendanceUpdate());
    } catch (error) {
      console.error("❌ Failed to update attendance:", error);

      // Keep modal open
      // so the user can see the error
    }
  };

  // ==================================================
  // SUMMARY CARDS
  // ==================================================

  const cards = [
    {
      label: "Working Days",
      value: workingDays,
      type: "default",
    },

    {
      label: "Present",
      value: presentCount,
      type: "present",
    },

    {
      label: "Absent",
      value: absentCount,
      type: "absent",
    },

    {
      label: "LOP",
      value: lopCount,
      type: "lop",
    },
  ];

  // ==================================================
  // BACK
  // ==================================================

  const handleBack = () => {
    navigate(ATTENDANCE_REPORT_ROUTE);
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <AttendancePage>
      <AttendanceContainer >
        {/* ========================================== */}
        {/* HEADER */}
        {/* ========================================== */}

        <PageHeader>
          <HeaderLeft>
            <BackButton type="button" onClick={handleBack}>
              ← Back
            </BackButton>

            <div>
              <PageTitle>{employee.employee_name}</PageTitle>

              <PageSubtitle>{monthName} — Attendance Summary</PageSubtitle>
            </div>
          </HeaderLeft>
 <HeaderRight>
  <PrintButton
    type="button"
    onClick={handlePrint}
  >
    📊 Employee Excel
  </PrintButton>
</HeaderRight>
        </PageHeader>

        {/* ========================================== */}
        {/* SUMMARY CARDS */}
        {/* ========================================== */}

        <CardsWrapper>
          {cards.map((card) => (
            <Card key={card.label} type={card.type}>
              <CardTitle>{card.label}</CardTitle>

              <CardValue type={card.type}>{card.value}</CardValue>
            </Card>
          ))}
        </CardsWrapper>

        {/* ========================================== */}
        {/* ERROR MESSAGE */}
        {/* ========================================== */}

        {updateError && (
          <div
            style={{
              marginBottom: "15px",
              padding: "12px 15px",
              borderRadius: "8px",
              background: "#fff1f1",
              border: "1px solid #f1b5b5",
              color: "#c62828",
              fontSize: "14px",
            }}
          >
            {typeof updateError === "object"
              ? updateError.detail ||
                updateError.message ||
                "Failed to update attendance"
              : updateError}
          </div>
        )}

        {/* ========================================== */}
        {/* SUCCESS MESSAGE */}
        {/* ========================================== */}

        {updateSuccess && (
          <div
            style={{
              marginBottom: "15px",
              padding: "12px 15px",
              borderRadius: "8px",
              background: "#edf9f1",
              border: "1px solid #b7e4c7",
              color: "#18743e",
              fontSize: "14px",
            }}
          >
            Attendance updated successfully.
          </div>
        )}

        {/* ========================================== */}
        {/* ATTENDANCE TABLE */}
        {/* ========================================== */}

        <AttendanceTableWrapper>
          <AttendanceTable>
            <thead>
              <tr>
                <TableHeader>Date</TableHeader>

                <TableHeader>Attendance Type</TableHeader>

                <TableHeader>Punch In</TableHeader>

                <TableHeader>Punch Out</TableHeader>

                <TableHeader>Hours</TableHeader>

                <TableHeader>Note</TableHeader>

                <TableHeader>Edited By</TableHeader>

                <TableHeader>Action</TableHeader>
              </tr>
            </thead>

            <tbody>
              {summaryLoading && records.length === 0 ? (
                <tr>
                  <TableCell colSpan={8}>
                    <EmptyMessage>Loading attendance records...</EmptyMessage>
                  </TableCell>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <TableCell colSpan={8}>
                    <EmptyMessage>
                      No attendance records available
                    </EmptyMessage>
                  </TableCell>
                </tr>
              ) : (
                records.map((rec, idx) => {
                  // --------------------------------
                  // ATTENDANCE TYPE
                  // --------------------------------

                  const hasAttendanceType =
                    rec.attendance_type !== null &&
                    rec.attendance_type !== undefined &&
                    String(rec.attendance_type).trim() !== "";

                  const currentAttendanceType = hasAttendanceType
                    ? String(rec.attendance_type).toLowerCase().trim()
                    : null;

                  const attendanceText = hasAttendanceType
                    ? currentAttendanceType === "unpaid"
                      ? "Unpaid"
                      : "Paid"
                    : rec.status || "—";

                  return (
                    <TableRow key={`${rec.date}-${idx}`}>
                      {/* DATE */}

                      <TableCell>{formatDate(rec.date)}</TableCell>

                      {/* ATTENDANCE TYPE */}

                      <TableCell>
                        <strong
                          style={{
                            color:
                              attendanceText === "Unpaid"
                                ? "#d13c3c"
                                : "#1d8a4b",
                          }}
                        >
                          {attendanceText}
                        </strong>
                      </TableCell>

                      {/* PUNCH IN */}

                      <TableCell>
                        {formatTime(rec.first_punch_in)}
                      </TableCell>

                      {/* PUNCH OUT */}

                      <TableCell>
                        {formatTime(rec.last_punch_out)}
                      </TableCell>

                      {/* HOURS */}

                      <TableCell className="hours-cell">
                        {Number(rec.total_hours || 0).toFixed(2)}h
                      </TableCell>

                      {/* NOTE */}

                      <TableCell>
                        {rec.note || rec.remark ? (
                          <NoteCell>
                            <NoteText>
                              {(rec.note || rec.remark).length > 15
                                ? `${(rec.note || rec.remark).substring(
                                    0,
                                    15
                                  )}...`
                                : rec.note || rec.remark}
                            </NoteText>

                            <NoteTooltip>
                              <TooltipLabel>HR Note</TooltipLabel>

                              <TooltipContent>
                                {rec.note || rec.remark}
                              </TooltipContent>
                            </NoteTooltip>
                          </NoteCell>
                        ) : (
                          <NoNote>—</NoNote>
                        )}
                      </TableCell>

                      {/* EDITED BY */}

                      <TableCell>
                        {rec.updated_by ? (
                          <div>
                            <strong>{rec.updated_by_role}</strong>

                            {rec.updated_at  && (
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#888",
                                  marginTop: "3px",
                                }}
                              >
                                {rec.updated_at }
                              </div>
                            )}
                          </div>
                        ) : (
                          <span
                            style={{
                              color: "#999",
                            }}
                          >
                            Not edited
                          </span>
                        )}
                      </TableCell>

                      {/* ACTION */}

                      <TableCell>
                        <EditButton
                          type="button"
                          onClick={() => handleEdit(rec, idx)}
                          disabled={updateLoading}
                        >
                          Edit
                        </EditButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </tbody>
          </AttendanceTable>
        </AttendanceTableWrapper>
      </AttendanceContainer>

      {/* ========================================== */}
      {/* EDIT ATTENDANCE MODAL */}
      {/* ========================================== */}

      {isEditModalOpen && selectedRecord && (
        <EditModalOverlay onClick={handleCloseEdit}>
          <EditModal onClick={(e) => e.stopPropagation()}>
            {/* ================================= */}
            {/* MODAL HEADER */}
            {/* ================================= */}

            <ModalHeader>
              <div>
                <ModalTitle>Edit Attendance</ModalTitle>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#777",
                    marginTop: "4px",
                  }}
                >
                  {formatDate(selectedRecord.date)}
                </div>
              </div>

              <CloseButton
                type="button"
                onClick={handleCloseEdit}
                disabled={updateLoading}
              >
                ×
              </CloseButton>
            </ModalHeader>

            {/* ================================= */}
            {/* ATTENDANCE TYPE */}
            {/* ================================= */}

            <FormGroup>
              <FormLabel>Attendance Type</FormLabel>

              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  flexWrap: "wrap",
                  marginTop: "8px",
                }}
              >
                {/* PAID */}

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    padding: "10px 14px",
                    border:
                      attendanceType === "paid"
                        ? "2px solid #1d8a4b"
                        : "1px solid #e2e2e2",
                    borderRadius: "8px",
                    background:
                      attendanceType === "paid" ? "#eaf8ef" : "#fff",
                    fontWeight: "600",
                  }}
                >
                  <input
                    type="radio"
                    name="attendanceType"
                    value="paid"
                    checked={attendanceType === "paid"}
                    onChange={() => setAttendanceType("paid")}
                    disabled={updateLoading}
                  />

                  <span>Paid</span>
                </label>

                {/* UNPAID */}

                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    padding: "10px 14px",
                    border:
                      attendanceType === "unpaid"
                        ? "2px solid #d13c3c"
                        : "1px solid #e2e2e2",
                    borderRadius: "8px",
                    background:
                      attendanceType === "unpaid" ? "#fff0f0" : "#fff",
                    fontWeight: "600",
                  }}
                >
                  <input
                    type="radio"
                    name="attendanceType"
                    value="unpaid"
                    checked={attendanceType === "unpaid"}
                    onChange={() => setAttendanceType("unpaid")}
                    disabled={updateLoading}
                  />

                  <span>Unpaid</span>
                </label>
              </div>
            </FormGroup>

            {/* ================================= */}
            {/* NOTE */}
            {/* ================================= */}

            <FormGroup>
              <FormLabel>Note / Reason</FormLabel>

              <FormTextarea
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                placeholder="Enter note or reason..."
                rows={4}
                disabled={updateLoading}
              />
            </FormGroup>

            {/* ================================= */}
            {/* AUDIT INFORMATION */}
            {/* ================================= */}

            <AuditInfo>
              <AuditTitle>Attendance Update</AuditTitle>

              <AuditText>Updated by:</AuditText>

              <AuditText>
                <strong>{currentUser}</strong>
              </AuditText>

              <AuditText>
                Attendance Type:{" "}
                <strong>
                  {attendanceType === "unpaid" ? "Unpaid" : "Paid"}
                </strong>
              </AuditText>

              <AuditText>
                Note: <strong>{editNote ? editNote : "No note added"}</strong>
              </AuditText>
            </AuditInfo>

            {/* ================================= */}
            {/* ACTIONS */}
            {/* ================================= */}

            <ModalActions>
              <CancelButton
                type="button"
                onClick={handleCloseEdit}
                disabled={updateLoading}
              >
                Cancel
              </CancelButton>

              <SaveButton
                type="button"
                onClick={handleSaveAttendance}
                disabled={updateLoading}
              >
                {updateLoading ? "Saving..." : "Save Changes"}
              </SaveButton>
            </ModalActions>
          </EditModal>
        </EditModalOverlay>
      )}
    </AttendancePage>
  );
};

export default EmployeeAttendance;