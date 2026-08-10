import React, { useEffect, useMemo, useState } from "react";
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
import RightSideModal from "../employeDashboard/RightSideModal";
import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";
import { Status } from "../../Components/ReusableTable/ReusableTable.styles";
import ReusableConfirmModal from "../../Components/modals/ReusableConfirmModal";
import ReusablePagination from "../../Components/Pagination/ReusablePagination";

const EmployeeList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const paginationLimit = 20;
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [search, setSearch] = useState("");

    // Single source of truth for the selected department — stores the
    // department NAME (what the dropdown displays/selects).
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");
    const [month, setMonth] = useState("");

    const { employeeList, loading,pagination } = useSelector((state) => state.employees);
    const { list: departmentList } = useSelector(
        (state) => state.departments
    );

    useEffect(() => {
        dispatch(getDepartments({ page: 1, search: "" }));
    }, [dispatch]);
    const departmentRows = Array.isArray(departmentList?.results)
        ? departmentList.results
        : Array.isArray(departmentList)
            ? departmentList
            : [];
    const departmentOptions = useMemo(
        () => departmentRows.map((d) => d.name),
        [departmentRows],
    );

    const departmentIdByName = useMemo(
        () => Object.fromEntries(departmentRows.map((d) => [d.name, d.id])),
        [departmentRows],
    );
    const selectedDepartmentId = department ? departmentIdByName[department] : "";

    useEffect(() => {
        dispatch(
            getAllEmployees({ page,limit: paginationLimit,search: "", department_id: selectedDepartmentId }),
        );
    }, [dispatch, page, selectedDepartmentId]);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(handler);
    }, [search]);

    const handleDeleteClick = (id) => {
        setSelectedEmployeeId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        await dispatch(deleteEmployeeById(selectedEmployeeId));
        dispatch(
            getAllEmployees({ page, search: "", department_id: selectedDepartmentId }),
        );
        setShowDeleteModal(false);
        setSelectedEmployeeId(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setSelectedEmployeeId(null);
    };

   const filteredEmployees = Array.isArray(employeeList)
    ? employeeList.filter((emp) => {
        const searchValue = debouncedSearch.toLowerCase().trim();

        return (
            emp.name?.toLowerCase().includes(searchValue) ||
            emp.employee_id
                ?.toString()
                .toLowerCase()
                .includes(searchValue)
        );
    })
    : [];

    const columns = [
        {
            header: "Sl No",
            accessor: "slno",
            sortable: false,
           render: (_row, index) =>
    index + 1 + (page - 1) * paginationLimit,
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
                            navigate(`/ViewBasic/${row.id}`);
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
            <Container>
                <ReusableHeader
                    title="Employees"
                    breadcrumbs={["Dashboard", "Employees"]}
                    buttonText="+ ADD NEW EMPLOYEE"
                    onButtonClick={() => navigate("/basic-details")}
                />
                <ReusableFilter
                    search={search}
                    onSearch={setSearch}
                    searchPlaceholder="Search by Employee name or ID"
                    department={department}
                    departments={departmentOptions}
                    onDepartment={setDepartment}

                    status={status}
                    statuses={[
                        "Present",
                        "Absent",
                        "On Leave",
                    ]}
                    onStatus={setStatus}                   
                    showSearch
                    showDepartment
                    showStatus
                />
                {!loading && (
                    <TableWrapper>
                            <ReusableTable
                                columns={columns}
                                data={filteredEmployees}
                                loading={loading}
                                onRowClick={(row) => {
                                    setSelectedEmployee(row);
                                    setOpenModal(true);
                                }}
                            />
                    </TableWrapper>
                )}
{!loading &&
          pagination?.total_pages > 1 && (
            <ReusablePagination
              currentPage={
                pagination?.current_page || page
              }
              totalPages={
                pagination?.total_pages || 1
              }
              onPageChange={setPage}
            />
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