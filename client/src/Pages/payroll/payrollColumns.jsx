import React from "react";
import { Link } from "react-router-dom";
import { GoInfo } from "react-icons/go";
import { Select } from "./PayrollTablestyes";
import VerificationCircles from "../../Components/payroll/VerificationCircle";

export const getPayrollColumns = ({
  page,
  limit,
  selectedEmployees,
  handleSelectAll,
  toggleEmployeeSelect,
  formatDate,
  calculateNetPay,
  verificationStatus,
  handleCircleClick,
  handleSingleStatusChange,
  getStatusColor,
}) => [
  {
    header: (
      <input
        type="checkbox"
        checked={selectedEmployees.length > 0 && selectedEmployees.length === arguments}
        onChange={handleSelectAll}
      />
    ),
    accessor: "select",
    sortable: false,
    render: (emp) => (
      <input
        type="checkbox"
        checked={selectedEmployees.includes(emp.id)}
        onChange={() => toggleEmployeeSelect(emp.id)}
      />
    ),
  },
  {
    header: "Sl No",
    accessor: "slNo",
    sortable: false,
    render: (emp, index) => (page - 1) * limit + index + 1,
  },
  {
    header: "Employee Name",
    accessor: "employee_name",
    render: (row) => (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontWeight: 600 }}>
          {row.employee_name
            ? row.employee_name.charAt(0).toUpperCase() + row.employee_name.slice(1)
            : "N/A"}
        </span>
        <span style={{ fontSize: 12, color: "#888" }}>
          {row.email || "-"}
        </span>
      </div>
    ),
  },
  {
    header: "Employee ID",
    accessor: "employee_code",
    render: (emp) => emp.employee_code,
  },
  {
    header: "Department",
    accessor: "department",
    render: (emp) => emp.department_name || emp.department || "N/A",
  },
  {
    header: "Joining Date",
    accessor: "joining_date",
    render: (emp) => formatDate(emp.joining_date),
  },
  {
    header: "Salary",
    accessor: "basic_salary",
    render: (emp) => emp.basic_salary ?? "N/A",
  },
  {
    header: "Net Pay",
    accessor: "net_pay",
    sortable: false,
    render: (emp) => (
      <span style={{ color: "#16a34a", fontWeight: 600 }}>
        {calculateNetPay(emp).toLocaleString("en-IN")}
      </span>
    ),
  },
  {
    header: "Incentive",
    accessor: "incentive_amount",
    sortable: false,
    render: (row) => (
      <span>{Number(row.incentive_amount || 0).toLocaleString("en-IN")}</span>
    ),
  },
  {
    header: "Deduction",
    accessor: "deduction_amount",
    sortable: false,
    render: (row) => (
      <span>{Number(row.deduction_amount || 0).toLocaleString("en-IN")}</span>
    ),
  },
  {
    header: "Info",
    accessor: "info",
    sortable: false,
    render: (emp) => (
      <Link to={`/payrolldetails/${emp.id}`}>
        <GoInfo style={{ cursor: "pointer", color: "black" }} />
      </Link>
    ),
  },
  {
    header: "Verification",
    accessor: "verification",
    sortable: false,
    render: (emp) => (
      <VerificationCircles
        emp={emp}
        verificationStatus={verificationStatus}
        handleCircleClick={handleCircleClick}
      />
    ),
  },
  {
    header: "Status",
    accessor: "status",
    sortable: false,
    render: (emp) => (
      <Select
        value={emp.status || ""}
        onChange={(e) => handleSingleStatusChange(emp, e.target.value)}
        $bg={emp.status ? getStatusColor(emp.status) : "white"}
        $color={emp.status === "Pending" || !emp.status ? "black" : "white"}
      >
        <option value="OnHold">On Hold</option>
        <option value="Cancelled">Cancelled</option>
        <option value="Pending">Pending</option>
        <option value="Paid">Paid</option>
      </Select>
    ),
  },
];