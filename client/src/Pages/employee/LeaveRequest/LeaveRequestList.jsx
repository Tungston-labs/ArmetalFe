import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getLeaveRequests,
  patchLeaveStatus,
    getLeaveCounts,
} from "../../../Redux/leaveSlice";
import { useNavigate } from "react-router-dom";
import { getDepartments } from "../../../Redux/departmentSlice";

import { Container } from "./leaveColumns.style";
import ReusableTable from "../../../Components/ReusableTable/ReusableTable";
import NoEmployeeFound from "../../../Components/No found/Noemployeefound";
import ReusableHeader from "../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../Components/ReusableTable/ReusableFilter";
import ReusableConfirmModal from "../../../Components/modals/ReusableConfirmModal";
import { getLeaveColumns, getPayrollCards } from "./leaveColumns";
import StatsCards from "../../../Components/StatsCards/StatsCards";

export default function LeaveRequestList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

const {
  leaves,
  loading,
  pagination,
  leaveCounts,
} = useSelector((state) => state.leave);

  // =========================
  // Search
  // =========================
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // =========================
  // Pagination
  // =========================
  const [page, setPage] = useState(1);

  // =========================
  // Filters
  // =========================
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  );

  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

  // =========================
  // Delete / Status Modal
  // =========================
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);

  // =========================
  // Departments
  // =========================
const { list: departmentList } = useSelector(
  (state) => state.departments
);

const departmentOptions = useMemo(
  () =>
    Array.isArray(departmentList)
      ? departmentList.map((department) => department.name)
      : [],
  [departmentList]
);

const departmentIdByName = useMemo(
  () =>
    Object.fromEntries(
      (departmentList || []).map((department) => [
        department.name,
        department.id,
      ])
    ),
  [departmentList]
);

const selectedDepartmentId = departmentFilter
  ? departmentIdByName[departmentFilter]
  : "";

  // =========================
  // Get Departments
  // =========================
  useEffect(() => {
    dispatch(getDepartments({ page: 1, search: "" }));
  }, [dispatch]);
useEffect(() => {
  dispatch(getLeaveCounts());
}, [dispatch]);
  // =========================
  // Search debounce
  // =========================
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  // =========================
  // Get Leave Requests
  // =========================
 useEffect(() => {
  dispatch(
    getLeaveRequests({
      page,
      department_id: selectedDepartmentId || undefined,
      status: statusFilter
        ? statusFilter.toLowerCase()
        : undefined,
      month: selectedMonth,
      year: selectedYear,
    })
  );
}, [
  dispatch,
  page,
  selectedDepartmentId,
  statusFilter,
  selectedMonth,
  selectedYear,
]);

  const leaveData = Array.isArray(leaves) ? leaves : [];

  // =========================
  // Frontend Search
  // =========================
  const filteredLeaves = leaveData.filter((leave) => {
    const searchValue = debouncedSearch.toLowerCase().trim();

    const name =
      leave?.employee?.name?.toLowerCase() || "";

    const empId =
      leave?.employee?.employee_id
        ?.toString()
        .toLowerCase() || "";

    return (
      name.includes(searchValue) ||
      empId.includes(searchValue)
    );
  });

  // =========================
  // Date
  // =========================
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";

    const d = new Date(dateStr);

    const day = d.getDate().toString().padStart(2, "0");

    const month = d.toLocaleString("en-GB", {
      month: "short",
    });

    return `${day}/${month}`;
  };
 //paste_date condition
  // const isPastLeave = (leave) =>
  //   new Date(leave.to_date) <
  //   new Date().setHours(0, 0, 0, 0);


  const openApproveModal = (id) => {
    setSelectedLeaveId(id);
    setActionType("approve");
    setShowModal(true);
  };

  // =========================
  // Reject
  // =========================
  const openRejectModal = (id) => {
    setSelectedLeaveId(id);
    setActionType("reject");
    setShowModal(true);
  };

  // =========================
  // Update Status
  // =========================
  const handleStatusUpdate = async () => {
    if (!selectedLeaveId || !actionType) return;

    const status =
      actionType === "approve"
        ? "approved"
        : "rejected";

    try {
      await dispatch(
        patchLeaveStatus({
          leaveId: selectedLeaveId,
          status,
        })
      );

      dispatch(
        getLeaveRequests({
          page,
          department_id:
            departmentFilter || undefined,
          status:
            statusFilter || undefined,
          month: selectedMonth,
          year: selectedYear,
          search:
            debouncedSearch || undefined,
        })
      );
    } finally {
      setShowModal(false);
      setActionType("");
      setSelectedLeaveId(null);
    }
  };

  // =========================
  // Columns
  // =========================
  const columns = getLeaveColumns({
    page,
    formatDate,
    // isPastLeave,
    openApproveModal,
    openRejectModal,
  });

  const payrollCards = getPayrollCards();

  return (
    <Container>
      <ReusableHeader
        title="Leave Requests"
        breadcrumbs={[
          "Employees",
          "LeaveRequest",
        ]}
      />

      <StatsCards cards={payrollCards} />

      <ReusableFilter
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search by Employee name or ID"

        department={departmentFilter}
        departments={departmentOptions}
        onDepartment={setDepartmentFilter}

        status={statusFilter}
        statuses={[
          "Pending",
          "Approved",
          "Rejected",
        ]}
        onStatus={setStatusFilter}

        date={selectedMonth}
        onDate={setSelectedMonth}

        showSearch
        showDepartment
        showStatus
        showDate
      />

      <ReusableTable
        columns={columns}
        data={filteredLeaves}
        loading={loading}
        loadingComponent={null}
        emptyComponent={
          <NoEmployeeFound
            searchTerm={debouncedSearch}
          />
        }
      />

      <ReusableConfirmModal
        show={showModal}
        title={
          actionType === "approve"
            ? "Approve Leave"
            : "Reject Leave"
        }
        message={
          actionType === "approve"
            ? "Are you sure you want to approve this leave request?"
            : "Are you sure you want to reject this leave request?"
        }
        confirmText={
          actionType === "approve"
            ? "Approve"
            : "Reject"
        }
        cancelText="Cancel"
        confirmVariant={
          actionType === "approve"
            ? "success"
            : "danger"
        }
        onConfirm={handleStatusUpdate}
        onClose={() => {
          setShowModal(false);
          setActionType("");
          setSelectedLeaveId(null);
        }}
      />
    </Container>
  );
}