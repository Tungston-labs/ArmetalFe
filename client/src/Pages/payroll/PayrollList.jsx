import React, { useState, useMemo } from 'react';
import { Container } from "./PayrollTablestyes";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";
import StatsCards from "../../Components/ StatsCards/StatsCards";
import ReusableTable from "../../Components/ReusableTable/ReusableTable";
import Pagination from "../../Components/Pagination/Pagination";
import IncentiveModal from "../../Components/payroll/IncentiveModal/IncentiveModal";
import DeductionModal from "../../Components/payroll/DeductionModal/DeductionModal";
import { getPayrollColumns } from "./payrollColumns";
import {
  usePayrollList,
  formatDate,
  calculateNetPay,
  getStatusColor,
  getPayrollCards,
} from "./usePayrollList";
import ReusableFilter from "../../Components/ReusableTable/ReusableFilter";

const PayrollList = () => {

  const LIMIT = 20;
  const [status, setStatus] = useState("");

  const {
    sortedData,
    loading,
    totalPages,
    page,
    departmentList,
    searchTerm, setSearchTerm,
    selectedMonth, setSelectedMonth,
    selectedYear, setSelectedYear,
    selectedDepartment, setSelectedDepartment,
    selectedEmployees,
    toggleEmployeeSelect,
    handleSelectAll,
    verificationStatus,
    handleCircleClick,
    handleSingleStatusChange,
    handlePageChange,
    showModal,
    selectedEmployee,
    handleCloseModal,
    showDeductionModal,
    selectedDeductionEmployee,
    handleCloseDeductionModal,
  } = usePayrollList();

  const departmentRows = Array.isArray(departmentList?.results)
    ? departmentList.results
    : Array.isArray(departmentList)
      ? departmentList
      : [];

  const departments = useMemo(
    () => departmentRows.map((d) => d.name),
    [departmentRows],
  );

  // status isn't filtered server-side, so filter it client-side on top
  // of the already-paginated/server-filtered sortedData
  const visibleRows = useMemo(() => {
    if (!Array.isArray(sortedData)) return [];
    if (!status) return sortedData;
    return sortedData.filter((row) => row.status === status);
  }, [sortedData, status]);

  const columns = getPayrollColumns({
    page,
    limit: LIMIT,
    totalRows: visibleRows.length,
    selectedEmployees,
    handleSelectAll,
    toggleEmployeeSelect,
    formatDate,
    calculateNetPay,
    verificationStatus,
    handleCircleClick,
    handleSingleStatusChange,
    getStatusColor,
  });

  const payrollCards = getPayrollCards();

  // month/year are separate numeric fields in the hook; ReusableFilter's
  // date field expects a single value, so combine to "YYYY-MM" for display
  // and split back out when the user picks a new date.
  const monthValue = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;
  const handleDateChange = (value) => {
    const [year, month] = value.split("-");
    setSelectedYear(Number(year));
    setSelectedMonth(Number(month));
  };

  return (
    <Container>
      <ReusableHeader
        title="Payroll Overview"
        breadcrumbs={["Payroll"]}
      />
      <StatsCards cards={payrollCards} />
      <ReusableFilter
        search={searchTerm}
        onSearch={setSearchTerm}
        searchPlaceholder="Search Employee Name od ID"
        department={selectedDepartment}
        departments={departments}
        onDepartment={setSelectedDepartment}

        status={status}
        statuses={[
          "Pending",
          "Paid",
          "OnHold",
          "Cancelled",
        ]}
        onStatus={setStatus}

        date={monthValue}
        onDate={handleDateChange}

        showSearch
        showDepartment
        showStatus
        showDate
      />

      <ReusableTable columns={columns} data={visibleRows} loading={loading} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {showModal && selectedEmployee && (
        <IncentiveModal
          employee={selectedEmployee}
          month={selectedMonth}
          year={selectedYear}
          onClose={handleCloseModal}
        />
      )}

      {showDeductionModal && selectedDeductionEmployee && (
        <DeductionModal
          employee={selectedDeductionEmployee}
          month={selectedMonth}
          year={selectedYear}
          onClose={handleCloseDeductionModal}
        />
      )}
    </Container>
  );
};

export default PayrollList;