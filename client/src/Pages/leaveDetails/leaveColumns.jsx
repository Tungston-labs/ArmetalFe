import React from "react";
import { ActionButtons, ApproveButton, RejectButton } from "./LeaveRequest.Styles";

export const getLeaveColumns = ({
  page,
  formatDate,
  isPastLeave,
  openApproveModal,
  openRejectModal,
}) => [
  {
    header: "Sl No",
    accessor: "slNo",
    sortable: false,
    render: (row, index) => index + 1 + (page - 1) * 20,
  },
  {
    header: "Employee Name",
    accessor: "employee",
    render: (row) => (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontWeight: 600 }}>
          {row.employee?.name
            ? row.employee.name.charAt(0).toUpperCase() + row.employee.name.slice(1)
            : "N/A"}
        </span>
        <span style={{ fontSize: 12, color: "#888" }}>
          {row.employee?.email || "N/A"}
        </span>
      </div>
    ),
  },
  {
    header: "Leave Type",
    accessor: "leave_type",
    render: (row) =>
      row.leave_type
        ? row.leave_type.charAt(0).toUpperCase() + row.leave_type.slice(1)
        : "-",
  },
  {
    header: "Department",
    accessor: "department",
    sortable: false,
    render: (row) => row.employee?.department,
  },
  {
    header: "Start & End Date",
    accessor: "date",
    sortable: false,
    render: (row) => {
      const start = formatDate(row.from_date);
      const end = formatDate(row.to_date);
      return start === end ? (
        <span>{start}</span>
      ) : (
        <span>{start} - {end}</span>
      );
    },
  },
  {
    header: "Leave Balance",
    accessor: "leave_balance",
    sortable: false,
    render: (row) => row.employee?.total_leave ?? "0",
  },
  {
    header: "No Of Days",
    accessor: "no_of_days",
    sortable: false,
    render: (row) => row.employee?.total_leave ?? "0",
  },
 {
  header: "Reason",
  accessor: "reason",
  sortable: false,
  render: (row) => {
    const reason = row.reason || "-";

    return (
      <span
        title={reason}
        style={{
          display: "inline-block",
          maxWidth: "100px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          cursor: "pointer",
        }}
      >
        {reason}
      </span>
    );
  },
},
  {
    header: "Status",
    accessor: "status",
    sortable: false,
    render: (row) => (
      <span
        style={{
          fontWeight: 600,
          color:
            row.status === "approved" ? "#16a34a" :
            row.status === "rejected" ? "#dc2626" : "#f59e0b",
        }}
      >
        {row.status ? row.status.charAt(0).toUpperCase() + row.status.slice(1) : "Pending"}
      </span>
    ),
  },
  {
    header: "",
    accessor: "actions",
    sortable: false,
    render: (row) => (
      <div onClick={(e) => e.stopPropagation()}>
        <ActionButtons>
          <ApproveButton
            disabled={isPastLeave(row)}
            onClick={() => {
              if (isPastLeave(row)) return;
              openApproveModal(row.id);
            }}
          >
            Approve
          </ApproveButton>

          <RejectButton
            disabled={isPastLeave(row)}
            onClick={() => {
              if (isPastLeave(row)) return;
              openRejectModal(row.id);
            }}
          >
            Reject
          </RejectButton>
        </ActionButtons>
      </div>
    ),
  },
];