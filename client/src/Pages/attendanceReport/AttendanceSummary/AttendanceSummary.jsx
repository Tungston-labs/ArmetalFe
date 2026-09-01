import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import ReusableTable from "../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../Components/Pagination/ReusablePagination";
import ReusableFilter from "../../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../../Components/ReusableTable/ReusableHeader";

import {
    updateAttendanceRecord,
    getAttendanceSummary,
    generateEmployeeAttendanceExcelReport,
} from "../../../Redux/attendanceSlice";

import { getAttendanceColumns, getAttendanceStatsCards } from "./AttendanceSummary.columns";
import EditAttendanceModal from "./EditAttendanceModal";
import StatsCards from "../../../Components/StatsCards/StatsCards";
import Swal from "sweetalert2";

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

    const { employeeId, employeeName, department, selectedMonth, monthName } =
        storedContext;

    const employee = stateFromRoute.employee; // only trusted as an initial hint

    const auth = useSelector((state) => state.auth || {});
    const token = auth?.accessToken || auth?.token || "";

    const updateLoading = useSelector(
        (state) => state.attendance?.updateLoading || false
    );

    const excelLoading = useSelector(
        (state) => state.attendance?.employeeAttendanceExcelLoading || false
    );

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
            const matched = results.find((row) => row.employee_id === employeeId);

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
    // EDIT MODAL STATE
    // =========================================================
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [editForm, setEditForm] = useState({ attendanceType: "Paid", note: "" });
    const [saveError, setSaveError] = useState(null);

    // =========================================================
    // DOWNLOAD EXCEL — SINGLE EMPLOYEE (backend API call)
    // =========================================================
    const handleDownloadExcel = async () => {
        if (excelLoading || !selectedMonth || !token) return;

        const numericEmployeeId =
            employee?.id || employee?.employee?.id || employeeId;

        if (!numericEmployeeId) return;

        const [year, month] = selectedMonth.split("-");

        try {
            const blob = await dispatch(
                generateEmployeeAttendanceExcelReport({
                    employee: numericEmployeeId,
                    year: Number(year),
                    month: Number(month),
                    token,
                })
            ).unwrap();

            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `Attendance_${employeeName || employeeId}_${selectedMonth}.xlsx`
            );
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Excel generation failed:", error);

            Swal.fire({
                icon: "warning",
                title: "Cannot Generate Report",
                text:
                    error?.detail ||
                    "Failed to generate attendance report.",
                confirmButtonText: "OK",
            });
        }
    };

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

    const totalPages = Math.max(1, Math.ceil(filteredRecords.length / rowsPerPage));

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

        // Pre-select Paid/Unpaid based on the record's actual saved status.
        // Records can hold "paid"/"unpaid" directly once they've been
        // edited before, or the original computed statuses like
        // "absent"/"present"/"onam" if they've never been touched.
        const status = (record?.status || "").toLowerCase();

        let attendanceType;
        if (status === "paid") {
            attendanceType = "Paid";
        } else if (status === "unpaid" || status === "absent" || !status) {
            attendanceType = "Unpaid";
        } else {
            attendanceType = "Paid";
        }

        setEditForm({
            attendanceType,
            note: record?.remark || "",
        });

        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setSelectedDay(null);
        setSaveError(null);
        setEditForm({ attendanceType: "Paid", note: "" });
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    // =========================================================
    // SAVE EDIT — calls the real update endpoint
    // =========================================================
    const handleSave = async () => {
        if (!selectedDay) return;

        setSaveError(null);

        const numericEmployeeId =
            employee?.id || employee?.employee?.id || employeeId;

        try {
            const result = await dispatch(
                updateAttendanceRecord({
                    employee: numericEmployeeId,
                    date: selectedDay.date,
                    attendance_type: editForm.attendanceType.toLowerCase(),
                    remark: editForm.note,
                    token,
                })
            ).unwrap();

            // IMPORTANT: the summary endpoint's `status` is computed
            // independently on the backend and does not reflect this
            // override (its rows have no `remark` field at all), so a
            // refetch alone would leave the local record's status/remark
            // stale — meaning reopening the modal for this day would keep
            // showing the wrong Paid/Unpaid selection. Apply what the
            // update endpoint itself confirmed was saved directly onto
            // the matching day first.
            const savedData = result?.data || result;

            setDailyRecords((prev) =>
                prev.map((record) =>
                    record.date === selectedDay.date
                        ? {
                              ...record,
                              status:
                                  savedData?.attendance_type ||
                                  editForm.attendanceType.toLowerCase(),
                              remark: savedData?.remark ?? editForm.note,
                          }
                        : record
                )
            );

            handleCloseModal();
        } catch (err) {
            console.error("Failed to update attendance:", err);
            setSaveError(
                err?.detail || "Failed to update attendance. Please try again."
            );
        }
    };

    const columns = useMemo(() => getAttendanceColumns(handleEdit), []);
    const statsCards = useMemo(
        () => getAttendanceStatsCards(dailyRecords),
        [dailyRecords]
    );

    return (
        <>
            <div style={{ padding: 20 }}>
                <ReusableHeader
                    title={employeeName || "Employee Attendance"}
                    breadcrumbs={[
                        "Employees",
                        "Attendance Report",
                        employeeName || "Employee",
                    ]}
                    showBack
                    onBackClick={() => navigate(-1)}
                    buttonText={
                        excelLoading
                            ? "Generating Excel..."
                            : "📊 Download Excel"
                    }
                    onButtonClick={handleDownloadExcel}
                />
                <StatsCards cards={statsCards} />
                <ReusableFilter
                    search={search}
                    onSearch={setSearch}
                    searchPlaceholder="Search by date or status"
                    showSearch
                />

                <ReusableTable
                    columns={columns}
                    data={paginatedRecords}
                    loading={recordsLoading}
                    emptyMessage="No attendance records found for this month."
                />

                <ReusablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>

            {isEditModalOpen && (
                <EditAttendanceModal
                    selectedDay={selectedDay}
                    editForm={editForm}
                    saveError={saveError}
                    updateLoading={updateLoading}
                    onFormChange={handleFormChange}
                    onSave={handleSave}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};

export default AttendanceSummary;