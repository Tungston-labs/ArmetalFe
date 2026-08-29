import React, { useMemo, useState } from "react";
import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../Components/Pagination/ReusablePagination";
import {
    employeeColumns,
    employeeData,
} from "../../Components/ReusableTable/dummydata";
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
    OptionalText,
    AttendanceTypeOptions,
    AttendanceTypeOption,
    AttendanceRadio,
    AttendanceTypeCard,
    RadioCircle,
    AttendanceTypeContent,
    AttendanceTypeTitle,
    AttendanceTypeDescription,
    NoteWrapper,
    NoteInput,
    NoteCounter,
    ApprovedInput,
    ModalFooter,
    CancelButton,
    SaveButton,
} from "./AttendanceSummary.styles";
const AttendanceSummary = () => {
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");
    const [month, setMonth] = useState("");

    const rowsPerPage = 10;

    const [currentPage, setCurrentPage] = useState(1);

    // =========================================================
    // EDIT MODAL
    // =========================================================

    const [isEditModalOpen, setIsEditModalOpen] =
        useState(false);

    const [selectedEmployee, setSelectedEmployee] =
        useState(null);

    const [editForm, setEditForm] = useState({
        attendanceType: "Paid",
        note: "",
        approvedBy: "",
    });

    // =========================================================
    // PAGINATION
    // =========================================================

    const totalPages = Math.ceil(
        employeeData.length / rowsPerPage
    );

    const paginatedData = useMemo(() => {
        const start =
            (currentPage - 1) * rowsPerPage;

        return employeeData.slice(
            start,
            start + rowsPerPage
        );
    }, [currentPage]);

    // =========================================================
    // OPEN EDIT MODAL
    // =========================================================

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);

        setEditForm({
            attendanceType:
                employee?.attendanceType ||
                employee?.attendance_type ||
                "Paid",

            note:
                employee?.note ||
                employee?.remark ||
                "",

            approvedBy:
                employee?.approvedBy ||
                employee?.approved_by ||
                "",
        });

        setIsEditModalOpen(true);
    };

    // =========================================================
    // CLOSE EDIT MODAL
    // =========================================================

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setSelectedEmployee(null);

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
        const { name, value } = e.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================================================
    // SAVE EDIT
    // =========================================================

    const handleSave = () => {
        console.log(
            "Selected Employee:",
            selectedEmployee
        );

        console.log(
            "Updated Attendance:",
            editForm
        );

        /*
         * API call can be added here.
         *
         * Example:
         *
         * dispatch(
         *     updateAttendance({
         *         employeeId: selectedEmployee.employee_id,
         *         attendanceType: editForm.attendanceType,
         *         note: editForm.note,
         *         approvedBy: editForm.approvedBy,
         *     })
         * );
         */

        handleCloseModal();
    };

    // =========================================================
    // TABLE COLUMNS
    // =========================================================

    const columns = useMemo(() => {
        return [
            ...employeeColumns,

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
        ];
    }, []);

    return (
        <>
            {/* =====================================================
                PAGE
            ====================================================== */}

            <div style={{ padding: 20 }}>

                {/* HEADER */}
                <ReusableHeader
                    title="Employees"
                    breadcrumbs={[
                        "Dashboard",
                        "Employees",
                    ]}
                    buttonText="ADD NEW EMPLOYEE"
                    onButtonClick={() =>
                        console.log(
                            "Add Employee"
                        )
                    }
                />

                {/* FILTER */}
                <ReusableFilter
                    search={search}
                    onSearch={setSearch}

                    department={department}
                    departments={[
                        "HR",
                        "Finance",
                        "Development",
                        "Marketing",
                    ]}
                    onDepartment={
                        setDepartment
                    }

                    status={status}
                    statuses={[
                        "Present",
                        "Absent",
                        "On Leave",
                    ]}
                    onStatus={setStatus}

                    date={month}
                    onDate={setMonth}

                    showSearch
                    showDepartment
                    showStatus
                    showDate
                />

                {/* TABLE */}
                <ReusableTable
                    columns={columns}
                    data={paginatedData}
                />

                {/* PAGINATION */}
                <ReusablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={
                        setCurrentPage
                    }
                />
            </div>

            {/* =====================================================
                EDIT MODAL
            ====================================================== */}

          {/* =====================================================
    EDIT ATTENDANCE MODAL
===================================================== */}

{isEditModalOpen && (
    <ModalOverlay onClick={handleCloseModal}>
        <AttendanceModal
            onClick={(e) => e.stopPropagation()}
        >
            {/* ================= HEADER ================= */}

            <ModalHeader>
                <ModalHeaderContent>
                    <ModalTitle>
                        Edit Attendance
                    </ModalTitle>

                    {selectedEmployee && (
                        <ModalSubtitle>
                            Update attendance details for{" "}
                            <strong>
                                {selectedEmployee.employee_name}
                            </strong>
                        </ModalSubtitle>
                    )}
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
                                    editForm.attendanceType === "Paid"
                                }
                            />

                            <AttendanceTypeContent>
                                <AttendanceTypeTitle type="Paid">
                                    Paid
                                </AttendanceTypeTitle>

                                <AttendanceTypeDescription>
                                    Paid attendance
                                </AttendanceTypeDescription>
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
                                editForm.attendanceType === "Unpaid"
                            }
                            onChange={handleFormChange}
                        />

                        <AttendanceTypeCard
                            type="Unpaid"
                            selected={
                                editForm.attendanceType === "Unpaid"
                            }
                        >
                            <RadioCircle
                                type="Unpaid"
                                selected={
                                    editForm.attendanceType === "Unpaid"
                                }
                            />

                            <AttendanceTypeContent>
                                <AttendanceTypeTitle type="Unpaid">
                                    Unpaid
                                </AttendanceTypeTitle>

                                <AttendanceTypeDescription>
                                    Unpaid attendance
                                </AttendanceTypeDescription>
                            </AttendanceTypeContent>
                        </AttendanceTypeCard>
                    </AttendanceTypeOption>

                </AttendanceTypeOptions>
            </FormGroup>

            {/* ================= NOTE ================= */}

            <FormGroup>
                <FormLabel>
                    Note
                    <OptionalText>
                        (Optional)
                    </OptionalText>
                </FormLabel>

                <NoteWrapper>
                    <NoteInput
                        name="note"
                        value={editForm.note}
                        onChange={handleFormChange}
                        placeholder="Add a note about this attendance..."
                        rows={5}
                        maxLength={500}
                    />

                    <NoteCounter>
                        {editForm.note?.length || 0}/500
                    </NoteCounter>
                </NoteWrapper>
            </FormGroup>

            {/* ================= APPROVED BY ================= */}

            <FormGroup>
                <FormLabel>
                    Approved By
                </FormLabel>

                <ApprovedInput
                    type="text"
                    name="approvedBy"
                    value={editForm.approvedBy}
                    onChange={handleFormChange}
                    placeholder="Enter approver name"
                />
            </FormGroup>

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