import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useDispatch, useSelector } from "react-redux";

import {
  updateAttendanceThunk,
  clearAttendanceUpdate,
} from "../../Redux/attendanceSlice";

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

const EmployeeAttendance = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    employee,
    monthName,
    selectedMonth,
  } = location.state || {};

  const printRef = useRef();

  // ==================================================
  // REDUX STATE
  // ==================================================

  const {
    updateLoading,
    updateSuccess,
    updateError,
  } = useSelector(
    (state) => state.attendance
  );

  // ==================================================
  // RECORDS
  // ==================================================

  const [records, setRecords] = useState(
    employee?.daily_records || []
  );

  // ==================================================
  // EDIT MODAL STATE
  // ==================================================

  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);

  const [selectedRecord, setSelectedRecord] =
    useState(null);

  // ==================================================
  // ATTENDANCE TYPE
  // paid / unpaid
  // ==================================================

  const [attendanceType, setAttendanceType] =
    useState("unpaid");

  // ==================================================
  // NOTE
  // ==================================================

  const [editNote, setEditNote] =
    useState("");

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

  const handlePrint = useReactToPrint({
    contentRef: printRef,

    documentTitle: `${
      employee?.employee_name || "Employee"
    }-attendance`,
  });

  // ==================================================
  // NO EMPLOYEE
  // ==================================================

  if (!employee) {
    return (
      <AttendancePage>
        <AttendanceContainer>

          <PageHeader>

            <HeaderLeft>

              <BackButton
                type="button"
                onClick={() =>
                  navigate(
                    "/attendance-report"
                  )
                }
              >
                ← Back
              </BackButton>

              <PageTitle>
                Employee Attendance
              </PageTitle>

              <PageSubtitle>
                Employee attendance data not
                available.
              </PageSubtitle>

            </HeaderLeft>

          </PageHeader>

          <EmptyMessage>
            Please open the attendance details
            from the attendance report.
          </EmptyMessage>

        </AttendanceContainer>
      </AttendancePage>
    );
  }

  // ==================================================
  // SUMMARY
  // ==================================================

  const workingDays =
    employee.working_days ?? 0;

  const presentCount =
    employee.present_days ?? 0;

  const absentCount =
    employee.absent_days ?? 0;

  const lopCount =
    employee.lop_days ?? 0;

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

    const day = d
      .getDate()
      .toString()
      .padStart(2, "0");

    const month = d.toLocaleString(
      "en-GB",
      {
        month: "short",
      }
    );

    return `${day} ${month}`;
  };

  // ==================================================
  // TIME
  // ==================================================

  const formatTime = (timeStr) => {
    if (
      !timeStr ||
      timeStr === "null" ||
      timeStr === "undefined"
    ) {
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

  setEditNote(
    record.remark ||
      record.note ||
      ""
  );

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

    dispatch(
      clearAttendanceUpdate()
    );
  };

  // ==================================================
  // SAVE ATTENDANCE
  // ==================================================

  const handleSaveAttendance =
    async () => {

      if (!selectedRecord) {
        return;
      }

      console.log(
        "================================"
      );

      console.log(
        "employee object:",
        employee
      );

      console.log(
        "selectedRecord object:",
        selectedRecord
      );

      // ---------------------------------------------
      // EMPLOYEE ID
      // ---------------------------------------------

      const employeeId =
        employee?.id ||
        employee?.employee_id ||
        employee?.employee;

      // ---------------------------------------------
      // VALIDATE EMPLOYEE
      // ---------------------------------------------

      if (!employeeId) {

        console.error(
          "❌ Employee ID is missing"
        );

        return;
      }

      // ---------------------------------------------
      // VALIDATE DATE
      // ---------------------------------------------

      if (!selectedRecord.date) {

        console.error(
          "❌ Attendance date is missing"
        );

        return;
      }

      // ---------------------------------------------
      // ATTENDANCE TYPE
      // ---------------------------------------------

      const dayLimit =
        attendanceType === "unpaid"
          ? "unpaid"
          : "paid";

      // ---------------------------------------------
      // API PAYLOAD
      // ---------------------------------------------
      //
      // STATUS HAS BEEN COMPLETELY REMOVED
      //
      // ---------------------------------------------

      const payload = {
        employee: employeeId,

        date: selectedRecord.date,

        day_limit: dayLimit,

        attendance_type:
          attendanceType,

        remark: editNote.trim(),
      };

      console.log(
        "📤 Updating attendance"
      );

      console.log(
        "Employee:",
        employeeId
      );

      console.log(
        "Date:",
        selectedRecord.date
      );

      console.log(
        "Attendance Type:",
        attendanceType
      );

      console.log(
        "Day Limit:",
        dayLimit
      );

      console.log(
        "Remark:",
        editNote
      );

      console.log(
        "📦 Full Payload:",
        payload
      );

      console.log(
        "================================"
      );

      try {

        // -------------------------------------------
        // CALL REDUX THUNK
        // -------------------------------------------

        const response =
          await dispatch(
            updateAttendanceThunk(
              payload
            )
          ).unwrap();

        console.log(
          "✅ Attendance updated successfully:",
          response
        );

        // -------------------------------------------
        // UPDATE LOCAL TABLE
        // -------------------------------------------

        const now =
          new Date().toISOString();

        setRecords(
          (prevRecords) =>
            prevRecords.map(
              (record, index) => {

                if (
                  index !==
                  selectedRecord.index
                ) {
                  return record;
                }

                return {
                  ...record,

                  // --------------------------------
                  // ATTENDANCE TYPE
                  // --------------------------------

                  attendance_type:
                    attendanceType,

                  day_limit:
                    dayLimit,

                  // --------------------------------
                  // NOTE
                  // --------------------------------

                  note: editNote,

                  remark: editNote,

                  // --------------------------------
                  // AUDIT
                  // --------------------------------

                  edited_by:
                    currentUser,

                  edited_at:
                    now,
                };
              }
            )
        );

        // -------------------------------------------
        // CLOSE MODAL
        // -------------------------------------------

        setIsEditModalOpen(false);

        setSelectedRecord(null);

        setAttendanceType("unpaid");

        setEditNote("");

        dispatch(
          clearAttendanceUpdate()
        );

      } catch (error) {

        console.error(
          "❌ Failed to update attendance:",
          error
        );

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
    navigate(
      "/employee-attendance-report"
    );
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <AttendancePage>

      <AttendanceContainer
        ref={printRef}
      >

        {/* ========================================== */}
        {/* HEADER */}
        {/* ========================================== */}

        <PageHeader>

          <HeaderLeft>

            <BackButton
              type="button"
              onClick={handleBack}
            >
              ← Back
            </BackButton>

            <div>

              <PageTitle>
                {employee.employee_name}
              </PageTitle>

              <PageSubtitle>
                {monthName} — Attendance Summary
              </PageSubtitle>

            </div>

          </HeaderLeft>

          <HeaderRight>

            <PrintButton
              type="button"
              onClick={handlePrint}
            >
              Print
            </PrintButton>

          </HeaderRight>

        </PageHeader>

        {/* ========================================== */}
        {/* SUMMARY CARDS */}
        {/* ========================================== */}

        <CardsWrapper>

          {cards.map((card) => (

            <Card
              key={card.label}
              type={card.type}
            >

              <CardTitle>
                {card.label}
              </CardTitle>

              <CardValue
                type={card.type}
              >
                {card.value}
              </CardValue>

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
              border:
                "1px solid #f1b5b5",
              color: "#c62828",
              fontSize: "14px",
            }}
          >

            {typeof updateError ===
            "object"
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
              border:
                "1px solid #b7e4c7",
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

                <TableHeader>
                  Date
                </TableHeader>

                <TableHeader>
                  Attendance Type
                </TableHeader>

                <TableHeader>
                  Punch In
                </TableHeader>

                <TableHeader>
                  Punch Out
                </TableHeader>

                <TableHeader>
                  Hours
                </TableHeader>

                <TableHeader>
                  Note
                </TableHeader>

                <TableHeader>
                  Edited By
                </TableHeader>

                <TableHeader>
                  Action
                </TableHeader>

              </tr>

            </thead>

            <tbody>

              {records.length === 0 ? (

                <tr>

                  <TableCell
                    colSpan={8}
                  >

                    <EmptyMessage>
                      No attendance records
                      available
                    </EmptyMessage>

                  </TableCell>

                </tr>

              ) : (

                records.map(
                  (rec, idx) => {

                    // --------------------------------
                    // ATTENDANCE TYPE
                    // --------------------------------

                    const currentAttendanceType =
                      String(
                        rec.attendance_type ||
                        rec.payment_type ||
                        rec.day_limit ||
                        "paid"
                      )
                        .toLowerCase()
                        .trim();

                    const attendanceText =
                      currentAttendanceType ===
                      "unpaid"
                        ? "Unpaid"
                        : "Paid";

                    return (

                      <TableRow
                        key={`${rec.date}-${idx}`}
                      >

                        {/* DATE */}

                        <TableCell>
                          {formatDate(
                            rec.date
                          )}
                        </TableCell>

                        {/* ATTENDANCE TYPE */}

                        <TableCell>

                          <strong
                            style={{
                              color:
                                attendanceText ===
                                "Unpaid"
                                  ? "#d13c3c"
                                  : "#1d8a4b",
                            }}
                          >
                            {attendanceText}
                          </strong>

                        </TableCell>

                        {/* PUNCH IN */}

                        <TableCell>
                          {formatTime(
                            rec.first_punch_in
                          )}
                        </TableCell>

                        {/* PUNCH OUT */}

                        <TableCell>
                          {formatTime(
                            rec.last_punch_out
                          )}
                        </TableCell>

                        {/* HOURS */}

                        <TableCell
                          className="hours-cell"
                        >

                          {Number(
                            rec.total_hours ||
                            0
                          ).toFixed(2)}

                          h

                        </TableCell>

                        {/* NOTE */}

                        <TableCell>

                          {rec.note ||
                          rec.remark ? (

                            <NoteCell>

                              <NoteText>

                                {(
                                  rec.note ||
                                  rec.remark
                                ).length >
                                15
                                  ? `${(
                                      rec.note ||
                                      rec.remark
                                    ).substring(
                                      0,
                                      15
                                    )}...`
                                  : rec.note ||
                                    rec.remark}

                              </NoteText>

                              <NoteTooltip>

                                <TooltipLabel>
                                  HR Note
                                </TooltipLabel>

                                <TooltipContent>
                                  {rec.note ||
                                    rec.remark}
                                </TooltipContent>

                              </NoteTooltip>

                            </NoteCell>

                          ) : (

                            <NoNote>
                              —
                            </NoNote>

                          )}

                        </TableCell>

                        {/* EDITED BY */}

                        <TableCell>

                          {rec.edited_by ? (

                            <div>

                              <strong>
                                {
                                  rec.edited_by
                                }
                              </strong>

                              {rec.edited_at && (

                                <div
                                  style={{
                                    fontSize:
                                      "11px",
                                    color:
                                      "#888",
                                    marginTop:
                                      "3px",
                                  }}
                                >
                                  {new Date(
                                    rec.edited_at
                                  ).toLocaleString()}
                                </div>

                              )}

                            </div>

                          ) : (

                            <span
                              style={{
                                color:
                                  "#999",
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
                            onClick={() =>
                              handleEdit(
                                rec,
                                idx
                              )
                            }
                            disabled={
                              updateLoading
                            }
                          >
                            Edit
                          </EditButton>

                        </TableCell>

                      </TableRow>

                    );
                  }
                )

              )}

            </tbody>

          </AttendanceTable>

        </AttendanceTableWrapper>

      </AttendanceContainer>

      {/* ========================================== */}
      {/* EDIT ATTENDANCE MODAL */}
      {/* ========================================== */}

      {isEditModalOpen &&
        selectedRecord && (

          <EditModalOverlay
            onClick={
              handleCloseEdit
            }
          >

            <EditModal
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* ================================= */}
              {/* MODAL HEADER */}
              {/* ================================= */}

              <ModalHeader>

                <div>

                  <ModalTitle>
                    Edit Attendance
                  </ModalTitle>

                  <div
                    style={{
                      fontSize:
                        "13px",
                      color:
                        "#777",
                      marginTop:
                        "4px",
                    }}
                  >
                    {formatDate(
                      selectedRecord.date
                    )}
                  </div>

                </div>

                <CloseButton
                  type="button"
                  onClick={
                    handleCloseEdit
                  }
                  disabled={
                    updateLoading
                  }
                >
                  ×
                </CloseButton>

              </ModalHeader>

              {/* ================================= */}
              {/* ATTENDANCE TYPE */}
              {/* ================================= */}

              <FormGroup>

                <FormLabel>
                  Attendance Type
                </FormLabel>

                <div
                  style={{
                    display:
                      "flex",
                    gap: "15px",
                    flexWrap:
                      "wrap",
                    marginTop:
                      "8px",
                  }}
                >

                  {/* PAID */}

                  <label
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "8px",
                      cursor:
                        "pointer",
                      padding:
                        "10px 14px",
                      border:
                        attendanceType ===
                        "paid"
                          ? "2px solid #1d8a4b"
                          : "1px solid #e2e2e2",
                      borderRadius:
                        "8px",
                      background:
                        attendanceType ===
                        "paid"
                          ? "#eaf8ef"
                          : "#fff",
                      fontWeight:
                        "600",
                    }}
                  >

                    <input
                      type="radio"
                      name="attendanceType"
                      value="paid"
                      checked={
                        attendanceType ===
                        "paid"
                      }
                      onChange={() =>
                        setAttendanceType(
                          "paid"
                        )
                      }
                      disabled={
                        updateLoading
                      }
                    />

                    <span>
                      Paid
                    </span>

                  </label>

                  {/* UNPAID */}

                  <label
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "8px",
                      cursor:
                        "pointer",
                      padding:
                        "10px 14px",
                      border:
                        attendanceType ===
                        "unpaid"
                          ? "2px solid #d13c3c"
                          : "1px solid #e2e2e2",
                      borderRadius:
                        "8px",
                      background:
                        attendanceType ===
                        "unpaid"
                          ? "#fff0f0"
                          : "#fff",
                      fontWeight:
                        "600",
                    }}
                  >

                    <input
                      type="radio"
                      name="attendanceType"
                      value="unpaid"
                      checked={
                        attendanceType ===
                        "unpaid"
                      }
                      onChange={() =>
                        setAttendanceType(
                          "unpaid"
                        )
                      }
                      disabled={
                        updateLoading
                      }
                    />

                    <span>
                      Unpaid
                    </span>

                  </label>

                </div>

              </FormGroup>

              {/* ================================= */}
              {/* NOTE */}
              {/* ================================= */}

              <FormGroup>

                <FormLabel>
                  Note / Reason
                </FormLabel>

                <FormTextarea
                  value={
                    editNote
                  }
                  onChange={(e) =>
                    setEditNote(
                      e.target.value
                    )
                  }
                  placeholder="Enter note or reason..."
                  rows={4}
                  disabled={
                    updateLoading
                  }
                />

              </FormGroup>

              {/* ================================= */}
              {/* AUDIT INFORMATION */}
              {/* ================================= */}

              <AuditInfo>

                <AuditTitle>
                  Attendance Update
                </AuditTitle>

                <AuditText>
                  Updated by:
                </AuditText>

                <AuditText>

                  <strong>
                    {currentUser}
                  </strong>

                </AuditText>

                <AuditText>

                  Attendance Type:{" "}

                  <strong>
                    {attendanceType ===
                    "unpaid"
                      ? "Unpaid"
                      : "Paid"}
                  </strong>

                </AuditText>

                <AuditText>

                  Note:{" "}

                  <strong>
                    {editNote
                      ? editNote
                      : "No note added"}
                  </strong>

                </AuditText>

              </AuditInfo>

              {/* ================================= */}
              {/* ACTIONS */}
              {/* ================================= */}

              <ModalActions>

                <CancelButton
                  type="button"
                  onClick={
                    handleCloseEdit
                  }
                  disabled={
                    updateLoading
                  }
                >
                  Cancel
                </CancelButton>

                <SaveButton
                  type="button"
                  onClick={
                    handleSaveAttendance
                  }
                  disabled={
                    updateLoading
                  }
                >

                  {updateLoading
                    ? "Saving..."
                    : "Save Changes"}

                </SaveButton>

              </ModalActions>

            </EditModal>

          </EditModalOverlay>

        )}

    </AttendancePage>
  );
};

export default EmployeeAttendance;