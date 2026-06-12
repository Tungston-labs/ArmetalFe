import React, { useState } from "react";
import EmployeeTitle from "../../Components/EmployeeTitle";
import EmployeeIcon from "../../assets/employeeicon.svg";

import {
  Container,
  HeaderSection,
  Title,
  FilterRow,
  Select,
  TableWrapper,
  Table,
  Th,
  Td,
  Tr,
  StatusBadge,
  SummaryGrid,
  SummaryCard,
  SummaryValue,
  SummaryLabel,
  MonthInput,
} from "./LeaveReport.styles";
import { exportLeaveReportExcel } from "../../utils/leaveReportExcel";
const leaveData = [
  {
    id: 1,
    employee: "John Doe",
    department: "HR",
    leaveType: "Annual Leave",
    fromDate: "2026-06-01",
    toDate: "2026-06-03",
    days: 3,
    status: "Approved",
    reason: "Personal Work",
  },
  {
    id: 2,
    employee: "Jane Smith",
    department: "IT",
    leaveType: "Sick Leave",
    fromDate: "2026-06-10",
    toDate: "2026-06-11",
    days: 2,
    status: "Pending",
    reason: "Fever",
  },
  {
    id: 3,
    employee: "Michael",
    department: "Accounts",
    leaveType: "Casual Leave",
    fromDate: "2026-06-15",
    toDate: "2026-06-15",
    days: 1,
    status: "Rejected",
    reason: "Personal",
  },
];

const LeaveReport = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const today = new Date();

const [selectedMonth, setSelectedMonth] = useState(
  `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}`
);
const filteredData = leaveData.filter((item) => {
  const statusMatch =
    statusFilter === "All" ||
    item.status === statusFilter;

  const departmentMatch =
    departmentFilter === "All" ||
    item.department === departmentFilter;

  const leaveMonth = item.fromDate.slice(0, 7);

  const monthMatch =
    selectedMonth === leaveMonth;

  return (
    statusMatch &&
    departmentMatch &&
    monthMatch
  );
});

  const approvedCount = leaveData.filter(
    (item) => item.status === "Approved"
  ).length;

  const pendingCount = leaveData.filter(
    (item) => item.status === "Pending"
  ).length;

  const rejectedCount = leaveData.filter(
    (item) => item.status === "Rejected"
  ).length;

const handleExportExcel = () => {
  exportLeaveReportExcel(filteredData);
};

  return (
    <Container>
      <EmployeeTitle
        iconSrc={EmployeeIcon}
        showAddButton={false}
        showDropdown={false}
        showTabs={false}
        showBackArrow={false}
        showReportButton={true}
        reportButtonText="Export Excel"
        onReportClick={handleExportExcel}
      />

      <HeaderSection>
        <Title>Leave Report</Title>

        <FilterRow>
            <MonthInput
  type="month"
  value={selectedMonth}
  onChange={(e) =>
    setSelectedMonth(e.target.value)
  }
/>
          <Select
            value={departmentFilter}
            onChange={(e) =>
              setDepartmentFilter(e.target.value)
            }
          >
            <option value="All">
              All Departments
            </option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Accounts">
              Accounts
            </option>
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">
              All Status
            </option>
            <option value="Approved">
              Approved
            </option>
            <option value="Pending">
              Pending
            </option>
            <option value="Rejected">
              Rejected
            </option>
          </Select>
        </FilterRow>
      </HeaderSection>

      <SummaryGrid>
        <SummaryCard>
          <SummaryValue>
            {leaveData.length}
          </SummaryValue>
          <SummaryLabel>
            Total Requests
          </SummaryLabel>
        </SummaryCard>

        <SummaryCard>
          <SummaryValue>
            {approvedCount}
          </SummaryValue>
          <SummaryLabel>
            Approved
          </SummaryLabel>
        </SummaryCard>

        <SummaryCard>
          <SummaryValue>
            {pendingCount}
          </SummaryValue>
          <SummaryLabel>
            Pending
          </SummaryLabel>
        </SummaryCard>

        <SummaryCard>
          <SummaryValue>
            {rejectedCount}
          </SummaryValue>
          <SummaryLabel>
            Rejected
          </SummaryLabel>
        </SummaryCard>
      </SummaryGrid>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>Employee</Th>
              <Th>Department</Th>
              <Th>Leave Type</Th>
              <Th>From Date</Th>
              <Th>To Date</Th>
              <Th>Days</Th>
              <Th>Status</Th>
              <Th>Reason</Th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((leave) => (
              <Tr key={leave.id}>
                <Td>{leave.employee}</Td>
                <Td>{leave.department}</Td>
                <Td>{leave.leaveType}</Td>
                <Td>{leave.fromDate}</Td>
                <Td>{leave.toDate}</Td>
                <Td>{leave.days}</Td>

                <Td>
                  <StatusBadge
                    status={leave.status}
                  >
                    {leave.status}
                  </StatusBadge>
                </Td>

                <Td>{leave.reason}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export default LeaveReport;