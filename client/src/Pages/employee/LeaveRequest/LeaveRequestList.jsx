import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLeaveRequests, patchLeaveStatus } from '../../../Redux/leaveSlice';
import { useNavigate } from 'react-router-dom';
import { getDepartments } from "../../../Redux/departmentSlice";
import { Container } from './leaveColumns.style';
import ReusableTable from '../../../Components/ReusableTable/ReusableTable';
import NoEmployeeFound from '../../../Components/No found/Noemployeefound';
import ReusableHeader from '../../../Components/ReusableTable/ReusableHeader';
import ReusableFilter from '../../../Components/ReusableTable/ReusableFilter';
import ReusableConfirmModal from '../../../Components/modals/ReusableConfirmModal';
import { getLeaveColumns } from './leaveColumns';
import StatsCards from '../../../Components/ StatsCards/StatsCards';
import {
  getPayrollCards,
} from "./leaveColumns";
export default function LeaveRequestList() {
  const dispatch = useDispatch();
  const { leaves, loading, pagination } = useSelector(state => state.leave);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const payrollCards = getPayrollCards();
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleString("en-GB", { month: "short" });
    return `${day}/${month}`;
  };

  useEffect(() => {
    dispatch(
      getLeaveRequests({
        page,
        department_id: departmentFilter || undefined,
        status: statusFilter || undefined,
        month: selectedMonth,
        year: selectedYear,
      })
    );
  }, [dispatch, page, departmentFilter, statusFilter, selectedMonth, selectedYear]);

  useEffect(() => {
    dispatch(getDepartments());
  }, [dispatch]);

  const leaveData = leaves || [];

  const filteredLeaves = leaveData.filter((leave) => {
    const name = leave?.employee?.name?.toLowerCase() || '';
    const empId = leave?.employee?.employee_id?.toLowerCase() || '';
    const search = searchText.toLowerCase();
    return name.includes(search) || empId.includes(search);
  });

  const handleStatusUpdate = async () => {
    if (!selectedLeaveId || !actionType) return;

    const status = actionType === "approve" ? "approved" : "rejected";

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
          department_id: departmentFilter || undefined,
          status: statusFilter || undefined,
          month: selectedMonth,
          year: selectedYear,
        })
      );
    } finally {
      setShowModal(false);
      setActionType("");
      setSelectedLeaveId(null);
    }
  };

  const isPastLeave = (leave) =>
    new Date(leave.to_date) < new Date().setHours(0, 0, 0, 0);

  const openApproveModal = (id) => {
    setSelectedLeaveId(id);
    setActionType("approve");
    setShowModal(true);
  };

  const openRejectModal = (id) => {
    setSelectedLeaveId(id);
    setActionType("reject");
    setShowModal(true);
  };

  const columns = getLeaveColumns({
    page,
    formatDate,
    isPastLeave,
    openApproveModal,
    openRejectModal,
  });

  return (
    <>

      <Container>
        <ReusableHeader
          title="Employees"
          breadcrumbs={["Dashboard", "Employees"]}
      
        />
              <StatsCards cards={payrollCards} />
        <ReusableFilter
          search={searchText}
          onSearch={setSearchText}

          department={departmentFilter}
          departments={["HR", "Finance", "Development", "Marketing"]}
          onDepartment={setDepartmentFilter}

          status={statusFilter}
          statuses={["Present", "Absent", "On Leave"]}
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
          emptyComponent={<NoEmployeeFound />}
        />

        <ReusableConfirmModal
          show={showModal}
          title={actionType === "approve" ? "Approve Leave" : "Reject Leave"}
          message={
            actionType === "approve"
              ? "Are you sure you want to approve this leave request?"
              : "Are you sure you want to reject this leave request?"
          }
          confirmText={actionType === "approve" ? "Approve" : "Reject"}
          cancelText="Cancel"
          confirmVariant={actionType === "approve" ? "success" : "danger"}
          onConfirm={handleStatusUpdate}
          onClose={() => {
            setShowModal(false);
            setActionType("");
            setSelectedLeaveId(null);
          }}
        />
      </Container>
    </>
  );
}