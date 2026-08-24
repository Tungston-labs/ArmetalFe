import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

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
  StatusBadge,
  EmptyMessage,

  // Add these styled components
  EditButton,
  EditModalOverlay,
  EditModal,
  ModalHeader,
  ModalTitle,
  CloseButton,
  FormGroup,
  FormLabel,
  FormSelect,
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

  const {
    employee,
    monthName,
    selectedMonth,
  } = location.state || {};

  const printRef = useRef();

  // --------------------------------------------------
  // Edit State
  // --------------------------------------------------

  const [records, setRecords] = useState(
    employee?.daily_records || []
  );

  const [isEditModalOpen, setIsEditModalOpen] =
    useState(false);

  const [selectedRecord, setSelectedRecord] =
    useState(null);

  const [editStatus, setEditStatus] =
    useState("");

  const [editNote, setEditNote] =
    useState("");

  // This should ideally come from logged-in user
  const currentUser =
    localStorage.getItem("userName") ||
    localStorage.getItem("username") ||
    "HR Admin";

  // --------------------------------------------------
  // Print
  // --------------------------------------------------

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${
      employee?.employee_name || "Employee"
    }-attendance`,
  });

  // --------------------------------------------------
  // No Employee
  // --------------------------------------------------

  if (!employee) {
    return (
      <AttendancePage>
        <AttendanceContainer>
          <PageHeader>
            <HeaderLeft>
              <BackButton
                type="button"
                onClick={() =>
                  navigate("/attendance-report")
                }
              >
                ← Back
              </BackButton>

              <PageTitle>
                Employee Attendance
              </PageTitle>

              <PageSubtitle>
                Employee attendance data not available.
              </PageSubtitle>
            </HeaderLeft>
          </PageHeader>

          <EmptyMessage>
            Please open the attendance details from
            the attendance report.
          </EmptyMessage>
        </AttendanceContainer>
      </AttendancePage>
    );
  }

  // --------------------------------------------------
  // Summary
  // --------------------------------------------------

  const workingDays =
    employee.working_days ?? 0;

  const presentCount =
    employee.present_days ?? 0;

  const absentCount =
    employee.absent_days ?? 0;

  const lopCount =
    employee.lop_days ?? 0;

  // --------------------------------------------------
  // Status
  // --------------------------------------------------

  const getStatusLabel = (status) => {
    const normalized = String(status || "")
      .toLowerCase()
      .trim();

    switch (normalized) {
      case "present":
        return {
          text: "Present",
          key: "present",
        };

      case "active":
        return {
          text: "Working",
          key: "active",
        };

      case "half_day":
        return {
          text: "Half Day",
          key: "half_day",
        };

      case "leave":
        return {
          text: "Leave",
          key: "leave",
        };

      case "holiday":
        return {
          text: "Holiday",
          key: "holiday",
        };

      case "off":
      case "company off day":
        return {
          text: "Company Off Day",
          key: "off",
        };

      case "second saturday":
        return {
          text: "Second Saturday",
          key: "holiday",
        };

      case "missed_punchout":
        return {
          text: "Missed Punch Out",
          key: "missed_punchout",
        };

      case "absent":
        return {
          text: "Absent",
          key: "absent",
        };

      case "lop":
        return {
          text: "LOP",
          key: "lop",
        };

      default:
        return {
          text: status || "—",
          key: "holiday",
        };
    }
  };

  // --------------------------------------------------
  // Date
  // --------------------------------------------------

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";

    const d = new Date(dateStr);

    if (isNaN(d.getTime())) {
      return "—";
    }

    const day = d
      .getDate()
      .toString()
      .padStart(2, "0");

    const month = d.toLocaleString("en-GB", {
      month: "short",
    });

    return `${day} ${month}`;
  };

  // --------------------------------------------------
  // Time
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Open Edit Modal
  // --------------------------------------------------

  const handleEdit = (record, index) => {
    setSelectedRecord({
      ...record,
      index,
    });

    setEditStatus(record.status || "");

    setEditNote(record.note || "");

    setIsEditModalOpen(true);
  };

  // --------------------------------------------------
  // Close Edit Modal
  // --------------------------------------------------

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setSelectedRecord(null);
    setEditStatus("");
    setEditNote("");
  };

  // --------------------------------------------------
  // Save Attendance
  // --------------------------------------------------

  const handleSaveAttendance = async () => {
    if (!selectedRecord) return;

    try {
      /*
       * IMPORTANT:
       *
       * This updates the frontend immediately.
       *
       * Replace this section with your backend API call.
       */

      const updatedRecord = {
        ...selectedRecord,
        status: editStatus,
        note: editNote,
        edited_by: currentUser,
        edited_at: new Date().toISOString(),
      };

      setRecords((prevRecords) =>
        prevRecords.map((record, index) =>
          index === selectedRecord.index
            ? {
                ...record,
                status: editStatus,
                note: editNote,
                edited_by: currentUser,
                edited_at: new Date().toISOString(),
              }
            : record
        )
      );

      console.log(
        "Attendance updated:",
        updatedRecord
      );

      handleCloseEdit();
    } catch (error) {
      console.error(
        "Failed to update attendance:",
        error
      );
    }
  };

  // --------------------------------------------------
  // Summary Cards
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Back
  // --------------------------------------------------

  const handleBack = () => {
    navigate("/employee-attendance-report");
  };

  return (
    <AttendancePage>
      <AttendanceContainer ref={printRef}>

        {/* ----------------------------------------- */}
        {/* Header */}
        {/* ----------------------------------------- */}

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

        {/* ----------------------------------------- */}
        {/* Summary Cards */}
        {/* ----------------------------------------- */}

        <CardsWrapper>
          {cards.map((card) => (
            <Card
              key={card.label}
              type={card.type}
            >
              <CardTitle>
                {card.label}
              </CardTitle>

              <CardValue type={card.type}>
                {card.value}
              </CardValue>
            </Card>
          ))}
        </CardsWrapper>

        {/* ----------------------------------------- */}
        {/* Attendance Table */}
        {/* ----------------------------------------- */}

        <AttendanceTableWrapper>
          <AttendanceTable>

            <thead>
              <tr>
                <TableHeader>
                  Date
                </TableHeader>

                <TableHeader>
                  Status
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
                  <TableCell colSpan={8}>
                    <EmptyMessage>
                      No attendance records available
                    </EmptyMessage>
                  </TableCell>
                </tr>
              ) : (
                records.map((rec, idx) => {
                  const label =
                    getStatusLabel(rec.status);

                  return (
                    <TableRow key={idx}>

                      {/* Date */}
                      <TableCell>
                        {formatDate(rec.date)}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <StatusBadge
                          status={label.key}
                        >
                          {label.text}
                        </StatusBadge>
                      </TableCell>

                      {/* Punch In */}
                      <TableCell>
                        {formatTime(
                          rec.first_punch_in
                        )}
                      </TableCell>

                      {/* Punch Out */}
                      <TableCell>
                        {formatTime(
                          rec.last_punch_out
                        )}
                      </TableCell>

                      {/* Hours */}
                      <TableCell className="hours-cell">
                        {Number(
                          rec.total_hours || 0
                        ).toFixed(2)}
                        h
                      </TableCell>

                      {/* Note */}
                   <TableCell>
  {rec.note ? (
    <NoteCell>
      <NoteText>
        {rec.note.length > 15
          ? `${rec.note.substring(0, 15)}...`
          : rec.note}
      </NoteText>

      <NoteTooltip>
        <TooltipLabel>HR Note</TooltipLabel>
        <TooltipContent>{rec.note}</TooltipContent>
      </NoteTooltip>
    </NoteCell>
  ) : (
    <NoNote>—</NoNote>
  )}
</TableCell>

                      {/* Edited By */}
                      <TableCell>
                        {rec.edited_by ? (
                          <div>
                            <strong>
                              {rec.edited_by}
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
                              color: "#999",
                            }}
                          >
                            Not edited
                          </span>
                        )}
                      </TableCell>

                      {/* Edit */}
                      <TableCell>
                        <EditButton
                          type="button"
                          onClick={() =>
                            handleEdit(
                              rec,
                              idx
                            )
                          }
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

      {/* ========================================= */}
      {/* EDIT ATTENDANCE MODAL */}
      {/* ========================================= */}

      {isEditModalOpen &&
        selectedRecord && (
          <EditModalOverlay
            onClick={handleCloseEdit}
          >
            <EditModal
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* Modal Header */}

              <ModalHeader>
                <div>
                  <ModalTitle>
                    Edit Attendance
                  </ModalTitle>

                  <div
                    style={{
                      fontSize: "13px",
                      color: "#777",
                      marginTop: "4px",
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
                >
                  ×
                </CloseButton>
              </ModalHeader>

              {/* Status */}

              <FormGroup>
                <FormLabel>
                  Attendance Status
                </FormLabel>

                <FormSelect
                  value={editStatus}
                  onChange={(e) =>
                    setEditStatus(
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Status
                  </option>

                  <option value="present">
                    Present
                  </option>

                  <option value="absent">
                    Absent
                  </option>

                  <option value="leave">
                    Leave
                  </option>

                  <option value="half_day">
                    Half Day
                  </option>

                  <option value="lop">
                    Loss of Pay
                  </option>

                  <option value="holiday">
                    Holiday
                  </option>

                  <option value="Company Off Day">
                    Company Off Day
                  </option>

                  <option value="missed_punchout">
                    Missed Punch Out
                  </option>

                  <option value="active">
                    Working
                  </option>
                </FormSelect>
              </FormGroup>

              {/* Note */}

              <FormGroup>
                <FormLabel>
                  HR Note / Reason
                </FormLabel>

                <FormTextarea
                  value={editNote}
                  onChange={(e) =>
                    setEditNote(
                      e.target.value
                    )
                  }
                  placeholder="Enter reason for changing attendance..."
                  rows={4}
                />
              </FormGroup>

              {/* Audit Info */}

              <AuditInfo>
                <AuditTitle>
                  Attendance Audit
                </AuditTitle>

                <AuditText>
                  This attendance will be updated
                  by:
                </AuditText>

                <AuditText>
                  <strong>
                    {currentUser}
                  </strong>
                </AuditText>
              </AuditInfo>

              {/* Actions */}

              <ModalActions>
                <CancelButton
                  type="button"
                  onClick={
                    handleCloseEdit
                  }
                >
                  Cancel
                </CancelButton>

                <SaveButton
                  type="button"
                  onClick={
                    handleSaveAttendance
                  }
                >
                  Save Changes
                </SaveButton>
              </ModalActions>

            </EditModal>
          </EditModalOverlay>
        )}
    </AttendancePage>
  );
};

export default EmployeeAttendance;