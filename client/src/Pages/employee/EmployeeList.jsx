import React, { useEffect, useState } from "react";
import {
    Container,
    TruncatedText,
    TableWrapper,
} from "../leaveDetails/EmployeeList.styles";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllEmployees, deleteEmployeeById } from "../../Redux/employeeSlice";
import { getDepartments } from "../../Redux/departmentSlice";
import Loader from "../../Components/Loader/Loader";
import RightSideModal from "../employeDashboard/RightSideModal";
import NoEmployeeFound from "../../Components/No found/Noemployeefound";
import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";
import { Status } from "../../Components/ReusableTable/ReusableTable.styles";
import ReusableConfirmModal from "../../Components/modals/ReusableConfirmModal";

const EmployeeList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [searchText, setSearchText] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page] = useState(1);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");
    const [month, setMonth] = useState("");
    const { employeeList, loading } = useSelector((state) => state.employees);

    useEffect(() => {
        dispatch(getDepartments({ page: 1, search: "" }));
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAllEmployees({ page, search: "", department_id: departmentFilter }));
    }, [dispatch, page, departmentFilter]);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(searchText), 300);
        return () => clearTimeout(handler);
    }, [searchText]);

    const handleDeleteClick = (id) => {
        setSelectedEmployeeId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        await dispatch(deleteEmployeeById(selectedEmployeeId));
        dispatch(getAllEmployees({ page, search: "", department_id: departmentFilter }));
        setShowDeleteModal(false);
        setSelectedEmployeeId(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedEmployeeId(null);
    };

    const filteredEmployees = Array.isArray(employeeList)
        ? employeeList.filter(
            (emp) =>
                emp.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                emp.employee_id?.toString().toLowerCase().includes(debouncedSearch.toLowerCase()),
        )
        : [];

    const columns = [
        {
            header: "Sl No",
            accessor: "slno",
            sortable: false,
            render: (_row, index) => index + 1 + (page - 1) * 20,
        },
        {
            header: "Employee name",
            accessor: "name",
            render: (row) => (
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontWeight: 600 }}>
                        {row.name ? row.name.charAt(0).toUpperCase() + row.name.slice(1) : ""}
                    </span>
                    <span style={{ fontSize: 12, color: "#888" }}>{row.email}</span>
                </div>
            ),
        },
        { header: "Username", accessor: "employee_id" },
        { header: "Employee ID", accessor: "employee_code" },
        {
            header: "Job Position",
            accessor: "designation",
            render: (row) => (
                <TruncatedText title={row.designation?.toUpperCase()}>
                    {row.designation?.toUpperCase()}
                </TruncatedText>
            ),
        },
        {
            header: "Department",
            accessor: "department",
            render: (row) => <TruncatedText title={row.department}>{row.department}</TruncatedText>,
        },
        {
            header: "Status",
            accessor: "status",
            sortable: false,
            render: (row) => (
                <Status $status={row.status}>
                    {row.status || "N/A"}
                </Status>
            ),
        },
        {
            header: "Action",
            accessor: "action",
            sortable: false,
            render: (row) => (
                <div style={{ display: "flex", gap: 12 }}>
                    <FaEdit
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit-employee/${row.id}`);
                        }}
                    />
                    <FaTrash
                        color="red"
                        style={{ cursor: "pointer" }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(row.id);
                        }}
                    />
                </div>
            ),
        },
    ];

    return (
        <>
            {loading && (
                <Loader />
            )}

            <Container>
                <ReusableHeader
                    title="Employees"
                    breadcrumbs={["Dashboard", "Employees"]}
                    buttonText="ADD NEW EMPLOYEE"
                    onButtonClick={() => console.log("Add Employee")}
                />
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
                    onDepartment={setDepartment}

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
                {!loading && (
                    <TableWrapper>
                        {filteredEmployees.length > 0 ? (
                            <ReusableTable
                                columns={columns}
                                data={filteredEmployees}
                                loading={loading}
                                onRowClick={(row) => {
                                    setSelectedEmployee(row);
                                    setOpenModal(true);
                                }}
                            />
                        ) : (
                            <NoEmployeeFound searchTerm={debouncedSearch} />
                        )}
                    </TableWrapper>
                )}

                <ReusableConfirmModal
                    show={showDeleteModal}
                    onClose={cancelDelete}
                    onConfirm={confirmDelete}
                    message="Are you sure you want to permanently delete this employee from the system?"
                    confirmText="Delete"
                    cancelText="Cancel"
                    confirmVariant="danger"
                    cancelVariant="cancel"
                    loadingText="Deleting..."
                />

                {openModal && (
                    <RightSideModal
                        isOpen={openModal}
                        onClose={() => setOpenModal(false)}
                        employeeId={selectedEmployee?.id}
                    />
                )}
            </Container>
        </>
    );
};

export default EmployeeList;