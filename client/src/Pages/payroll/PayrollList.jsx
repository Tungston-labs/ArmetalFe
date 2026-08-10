import React from "react";
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

const LIMIT = 20;

const PayrollList = () => {
  const {
    sortedData,
    loading,
    totalPages,
    page,
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
    selectedMonth,
    selectedYear,
  } = usePayrollList();

  const columns = getPayrollColumns({
    page,
    limit: LIMIT,
    totalRows: sortedData.length,
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

  return (
    <Container>
      <ReusableHeader
        title="Payroll Overview"
        breadcrumbs={["Dashboard", "Payroll"]}
      />

      <StatsCards cards={payrollCards} />

      <ReusableTable columns={columns} data={sortedData} loading={loading} />

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