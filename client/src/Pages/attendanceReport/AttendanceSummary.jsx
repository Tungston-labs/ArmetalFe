import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../Components/Pagination/ReusablePagination";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";

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

import {
    getAttendanceSummary,
} from "../../Redux/attendanceSlice";


const AttendanceSummary = () => {

    const dispatch = useDispatch();

    // =========================================================
    // REDUX
    // =========================================================

    const {
        attendanceSummary = [],
        summaryPagination = {},
        attendanceSummaryLoading = false,
    } = useSelector(
        (state) => state.attendance
    );


    // =========================================================
    // FILTER STATE
    // =========================================================

    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");
    const [month, setMonth] = useState("");

    const [currentPage, setCurrentPage] = useState(1);


    // =========================================================
    // MONTH
    // =========================================================

    const getCurrentMonth = () => {
        const now = new Date();

        return `${now.getFullYear()}-${String(
            now.getMonth() + 1
        ).padStart(2, "0")}`;
    };

    const selectedMonth = month || getCurrentMonth();

    const [selectedYear, selectedMonthNumber] =
        selectedMonth.split("-").map(Number);


    // =========================================================
    // EDIT MODAL
    // =========================================================

    const [isEditModalOpen, setIsEditModalOpen] =
        useState(false);

    const [selectedEmployee, setSelectedEmployee] =
        useState(null);

    const [selectedDailyRecord, setSelectedDailyRecord] =
        useState(null);

    const [editForm, setEditForm] = useState({
        attendanceType: "Paid",
        note: "",
        approvedBy: "",
    });


    // =========================================================
    // FETCH MONTHLY ATTENDANCE
    // =========================================================

    useEffect(() => {

        if (!selectedYear || !selectedMonthNumber) {
            return;
        }

        dispatch(
            getAttendanceSummary({
                year: selectedYear,
                month: selectedMonthNumber,
                page: currentPage,
            })
        );

    }, [
        dispatch,
        selectedYear,
        selectedMonthNumber,
        currentPage,
    ]);


    // =========================================================
    // RESET PAGE WHEN MONTH CHANGES
    // =========================================================

    useEffect(() => {
        setCurrentPage(1);
    }, [month]);


    // =========================================================
    // FILTER DATA
    // =========================================================

    const filteredData = useMemo(() => {

        let data = [...attendanceSummary];

        // -----------------------------------------------
        // SEARCH
        // -----------------------------------------------

        if (search.trim()) {

            const searchValue =
                search.toLowerCase().trim();

            data = data.filter((employee) =>
                employee.employee_name
                    ?.toLowerCase()
                    .includes(searchValue)
                ||
                employee.employee_id
                    ?.toLowerCase()
                    .includes(searchValue)
            );
        }


        // -----------------------------------------------
        // DEPARTMENT
        // -----------------------------------------------

        if (department) {

            data = data.filter(
                (employee) =>
                    employee.department === department
            );
        }


        // -----------------------------------------------
        // STATUS
        // -----------------------------------------------

        if (status) {

            data = data.filter((employee) => {

                const records =
                    employee.daily_records || [];

                return records.some(
                    (record) =>
                        record.status === status
                );
            });
        }

        return data;

    }, [
        attendanceSummary,
        search,
        department,
        status,
    ]);


    // =========================================================
    // TABLE DATA
    // =========================================================

    const tableData = useMemo(() => {

        return filteredData.map((employee) => {

            const records =
                employee.daily_records || [];

            return {
                ...employee,

                workingDays:
                    employee.working_days ?? 0,

                presentDays:
                    employee.present_days ?? 0,

                absentDays:
                    employee.absent_days ?? 0,

                lopDays:
                    employee.lop_days ?? 0,

                attendanceStatus:
                    employee.present_days > 0
                        ? "Present"
                        : "Absent",

                dailyRecords: records,
            };
        });

    }, [filteredData]);


    // =========================================================
    // TABLE COLUMNS
    // =========================================================

    const columns = useMemo(() => {

        return [

            {
                header: "Employee ID",
                accessor: "employee_id",
                sortable: true,
            },

            {
                header: "Employee Name",
                accessor: "employee_name",
                sortable: true,
            },

            {
                header: "Department",
                accessor: "department",
                sortable: true,
            },

            {
                header: "Working Days",
                accessor: "workingDays",
                sortable: true,
            },

            {
                header: "Present",
                accessor: "presentDays",
                sortable: true,
            },

            {
                header: "Absent",
                accessor: "absentDays",
                sortable: true,
            },

            {
                header: "LOP",
                accessor: "lopDays",
                sortable: true,
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
                        View
                    </button>
                ),
            },
        ];

    }, []);


    // =========================================================
    // OPEN EDIT / ATTENDANCE MODAL
    // =========================================================

    function handleEdit(employee) {

        setSelectedEmployee(employee);

        const records =
            employee.daily_records || [];

        // -----------------------------------------------
        // Find first available record
        // -----------------------------------------------

        const firstRecord =
            records.length > 0
                ? records[0]
                : null;

        setSelectedDailyRecord(firstRecord);

        setEditForm({

            attendanceType:
                firstRecord?.status === "Absent"
                    ? "Unpaid"
                    : "Paid",

            note:
                firstRecord?.note ||
                "",

            approvedBy:
                firstRecord?.approved_by ||
                "",
        });

        setIsEditModalOpen(true);
    }


    // =========================================================
    // CLOSE MODAL
    // =========================================================

    const handleCloseModal = () => {

        setIsEditModalOpen(false);

        setSelectedEmployee(null);

        setSelectedDailyRecord(null);

        setEditForm({
            attendanceType: "Paid",
            note: "",
            approvedBy: "",
        });
    };


    // =========================================================
    // FORM CHANGE
    // =========================================================

    const handleFormChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    // =========================================================
    // SAVE
    // =========================================================

    const handleSave = () => {

        console.log(
            "Selected Employee:",
            selectedEmployee
        );

        console.log(
            "Selected Daily Record:",
            selectedDailyRecord
        );

        console.log(
            "Updated Attendance:",
            editForm
        );

        /*
         * Later you can add your attendance correction/update API here.
         */

        handleCloseModal();
    };


    // =========================================================
    // DEPARTMENT OPTIONS
    // =========================================================

    const departmentOptions = useMemo(() => {

        const departments =
            attendanceSummary
                .map(
                    (employee) =>
                        employee.department
                )
                .filter(Boolean);

        return [
            ...new Set(departments),
        ];

    }, [attendanceSummary]);


    // =========================================================
    // PAGINATION
    // =========================================================

    const totalPages =
        summaryPagination.total_pages || 1;


    // =========================================================
    // MONTH LABEL
    // =========================================================

    const monthLabel = useMemo(() => {

        if (
            !selectedYear ||
            !selectedMonthNumber
        ) {
            return "";
        }

        const date = new Date(
            selectedYear,
            selectedMonthNumber - 1,
            1
        );

        return date.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric",
            }
        );

    }, [
        selectedYear,
        selectedMonthNumber,
    ]);


    // =========================================================
    // RENDER
    // =========================================================

    return (
        <>
            <div style={{ padding: 20 }}>

                {/* =================================================
                    HEADER
                ================================================== */}

                <ReusableHeader
                    title="Attendance Summary"
                    breadcrumbs={[
                        "Dashboard",
                        "Attendance Summary",
                    ]}
                />


                {/* =================================================
                    FILTER
                ================================================== */}

                <ReusableFilter

                    search={search}
                    onSearch={(value) => {
                        setSearch(value);
                        setCurrentPage(1);
                    }}

                    department={department}

                    departments={
                        departmentOptions
                    }

                    onDepartment={(value) => {
                        setDepartment(value);
                        setCurrentPage(1);
                    }}

                    status={status}

                    statuses={[
                        "Present",
                        "Absent",
                        "On Leave",
                    ]}

                    onStatus={(value) => {
                        setStatus(value);
                        setCurrentPage(1);
                    }}

                    date={month}

                    onDate={(value) => {
                        setMonth(value);
                        setCurrentPage(1);
                    }}

                    showSearch
                    showDepartment
                    showStatus
                    showDate
                />


                {/* =================================================
                    MONTH INFO
                ================================================== */}

                <div
                    style={{
                        marginBottom: 15,
                        fontSize: 14,
                        fontWeight: 600,
                    }}
                >
                    Attendance Summary — {monthLabel}
                </div>


                {/* =================================================
                    TABLE
                ================================================== */}

                <ReusableTable
                    columns={columns}
                    data={tableData}
                    loading={
                        attendanceSummaryLoading
                    }
                />


                {/* =================================================
                    PAGINATION
                ================================================== */}

                <ReusablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={
                        setCurrentPage
                    }
                />

            </div>


            {/* =====================================================
                EDIT ATTENDANCE MODAL
            ====================================================== */}

            {isEditModalOpen && (

                <ModalOverlay
                    onClick={handleCloseModal}
                >

                    <AttendanceModal
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* ================= HEADER ================= */}

                        <ModalHeader>

                            <ModalHeaderContent>

                                <ModalTitle>
                                    Edit Attendance
                                </ModalTitle>

                                <ModalSubtitle>

                                    {selectedEmployee?.employee_name}

                                    {" • "}

                                    {selectedDailyRecord?.date ||
                                        "No date"}

                                </ModalSubtitle>

                            </ModalHeaderContent>


                            <CloseButton
                                type="button"
                                onClick={
                                    handleCloseModal
                                }
                            >
                                ×
                            </CloseButton>

                        </ModalHeader>


                        {/* ================= ATTENDANCE TYPE ================= */}

                        <FormGroup>

                            <FormLabel>
                                Attendance Type
                            </FormLabel>


                            <AttendanceTypeOptions>

                                {/* PAID */}

                                <AttendanceTypeOption>

                                    <AttendanceRadio
                                        type="radio"
                                        name="attendanceType"
                                        value="Paid"
                                        checked={
                                            editForm.attendanceType ===
                                            "Paid"
                                        }
                                        onChange={
                                            handleFormChange
                                        }
                                    />


                                    <AttendanceTypeCard
                                        type="Paid"
                                        selected={
                                            editForm.attendanceType ===
                                            "Paid"
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
                                        onChange={
                                            handleFormChange
                                        }
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


                        {/* ================= NOTE ================= */}

                        <FormGroup>

                            <FormLabel>
                                Note / Reason
                            </FormLabel>

                            <NoteWrapper>

                                <NoteInput
                                    name="note"
                                    value={
                                        editForm.note
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    placeholder="Enter note or reason..."
                                    rows={4}
                                    maxLength={500}
                                />

                            </NoteWrapper>

                        </FormGroup>


                        {/* ================= ATTENDANCE UPDATE ================= */}

                        <AttendanceUpdateBox>

                            <AttendanceUpdateTitle>
                                Attendance Update
                            </AttendanceUpdateTitle>


                            <UpdateItem>

                                <UpdateLabel>
                                    Employee:
                                </UpdateLabel>

                                <UpdateValue>
                                    {
                                        selectedEmployee?.employee_name ||
                                        "-"
                                    }
                                </UpdateValue>

                            </UpdateItem>


                            <UpdateItem>

                                <UpdateLabel>
                                    Date:
                                </UpdateLabel>

                                <UpdateValue>
                                    {
                                        selectedDailyRecord?.date ||
                                        "-"
                                    }
                                </UpdateValue>

                            </UpdateItem>


                            <UpdateItem>

                                <UpdateLabel>
                                    Updated by:
                                </UpdateLabel>

                                <UpdateValue>
                                    HR Admin
                                </UpdateValue>

                            </UpdateItem>


                            <UpdateItem>

                                <UpdateLabel>
                                    Attendance Type:
                                </UpdateLabel>

                                <UpdateValue>
                                    {
                                        editForm.attendanceType
                                    }
                                </UpdateValue>

                            </UpdateItem>


                            <UpdateItem>

                                <UpdateLabel>
                                    Note:
                                </UpdateLabel>

                                <UpdateValue>
                                    {
                                        editForm.note ||
                                        "No note added"
                                    }
                                </UpdateValue>

                            </UpdateItem>

                        </AttendanceUpdateBox>


                        {/* ================= FOOTER ================= */}

                        <ModalFooter>

                            <CancelButton
                                type="button"
                                onClick={
                                    handleCloseModal
                                }
                            >
                                Cancel
                            </CancelButton>


                            <SaveButton
                                type="button"
                                onClick={
                                    handleSave
                                }
                            >
                                Save Changes
                            </SaveButton>

                        </ModalFooter>

                    </AttendanceModal>

                </ModalOverlay>
            )}

        </>
    );
};

export default AttendanceSummary;