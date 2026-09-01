import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../Components/Pagination/ReusablePagination";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";

import {
    updateAttendanceRecord,
    getAttendanceSummary,
} from "../../Redux/attendanceSlice";

import {
    ModalOverlay,
    AttendanceModal,
    ModalHeader,
    ModalHeaderContent,
    ModalTitle,
    ModalSubtitle,
    CloseButton,
    FormGroup,
    FormLabel,
    AttendanceTypeOptions,
    AttendanceTypeOption,
    AttendanceRadio,
    AttendanceTypeCard,
    RadioCircle,
    AttendanceTypeContent,
    AttendanceTypeTitle,
    NoteWrapper,
    NoteInput,
    AttendanceUpdateBox,
    AttendanceUpdateTitle,
    UpdateItem,
    UpdateLabel,
    UpdateValue,
    ModalFooter,
    CancelButton,
    SaveButton,
} from "./AttendanceSummary.styles";

const formatDisplayDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(`${dateStr}T00:00:00`);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const AttendanceSummary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // =========================================================
    // DATA PASSED FROM THE MAIN ATTENDANCE REPORT PAGE
    // (with a sessionStorage fallback so a page refresh doesn't
    // lose track of which employee/month we're viewing)
    // =========================================================
    const stateFromRoute = location.state || {};

    useEffect(() => {
        if (stateFromRoute.employeeId && stateFromRoute.selectedMonth) {
            sessionStorage.setItem(
                "attendanceEmployeeContext",
                JSON.stringify({
                    employeeId: stateFromRoute.employeeId,
                    employeeName: stateFromRoute.employeeName,
                    department: stateFromRoute.department,
                    selectedMonth: stateFromRoute.selectedMonth,
                    monthName: stateFromRoute.monthName,
                })
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stateFromRoute.employeeId, stateFromRoute.selectedMonth]);

    const storedContext = useMemo(() => {
        if (stateFromRoute.employeeId) return stateFromRoute;
        try {
            const raw = sessionStorage.getItem("attendanceEmployeeContext");
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const {
        employeeId,
        employeeName,
        department,
        selectedMonth,
        monthName,
    } = storedContext;

    const employee = stateFromRoute.employee; // only trusted as an initial hint

    const auth = useSelector((state) => state.auth || {});
    const token = auth?.accessToken || auth?.token || "";

    const updateLoading = useSelector(
        (state) => state.attendance?.updateLoading || false
    );

    // Local copy of this employee's daily records, always refreshed from
    // the server (see loadEmployeeAttendance) rather than trusted purely
    // from route state or from optimistic local edits.
    const [dailyRecords, setDailyRecords] = useState(
        employee?.daily_records || []
    );
    const [recordsLoading, setRecordsLoading] = useState(false);

    // =========================================================
    // FETCH THIS EMPLOYEE'S ATTENDANCE FRESH FROM THE SERVER
    // =========================================================
    const loadEmployeeAttendance = async () => {
        if (!selectedMonth || !token || !employeeId) return;

        const [year, month] = selectedMonth.split("-");
        setRecordsLoading(true);

        try {
            const result = await dispatch(
                getAttendanceSummary({
                    year: Number(year),
                    month: Number(month),
                    page: 1,
                    token,
                })
            ).unwrap();

            const results = result?.results || [];
            const matched = results.find(
                (row) => row.employee_id === employeeId
            );

            if (matched) {
                setDailyRecords(matched.daily_records || []);
            }
        } catch (err) {
            console.error("Failed to refresh attendance for employee:", err);
        } finally {
            setRecordsLoading(false);
        }
    };

    useEffect(() => {
        loadEmployeeAttendance();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [employeeId, selectedMonth, token]);

    const [search, setSearch] = useState("");

    const rowsPerPage = 15;
    const [currentPage, setCurrentPage] = useState(1);

    // =========================================================
    // EDIT MODAL
    // =========================================================

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);

    const [editForm, setEditForm] = useState({
        attendanceType: "Paid",
        note: "",
    });

    const [saveError, setSaveError] = useState(null);

    // =========================================================
    // FILTER + PAGINATION
    // =========================================================

    const filteredRecords = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return dailyRecords;

        return dailyRecords.filter((record) => {
            return (
                (record.date || "").toLowerCase().includes(q) ||
                (record.status || "").toLowerCase().includes(q)
            );
        });
    }, [dailyRecords, search]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredRecords.length / rowsPerPage)
    );

    const paginatedRecords = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredRecords.slice(start, start + rowsPerPage);
    }, [filteredRecords, currentPage]);

    // =========================================================
    // OPEN / CLOSE EDIT MODAL
    // =========================================================

    const handleEdit = (record) => {
        setSelectedDay(record);
        setSaveError(null);

        setEditForm({
            attendanceType:
                record?.status === "absent" || !record?.status
                    ? "Unpaid"
                    : "Paid",
            note: record?.remark || "",
        });

        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setSelectedDay(null);
        setSaveError(null);

        setEditForm({
            attendanceType: "Paid",
            note: "",
        });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================================================
    // SAVE EDIT — calls the real update endpoint
    // =========================================================

    const handleSave = async () => {
        if (!selectedDay) return;

        setSaveError(null);

        // NOTE: your attendance update endpoint expects a numeric employee
        // FK id (e.g. { "employee": 4, ... }), but the attendance summary
        // response only exposes "employee_id" as an email/username string.
        // If your backend also returns a numeric id somewhere on `employee`,
        // point this at that field instead.
        const numericEmployeeId =
            employee?.id || employee?.employee?.id || employeeId;

        try {
            await dispatch(
                updateAttendanceRecord({
                    employee: numericEmployeeId,
                    date: selectedDay.date,
                    attendance_type: editForm.attendanceType.toLowerCase(),
                    remark: editForm.note,
                    token,
                })
            ).unwrap();

            // Re-fetch from the server so the table reflects what was
            // actually persisted, rather than trusting a local guess.
            await loadEmployeeAttendance();

            handleCloseModal();
        } catch (err) {
            console.error("Failed to update attendance:", err);
            setSaveError(
                err?.detail || "Failed to update attendance. Please try again."
            );
        }
    };

    // =========================================================
    // TABLE COLUMNS
    // =========================================================

    const columns = useMemo(
        () => [
            {
                header: "Date",
                accessor: "date",
                sortable: false,
                render: (row) => formatDisplayDate(row.date),
            },
            {
                header: "Status",
                accessor: "status",
                sortable: false,
                render: (row) => {
                    const status = row.status || "-";
                    const color =
                        status === "present"
                            ? "#16a34a"
                            : status === "absent"
                                ? "#dc2626"
                                : "#f59e0b";

                    return (
                        <span style={{ fontWeight: 600, color }}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                    );
                },
            },
            {
                header: "Punch In",
                accessor: "first_punch_in",
                sortable: false,
                render: (row) => row.first_punch_in || "-",
            },
            {
                header: "Punch Out",
                accessor: "last_punch_out",
                sortable: false,
                render: (row) => row.last_punch_out || "-",
            },
            {
                header: "Total Hours",
                accessor: "total_hours",
                sortable: false,
                render: (row) => row.total_hours ?? "0",
            },
            {
                header: "Attendance Type",
                accessor: "attendance_type",
                render: (row) => row.attendance_type || "-",
            },
            {
                header: "Note",
                accessor: "remark",
                render: (row) => row.remark || "-",
            },
            {
                header: "Action",
                accessor: "action",
                sortable: false,
                render: (row) => (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(row);
                        }}
                        style={{
                            padding: "7px 16px",
                            border: "none",
                            borderRadius: "6px",
                            background: "#1976d2",
                            color: "#fff",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: "500",
                        }}
                    >
                        Edit
                    </button>
                ),
            },
        ],
        []
    );

    return (
        <>
            <div style={{ padding: 20 }}>
                {/* HEADER */}
                <ReusableHeader
                    title={employeeName || "Employee Attendance"}
                    breadcrumbs={[
                        "Employees",
                        "Attendance Report",
                        employeeName || "Employee",
                    ]}
                    showBack
                    onBackClick={() => navigate(-1)}
                />

                {/* FILTER (search only — month/department are fixed by navigation) */}
                <ReusableFilter
                    search={search}
                    onSearch={setSearch}
                    searchPlaceholder="Search by date or status"
                    showSearch
                />

                {/* TABLE */}
                <ReusableTable
                    columns={columns}
                    data={paginatedRecords}
                    loading={recordsLoading}
                    emptyMessage="No attendance records found for this month."
                />

                {/* PAGINATION */}
                <ReusablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>

            {/* =====================================================
                EDIT ATTENDANCE MODAL
            ===================================================== */}

            {isEditModalOpen && (
                <ModalOverlay onClick={handleCloseModal}>
                    <AttendanceModal onClick={(e) => e.stopPropagation()}>
                        {/* ================= HEADER ================= */}

                        <ModalHeader>
                            <ModalHeaderContent>
                                <ModalTitle>Edit Attendance</ModalTitle>

                                <ModalSubtitle>
                                    {formatDisplayDate(selectedDay?.date)}
                                </ModalSubtitle>
                            </ModalHeaderContent>

                            <CloseButton
                                type="button"
                                onClick={handleCloseModal}
                            >
                                ×
                            </CloseButton>
                        </ModalHeader>

                        {/* ================= ATTENDANCE TYPE ================= */}

                        <FormGroup>
                            <FormLabel>Attendance Type</FormLabel>

                            <AttendanceTypeOptions>
                                {/* PAID */}
                                <AttendanceTypeOption>
                                    <AttendanceRadio
                                        type="radio"
                                        name="attendanceType"
                                        value="Paid"
                                        checked={
                                            editForm.attendanceType === "Paid"
                                        }
                                        onChange={handleFormChange}
                                    />

                                    <AttendanceTypeCard
                                        type="Paid"
                                        selected={
                                            editForm.attendanceType === "Paid"
                                        }
                                    >
                                        <RadioCircle
                                            type="Paid"
                                            selected={
                                                editForm.attendanceType ===
                                                "Paid"
                                            }
                                        />

                                        <AttendanceTypeContent>
                                            <AttendanceTypeTitle type="Paid">
                                                Paid
                                            </AttendanceTypeTitle>
                                        </AttendanceTypeContent>
                                    </AttendanceTypeCard>
                                </AttendanceTypeOption>

                                {/* UNPAID */}
                                <AttendanceTypeOption>
                                    <AttendanceRadio
                                        type="radio"
                                        name="attendanceType"
                                        value="Unpaid"
                                        checked={
                                            editForm.attendanceType ===
                                            "Unpaid"
                                        }
                                        onChange={handleFormChange}
                                    />

                                    <AttendanceTypeCard
                                        type="Unpaid"
                                        selected={
                                            editForm.attendanceType ===
                                            "Unpaid"
                                        }
                                    >
                                        <RadioCircle
                                            type="Unpaid"
                                            selected={
                                                editForm.attendanceType ===
                                                "Unpaid"
                                            }
                                        />

                                        <AttendanceTypeContent>
                                            <AttendanceTypeTitle type="Unpaid">
                                                Unpaid
                                            </AttendanceTypeTitle>
                                        </AttendanceTypeContent>
                                    </AttendanceTypeCard>
                                </AttendanceTypeOption>
                            </AttendanceTypeOptions>
                        </FormGroup>

                        {/* ================= NOTE / REASON ================= */}

                        <FormGroup>
                            <FormLabel>Note / Reason</FormLabel>

                            <NoteWrapper>
                                <NoteInput
                                    name="note"
                                    value={editForm.note}
                                    onChange={handleFormChange}
                                    placeholder="Enter note or reason..."
                                    rows={4}
                                    maxLength={500}
                                />
                            </NoteWrapper>
                        </FormGroup>

                        {/* ================= ATTENDANCE UPDATE PREVIEW ================= */}

                        <AttendanceUpdateBox>
                            <AttendanceUpdateTitle>
                                Attendance Update
                            </AttendanceUpdateTitle>

                            <UpdateItem>
                                <UpdateLabel>Attendance Type:</UpdateLabel>
                                <UpdateValue>
                                    {editForm.attendanceType}
                                </UpdateValue>
                            </UpdateItem>

                            <UpdateItem>
                                <UpdateLabel>Note:</UpdateLabel>
                                <UpdateValue>
                                    {editForm.note || "No note added"}
                                </UpdateValue>
                            </UpdateItem>
                        </AttendanceUpdateBox>

                        {saveError && (
                            <div
                                style={{
                                    color: "#dc2626",
                                    fontSize: "13px",
                                    marginTop: "10px",
                                }}
                            >
                                {saveError}
                            </div>
                        )}

                        {/* ================= FOOTER ================= */}

                        <ModalFooter>
                            <CancelButton
                                type="button"
                                onClick={handleCloseModal}
                            >
                                Cancel
                            </CancelButton>

                            <SaveButton
                                type="button"
                                onClick={handleSave}
                                disabled={updateLoading}
                            >
                                {updateLoading
                                    ? "Saving..."
                                    : "Save Changes"}
                            </SaveButton>
                        </ModalFooter>
                    </AttendanceModal>
                </ModalOverlay>
            )}
        </>
    );
};

export default AttendanceSummary;