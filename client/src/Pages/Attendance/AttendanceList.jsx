import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getAttendanceList } from "../../Redux/attendanceSlice";
import { getDepartmentsMin } from "../../Redux/departmentSlice";

import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../Components/Pagination/ReusablePagination";
import { attendanceColumns } from "./Attendancedata";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";

const AttendanceList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");
    const [date, setDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // --------------------------------------------------
    // Attendance Redux
    // --------------------------------------------------
    const {
        attendanceList,
        pagination,
        listLoading,
        error,
    } = useSelector((state) => state.attendance);

    // --------------------------------------------------
    // Department Redux
    // --------------------------------------------------
    const {
        minList: departments,
        loading: departmentLoading,
    } = useSelector((state) => state.departments);

    // --------------------------------------------------
    // Get Departments
    // --------------------------------------------------
    useEffect(() => {
        dispatch(getDepartmentsMin());
    }, [dispatch]);

    // --------------------------------------------------
    // Get Attendance
    // --------------------------------------------------
    useEffect(() => {
        const params = {
            page: currentPage,
        };

        if (department) {
            params.department_id = department;
        }

        if (date) {
            params.date = date;
        }

        dispatch(getAttendanceList(params));
    }, [dispatch, currentPage, department, date]);
    // --------------------------------------------------
    // Reset page when filters change
    // --------------------------------------------------
    useEffect(() => {
        setCurrentPage(1);
    }, [department, date]);

    const pageSize = 10;

    // --------------------------------------------------
    // Map Attendance Data
    // --------------------------------------------------
    const mappedRows = (attendanceList || []).map((item, index) => ({
        slNo: (currentPage - 1) * pageSize + index + 1,
        id: item.employee,
        name: item.employee_name,
        employeeId: item.employee_id,
        profilePic: item.profile_pic,
        date: item.date,
        firstSwipeIn: item.first_swipe_in || "--",
        lastSwipeOut: item.last_swipe_out || "--",
        totalHours: item.total_hours_formatted,
        attendanceToday: item.attendance_today,
        attendanceId: item.attendance_id,
    }));

    // --------------------------------------------------
    // Client-side Search
    // --------------------------------------------------
    const visibleRows = search
        ? mappedRows.filter(
            (row) =>
                row.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                row.employeeId
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
        )
        : mappedRows;

    // --------------------------------------------------
    // Row Click
    // --------------------------------------------------
    const handleRowClick = (employee) => {
        navigate(`/employee-attendance-tracking/${employee.id}`);
    };

    // --------------------------------------------------
    // Convert Department API Data
    // --------------------------------------------------
    const departmentOptions = (departments || []).map((item) => ({
        label: item.name,
        value: item.id,
    }));

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Attendance"
                breadcrumbs={["Attendance"]}
            />

            <ReusableFilter
                search={search}
                onSearch={setSearch}

                department={department}
                departments={departmentOptions}
                onDepartment={setDepartment}

                status={status}
                statuses={["Present", "Absent", "On Leave"]}
                onStatus={setStatus}

                date={date}
                onDate={setDate}
                dateType="date"

                showSearch
                showDepartment
                showStatus
                showDate
            />

            {listLoading && (
                <p>Loading attendance...</p>
            )}

            {error && (
                <p style={{ color: "red" }}>
                    {String(error)}
                </p>
            )}

            {!listLoading && !error && (
                <>
                    <ReusableTable
                        columns={attendanceColumns}
                        data={visibleRows}
                        onRowClick={handleRowClick}
                    />

                    <ReusablePagination
                        currentPage={
                            pagination?.current_page ||
                            currentPage
                        }
                        totalPages={
                            pagination?.total_pages || 1
                        }
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
};

export default AttendanceList;